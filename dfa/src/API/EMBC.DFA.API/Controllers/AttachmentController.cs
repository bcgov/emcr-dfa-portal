using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pipelines.Sockets.Unofficial.Arenas;
using static System.Net.Mime.MediaTypeNames;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/attachments")]
    [ApiController]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        private readonly ILogger logger;

        // Max file upload in bytes
        private const int MAXFILESIZE = 100 * 1_048_576; // MB

        public AttachmentController(
            IConfiguration configuration,
            IHostEnvironment env,
            IMessagingClient messagingClient,
            IMapper mapper,
            IConfigurationHandler handler,
            ILoggerFactory factory)
        {
            this.configuration = configuration;
            this.env = env;
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.handler = handler;
            logger = factory.CreateLogger<AttachmentController>();
        }

        /// <summary>
        /// Create / update / delete a file attachment
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertDeleteAttachment(FileUpload fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");
            bool error = false;

            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                logger.LogInformation("Using S3 for attachments");
                if (fileUpload.deleteFlag == true)
                {
                    var metadataDeleteParams = new MetadataDeleteParams();
                    if (fileUpload.id != null)
                    {
                        metadataDeleteParams.DocumentMetadataId = fileUpload.id.ToString();
                    }
                    string result = "Deleted";
                    try
                    {
                        result = await handler.HandleDeleteFileMetadataAsync(metadataDeleteParams);
                    }
                    catch (Exception ex)
                    {
                        error = true;
                        logger.LogError(ex, "Error uploading file");
                    }
                    return Ok(result);
                }
                else
                {
                    logger.LogInformation("Upload S3 attachments dfa_appapplication");
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
                    submissionEntity.RegardingEntitySchemaName = "dfa_appapplication";

                    /* switch based on entity type to which the document is being uploaded
                        case : bcgov_caseid
                        application : dfa_appapplication
                        project : dfa_project
                        recoveryClaim : dfa_recoveryclaim */
                    submissionEntity.RegardingEntityLookUpFieldName = "dfa_appapplication";

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
                    var parms = new dfa_DFAActionDeleteDocuments_parms();
                    if (fileUpload.id != null) parms.AppDocID = (Guid)fileUpload.id;
                    string result = "Deleted";
                    try
                    {
                        result = await handler.DeleteFileUploadAsync(parms);
                    }
                    catch (Exception ex)
                    {
                        error = true;
                        logger.LogError(ex, "Error uploading file");
                    }
                    return Ok(result);
                }
                else
                {
                    var mappedFileUpload = mapper.Map<AttachmentEntity>(fileUpload);
                    var submissionEntity = mapper.Map<SubmissionEntity>(fileUpload);
                    submissionEntity.documentCollection = Enumerable.Empty<AttachmentEntity>();
                    submissionEntity.documentCollection = submissionEntity.documentCollection.Append<AttachmentEntity>(mappedFileUpload);
                    string result = "Submitted";
                    try
                    {
                        result = await handler.HandleFileUploadAsync(submissionEntity);
                    }
                    catch (Exception ex)
                    {
                        error = true;
                        logger.LogError(ex, "Error uploading file");
                    }

                    if (error)
                    {
                        return StatusCode(500, "Error uploading file");
                    }
                    else
                    {
                        return Ok(result);
                    }
                }
            }
        }

        /// <summary>
        /// Get a list of attachments by application Id
        /// </summary>
        /// <returns> FileUploads </returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("byApplicationId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<FileUpload>>> GetAttachments(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            var useS3 = configuration.GetValue<bool>("FEATURE_USE_S3");

            if (useS3)
            {
                logger.LogInformation("Using S3 for attachments");

                IEnumerable<bcgov_documenturl> bcgovDocumentUrls = await handler.GetS3ApplicationDocumentListAsync(applicationId);
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
                IEnumerable<dfa_appdocumentlocation> dfa_appdocumentlocations = await handler.GetFileUploadsAsync(applicationId);
                IEnumerable<FileUpload> fileUploads = new FileUpload[] { };
                if (dfa_appdocumentlocations != null)
                {
                    foreach (dfa_appdocumentlocation dfa_appdocumentlocation in dfa_appdocumentlocations)
                    {
                        FileUpload fileUpload = mapper.Map<FileUpload>(dfa_appdocumentlocation);
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
        /// Create / update / delete a file attachment
        /// </summary>
        /// <param name="fileUpload">The attachment information</param>
        /// <returns>file upload id</returns>
        [HttpPost("appealdocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertDeleteProjectAppealAttachment(FileUploadAppeal fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");

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
                logger.LogInformation("Upload S3 attachments dfa_appeal");
                if (fileUpload.fileSize >= MAXFILESIZE)
                {
                    throw new Exception($"File size exceeds {MAXFILESIZE / 1_048_576.0:F2}MB limit");
                }

                var submissionEntity = mapper.Map<S3SubmissionEntity>(fileUpload);
                /* Switch based on the regarding entity type where the doc is uploaded to
                    case : incident 
                    application : dfa_appapplication
                    project : dfa_project
                    recoveryClaim : dfa_projectclaim
                    appeal: dfa_appeal"  
                */
                submissionEntity.RegardingEntitySchemaName = "dfa_appeal";

                /* switch based on entity type to which the document is being uploaded
                    case : bcgov_caseid
                    application : dfa_appapplication
                    project : dfa_project
                    recoveryClaim : dfa_recoveryclaim 
                    appeal: dfa_appealid
                */
                submissionEntity.RegardingEntityLookUpFieldName = "dfa_appealid";

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

        /// <summary>
        /// Get a list of appeal attachments by appeal Id
        /// </summary>
        /// <returns> FileUploads </returns>
        /// <param name="appealId">The appeal Id.</param>
        [HttpGet("byAppealId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<FileUploadAppeal>>> GetProjectAppealAttachments(
            [FromQuery]
            [Required]
            Guid appealId)
        {
            IEnumerable<bcgov_documenturl> bcgovDocumentUrls = await handler.GetS3ProjectAppealDocumentListAsync(appealId);
            IEnumerable<FileUploadAppeal> fileUploads = new FileUploadAppeal[] { };
            if (bcgovDocumentUrls != null)
            {
                foreach (bcgov_documenturl bcgovDocumentUrl in bcgovDocumentUrls)
                {
                    FileUploadAppeal fileUpload = mapper.Map<FileUploadAppeal>(bcgovDocumentUrl);
                    fileUploads = fileUploads.Append<FileUploadAppeal>(fileUpload);
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
    /// File Upload
    /// </summary>
    public class FileUpload
    {
        public Guid applicationId { get; set; }
        public Guid? id { get; set; }
        public string? fileName { get; set; }
        public string? fileDescription { get; set; }
        public FileCategory? fileType { get; set; }
        public RequiredDocumentType? requiredDocumentType { get; set; }
        public string? uploadedDate { get; set; }
        public string? modifiedBy { get; set; }
        public byte[]? fileData { get; set; }
        public string? contentType { get; set; }
        public int? fileSize { get; set; }
        public bool deleteFlag { get; set; }
    }

    /// <summary>
    /// Appeal S3 File Upload.
    /// </summary>
    public class FileUploadAppeal
    {
        public Guid appealId { get; set; }
        public Guid? id { get; set; }
        public string? fileName { get; set; }
        public string? fileDescription { get; set; }
        public FileCategory? fileType { get; set; }
        public RequiredDocumentType? requiredDocumentType { get; set; }
        public string? uploadedDate { get; set; }
        public string? modifiedBy { get; set; }
        public byte[]? fileData { get; set; }
        public string? contentType { get; set; }
        public int? fileSize { get; set; }
        public bool deleteFlag { get; set; }
    }
}
