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
        [RequestSizeLimit(36700160)]
        public async Task<ActionResult<string>> UpsertDeleteAttachment(FileUpload fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");
            bool error = false;

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
                    if (fileUpload.fileSize >= (51 * 1024 * 1024))
                    {
                        throw new Exception("File size exceeds 50MB limit");
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
                    string result = "Submitted";

                    try
                    {
                        result = await handler.HandleS3FileUploadAsync(submissionEntity);
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
}
