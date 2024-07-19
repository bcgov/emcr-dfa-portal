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
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/attachments")]
    [ApiController]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        private readonly ILogger logger;
        public AttachmentController(
            IHostEnvironment env,
            IMessagingClient messagingClient,
            IMapper mapper,
            IConfigurationHandler handler,
            ILoggerFactory factory)
        {
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
                    logger.LogError(ex, "Error uploading file");
                }
                return Ok(result);
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
