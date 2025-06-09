using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using EMBC.DFA.PUBLIC.API.Controllers;
using EMBC.DFA.PUBLIC.API.Services;
using EMBC.Utilities.S3;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Namotion.Reflection;
using Org.BouncyCastle.Asn1.Ocsp;
using Microsoft.Extensions.Logging;
using Pipelines.Sockets.Unofficial.Arenas;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/attachments")]
    [ApiController]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;

        private readonly ILogger logger;
        // 2024-08-15 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;
        private readonly IS3Provider s3Provider;
        private readonly ErrorParser errorParser;

        // Max file upload in bytes
        private const int MAXFILESIZE = 100 * 1_048_576;   // MB

        public AttachmentController(
            IConfiguration configuration,
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler,
            IUserService userService,
            IS3Provider s3Provider,
            ILoggerFactory factory)
        {
            this.configuration = configuration;
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
            this.s3Provider = s3Provider;
            this.errorParser = new ErrorParser();
            logger = factory.CreateLogger<AttachmentController>();
        }

        private string currentUserId => userService.GetBCeIDBusinessId();

        /// <summary>
        /// Create / update / delete a file attachment
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> DeleteProjectAttachment(FileUpload fileUpload)
        {
            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                var metadataDeleteParams = new MetadataDeleteParams();
                if (fileUpload.id != null)
                {
                    metadataDeleteParams.DocumentMetadataId = fileUpload.id.ToString();
                }
                var result = await handler.HandleDeleteFileMetadataAsync(metadataDeleteParams);
                return Ok(result);
            }
            else
            {
                var app_parms = new dfa_DFAActionDeleteDocuments_parms();
                var proj_parms = new dfa_DeleteDocument_params();
                if (fileUpload.id != null) app_parms.AppDocID = (Guid)fileUpload.id;
                var result = await handler.DeleteFileUploadAsync(app_parms, proj_parms);
                return Ok(result);
            }
        }

        /// <summary>
        /// Create / update / delete a file attachment
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost("projectdocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertDeleteProjectAttachment(FileUpload fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");

            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                if (fileUpload.deleteFlag == true)
                {
                    var metadataDeleteParams = new MetadataDeleteParams();
                    if (fileUpload.id != null)
                    {
                        metadataDeleteParams.DocumentMetadataId = fileUpload.id.ToString();
                    }
                    var result = await handler.HandleDeleteFileMetadataAsync(metadataDeleteParams);
                    return Ok(result);
                }
                else
                {
                    logger.LogInformation("Upload S3 attachments dfa_project");
                    if (fileUpload.fileSize >= MAXFILESIZE)
                    {
                        throw new Exception($"File size exceeds {MAXFILESIZE / 1_048_576.0:F2}MB limit");
                    }

                    var submissionEntity = mapper.Map<S3SubmissionEntity>(fileUpload);
                    /* Switch based on the regarding entity type where the doc is uploaded to
                        case : incident 
                        application : dfa_appapplication
                        project : dfa_project
                        recoveryClaim : dfa_projectclaim"  */
                    submissionEntity.RegardingEntitySchemaName = "dfa_project";

                    /* switch based on entity type to which the document is being uploaded
                        case : bcgov_caseid
                        application : dfa_appapplication
                        project : dfa_project
                        recoveryClaim : dfa_recoveryclaim */
                    submissionEntity.RegardingEntityLookUpFieldName = "dfa_project";

                    try
                    {
                        var result = await handler.HandleS3FileUploadAsync(submissionEntity);
                        return Ok(result);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Failed to upload file to S3.");
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading file.");
                    }
                }
            }
            else
            {
                if (fileUpload.deleteFlag == true)
                {
                    var app_params = new dfa_DFAActionDeleteDocuments_parms();
                    var proj_params = new dfa_DeleteDocument_params();
                    if (fileUpload.id != null)
                    {
                        Console.WriteLine("testing doc delete");
                        proj_params.DocLocationID = (Guid)fileUpload.id;
                        proj_params.DocLocationType = "Project";
                    }
                    var result = await handler.DeleteFileUploadAsync(app_params, proj_params);
                    return Ok(result);
                }
                else
                {
                    var mappedFileUpload = mapper.Map<AttachmentEntity>(fileUpload);
                    var submissionEntity = mapper.Map<SubmissionEntity>(fileUpload);
                    submissionEntity.documentCollection = Enumerable.Empty<AttachmentEntity>();
                    submissionEntity.documentCollection = submissionEntity.documentCollection.Append<AttachmentEntity>(mappedFileUpload);
                    var result = await handler.HandleFileUploadAsync(submissionEntity);
                    return Ok(result);
                }
            }
        }

        /// <summary>
        /// Create / update / delete a file attachment
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost("claimdocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertDeleteClaimAttachment(FileUploadClaim fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");

            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3) 
            {
                if (fileUpload.deleteFlag == true)
                {
                    var metadataDeleteParams = new MetadataDeleteParams();
                    if (fileUpload.id != null)
                    {
                        metadataDeleteParams.DocumentMetadataId = fileUpload.id.ToString();
                    }
                    var result = await handler.HandleDeleteFileMetadataAsync(metadataDeleteParams);
                    return Ok(result);
                }
                else
                {
                    logger.LogInformation("Upload S3 attachments dfa_projectclaim");
                    if (fileUpload.fileSize >= MAXFILESIZE)
                    {
                        throw new Exception($"File size exceeds {MAXFILESIZE / 1_048_576.0:F2}MB limit");
                    }

                    var submissionEntity = mapper.Map<S3SubmissionEntity>(fileUpload);
                    /* Switch based on the regarding entity type where the doc is uploaded to
                        case : incident 
                        application : dfa_appapplication
                        project : dfa_project
                        recoveryClaim : dfa_projectclaim"  */
                    submissionEntity.RegardingEntitySchemaName = "dfa_projectclaim";

                    /* switch based on entity type to which the document is being uploaded
                        case : bcgov_caseid
                        application : dfa_appapplication
                        project : dfa_project
                        recoveryClaim : dfa_recoveryclaim */
                    submissionEntity.RegardingEntityLookUpFieldName = "dfa_recoveryclaim";

                    try
                    {
                        var result = await handler.HandleS3FileUploadAsync(submissionEntity);
                        return Ok(result);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Failed to upload file to S3.");
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading file.");
                    }
                }
            }
            else
            {
                if (fileUpload.deleteFlag == true)
                {
                    var app_params = new dfa_DFAActionDeleteDocuments_parms();
                    var claim_params = new dfa_DeleteDocument_params();
                    if (fileUpload.id != null)
                    {
                        claim_params.DocLocationID = (Guid)fileUpload.id;
                        claim_params.DocLocationType = "Claim";
                    }
                    var result = await handler.DeleteFileUploadAsync(app_params, claim_params);
                    return Ok(result);
                }
                else
                {
                    var mappedFileUpload = mapper.Map<AttachmentEntity>(fileUpload);
                    var submissionEntity = mapper.Map<SubmissionEntityClaim>(fileUpload);
                    submissionEntity.documentCollection = Enumerable.Empty<AttachmentEntity>();
                    submissionEntity.documentCollection = submissionEntity.documentCollection.Append<AttachmentEntity>(mappedFileUpload);
                    var result = await handler.HandleFileUploadClaimAsync(submissionEntity);
                    return Ok(result);
                }
            }
        }

        /// <summary>
        /// Upsert (create or update) a project appeal attachment.
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost("projectAppealDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertProjectAppealAttachment(FileUpload fileUpload)
        {
            // return Ok("WIP: projectAppealDocument");

            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");
            if (useS3)
            {
                return await UpsertProjectAppealS3Attachment(fileUpload);
            }

            return await UpsertProjectAppealNonS3Attachment(fileUpload);
        }

        /// <summary>
        /// Delete a project appeal attachment.
        /// </summary>
        /// <param name="id">The attachment id</param>
        /// <returns>file upload id</returns>
        [HttpDelete("projectAppealDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> DeleteProjectAppealAttachment(Guid id)
        {
            // return Ok("WIP: DeleteProjectAppealAttachment");

            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");
            if (useS3)
            {
                return await DeleteProjectAppealS3Attachment(id);
            }

            return await DeleteProjectAppealNonS3Attachment(id);
        }

        /// <summary>
        /// Delete a project appeal S3 attachment.
        /// </summary>
        /// <param name="id">The attachment id</param>
        /// <returns></returns>
        private async Task<ActionResult<string>> DeleteProjectAppealS3Attachment(Guid id)
        {
            var metadataDeleteParams = new MetadataDeleteParams();

            metadataDeleteParams.DocumentMetadataId = id.ToString();

            var result = await handler.HandleDeleteFileMetadataAsync(metadataDeleteParams);

            return Ok(result);
        }

        /// <summary>
        /// Delete a project appeal non-S3 attachment.
        /// </summary>
        /// <param name="id">The attachment id</param>
        /// <returns></returns>
        private async Task<ActionResult<string>> DeleteProjectAppealNonS3Attachment(Guid id)
        {
            var app_params = new dfa_DFAActionDeleteDocuments_parms();
            var proj_params = new dfa_DeleteDocument_params();

            proj_params.DocLocationID = id;
            proj_params.DocLocationType = "Project";

            var result = await handler.DeleteFileUploadAsync(app_params, proj_params);

            return Ok(result);
        }

        /// <summary>
        /// Upsert a project appeal S3 attachment.
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <returns></returns>
        private async Task<ActionResult<string>> UpsertProjectAppealS3Attachment(
            FileUpload fileUpload
        )
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false)
            {
                return BadRequest("FileUpload data cannot be empty.");
            }

            logger.LogInformation("Upload S3 attachments dfa_project");

            if (fileUpload.fileSize >= MAXFILESIZE)
            {
                throw new Exception($"File size exceeds {MAXFILESIZE / 1_048_576.0:F2}MB limit");
            }

            var submissionEntity = mapper.Map<S3SubmissionEntity>(fileUpload);
            /*
            Switch based on the regarding entity type where the doc is uploaded to.
            - case: incident
            - application: dfa_appapplication
            - project: dfa_project
            - recoveryClaim: dfa_projectclaim
            */
            submissionEntity.RegardingEntitySchemaName = "dfa_project";

            /*
            Switch based on entity type to which the document is being uploaded.
            - case: bcgov_caseid
            - application: dfa_appapplication
            - project: dfa_project
            - recoveryClaim: dfa_recoveryclaim
            */
            submissionEntity.RegardingEntityLookUpFieldName = "dfa_project";

            try
            {
                var result = await handler.HandleS3FileUploadAsync(submissionEntity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to upload file to S3.");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading file."
                );
            }
        }

        /// <summary>
        /// Upsert a project appeal non-S3 attachment.
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <returns></returns>
        private async Task<ActionResult<string>> UpsertProjectAppealNonS3Attachment(
            FileUpload fileUpload
        )
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false)
            {
                return BadRequest("FileUpload data cannot be empty.");
            }

            var mappedFileUpload = mapper.Map<AttachmentEntity>(fileUpload);
            var submissionEntity = mapper.Map<SubmissionEntity>(fileUpload);

            submissionEntity.documentCollection = Enumerable.Empty<AttachmentEntity>();
            submissionEntity.documentCollection =
                submissionEntity.documentCollection.Append<AttachmentEntity>(mappedFileUpload);

            var result = await handler.HandleFileUploadAsync(submissionEntity);

            return Ok(result);
        }

        /// <summary>
        /// Get a list of attachments by project Id
        /// </summary>
        /// <returns> FileUploads </returns>
        /// <param name="projectId">The project Id.</param>
        [HttpGet("byProjectIdId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<FileUpload>>> GetProjectAttachments(
            [FromQuery]
            [Required]
            Guid projectId)
        {
            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                IEnumerable<bcgov_documenturl> bcgovDocumentUrls = await handler.GetS3ProjectDocumentListAsync(projectId);
                IEnumerable<FileUpload> fileUploads = new FileUpload[] { };
                if (bcgovDocumentUrls != null)
                {
                    foreach (bcgov_documenturl bcgovDocumentUrl in bcgovDocumentUrls)
                    {
                        FileUpload fileUpload = mapper.Map<FileUpload>(bcgovDocumentUrl);
                        fileUploads = fileUploads.Append<FileUpload>(fileUpload);
                    }
                    return Ok(fileUploads);
                }
                else
                {
                    return Ok(null);
                }
            }
            else
            {
                IEnumerable<dfa_projectdocumentlocation> dfa_projectdocumentlocations = await handler.GetProjectFileUploadsAsync(projectId);
                IEnumerable<FileUpload> fileUploads = new FileUpload[] { };
                if (dfa_projectdocumentlocations != null)
                {
                    foreach (dfa_projectdocumentlocation dfa_projectdocumentlocation in dfa_projectdocumentlocations)
                    {
                        FileUpload fileUpload = mapper.Map<FileUpload>(dfa_projectdocumentlocation);
                        fileUploads = fileUploads.Append<FileUpload>(fileUpload);
                    }
                    return Ok(fileUploads);
                }
                else
                {
                    return Ok(null);
                }
            }
        }

        /// <summary>
        /// Get a list of attachments by claim Id
        /// </summary>
        /// <returns> FileUploads </returns>
        /// <param name="claimId">The claim Id.</param>
        [HttpGet("byclaimId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<FileUploadClaim>>> GetClaimAttachments(
            [FromQuery]
            [Required]
            Guid claimId)
        {
            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                IEnumerable<bcgov_documenturl> bcgovDocumentUrls = await handler.GetS3ProjectClaimDocumentListAsync(claimId);
                IEnumerable<FileUploadClaim> fileUploads = new FileUploadClaim[] { };
                if (bcgovDocumentUrls != null)
                {
                    foreach (bcgov_documenturl bcgovDocumentUrl in bcgovDocumentUrls)
                    {
                        FileUploadClaim fileUpload = mapper.Map<FileUploadClaim>(bcgovDocumentUrl);
                        fileUploads = fileUploads.Append<FileUploadClaim>(fileUpload);
                    }
                    return Ok(fileUploads);
                }
                else
                {
                    return Ok(null);
                }
            }
            else
            {
                IEnumerable<dfa_projectclaimdocumentlocation> dfa_projectclaimdocumentlocations = await handler.GetProjectClaimFileUploadsAsync(claimId);
                IEnumerable<FileUploadClaim> fileUploads = new FileUploadClaim[] { };
                if (dfa_projectclaimdocumentlocations != null)
                {
                    foreach (dfa_projectclaimdocumentlocation dfa_projectclaimdocumentlocation in dfa_projectclaimdocumentlocations)
                    {
                        FileUploadClaim fileUpload = mapper.Map<FileUploadClaim>(dfa_projectclaimdocumentlocation);
                        fileUploads = fileUploads.Append<FileUploadClaim>(fileUpload);
                    }
                    return Ok(fileUploads);
                }
                else
                {
                    return Ok(null);
                }
            }
        }
    }

    /// <summary>
    /// File Upload
    /// </summary>
    public class FileUpload
    {
        public Guid? projectId { get; set; }
        public Guid? id { get; set; }
        public Guid? documentMetadataId { get; set; }
        public string? fileName { get; set; }
        public string? fileDescription { get; set; }
        public FileCategory? fileType { get; set; }
        public string? fileTypeText { get; set; }
        public RequiredDocumentType? requiredDocumentType { get; set; }
        public string? uploadedDate { get; set; }
        public string? modifiedBy { get; set; }
        public byte[]? fileData { get; set; }
        public string? contentType { get; set; }
        public int? fileSize { get; set; }
        public bool deleteFlag { get; set; }
        public DFAProjectMain? project { get; set; }
    }

    public class FileUploadClaim
    {
        public Guid? claimId { get; set; }
        public Guid? id { get; set; }
        public string? fileName { get; set; }
        public string? fileDescription { get; set; }
        public FileCategoryClaim? fileType { get; set; }
        public string? fileTypeText { get; set; }
        public RequiredDocumentTypeClaim? requiredDocumentType { get; set; }
        public string? uploadedDate { get; set; }
        public string? modifiedBy { get; set; }
        public byte[]? fileData { get; set; }
        public string? contentType { get; set; }
        public int? fileSize { get; set; }
        public bool deleteFlag { get; set; }
    }
    public class ApplicationReviewPDFUpload
    {
        public Guid? dfa_appapplicationid { get; set; }
        public Guid? id { get; set; }
        public string? fileName { get; set; }
        public string? fileDescription { get; set; }
        public FileCategory? fileType { get; set; }
        // public string? fileTypeText { get; set; }
        public string? uploadedDate { get; set; }
        public byte[]? fileData { get; set; }
        public string? contentType { get; set; }
        public int? fileSize { get; set; }
        public bool deleteFlag { get; set; }
    }
}
