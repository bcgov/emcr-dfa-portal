using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using EMBC.Utilities.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace EMBC.DFA.API.Controllers
{
    /// <summary>
    /// Controller for managing appeal attachments (documents).
    /// Files are stored in S3 and related metadata is stored in Dynamics.
    /// </summary>
    [Route("api/appeal/attachments")]
    [ApiController]
    [Authorize]
    public class AppealAttachmentController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly ILogger logger;
        private readonly IS3Provider s3Provider;
        private readonly IDocumentUrlRepository documentUrlRepository;
        private const int ONEMEGABYTE = 1024 * 1024; // 1 MB

        private const int MAXFILESIZE = 100 * ONEMEGABYTE; // 100 MB

        private static readonly string OriginCodePortal = "931490000";


        public AppealAttachmentController(
            IConfiguration configuration,
            IMapper mapper,
            ILoggerFactory factory,
            IS3Provider s3Provider,
            IDocumentUrlRepository documentUrlRepository
        )
        {
            this.configuration = configuration;
            this.mapper = mapper;
            this.s3Provider = s3Provider;
            this.documentUrlRepository = documentUrlRepository;

            logger = factory.CreateLogger<AppealAttachmentController>();
        }

        /// <summary>
        /// Create / update a file attachment.
        /// </summary>
        /// <param name="appealFileUpload">The attachment data.</param>
        /// <returns>The ID of the inserted or updated document record.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertAttachment([Required] AppealFileUpload appealFileUpload)
        {
            logger.LogInformation("AppealAttachmentController - UpsertAttachment");

            if (appealFileUpload.AppealId == Guid.Empty)
            {
                return BadRequest("AppealId is required.");
            }

            // If an ID is provided, it indicates an update operation; otherwise, it's a new insert.
            bool isAppealFileMetadataUpdate = appealFileUpload.Id.HasValue;

            // Get or generate the appeal file metadata ID, which is used in the S3 key and Dynamics record.
            var appealFileMetadataId = appealFileUpload.Id ?? Guid.NewGuid();

            // Add the Origin Code
            appealFileUpload.OriginCode = OriginCodePortal;

            string s3Key = $"dfa_appeal/{appealFileUpload.AppealId}/{appealFileMetadataId}";

            // Upsert the file to S3
            try
            {
                var file = new S3File { FileName = appealFileUpload.FileName, Content = appealFileUpload.FileData };

                var uploadFileCommand = new UploadFileCommand { File = file, Key = s3Key };

                await s3Provider.HandleCommand(uploadFileCommand);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to upload file to S3");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading file to S3 for dfa_appeal."
                );
            }

            // Upsert the attachment metadata to dynamics
            try
            {
                var appealFileMetadata = new AppealFileMetadataUpload
                {
                    Id = appealFileMetadataId,
                    AppealId = appealFileUpload.AppealId,
                    FileName = appealFileUpload.FileName,
                    Description = appealFileUpload.Description,
                    Url = s3Key,
                    Size = appealFileUpload.Size,
                    MimeType = appealFileUpload.MimeType,
                    UploadedDate = appealFileUpload.UploadedDate,
                    OriginCode = appealFileUpload.OriginCode
                };

                var bcgovDocumentUrl = mapper.Map<AppealFileMetadataUpload, DocumentUrl>(appealFileMetadata);

                if (isAppealFileMetadataUpdate)
                {
                    // Update existing record
                    documentUrlRepository.Update(bcgovDocumentUrl);
                }
                else
                {
                    // Insert new record
                    documentUrlRepository.Insert(bcgovDocumentUrl);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to upsert appeal attachment record");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading file for dfa_appeal."
                );
            }

            return Ok(appealFileMetadataId);
        }

        /// <summary>
        /// Delete a file attachment.
        /// </summary>
        /// <param name="documentUrlId">The attachment id.</param>
        /// <returns>The ID of the deleted record.</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> DeleteAttachment([Required] Guid documentUrlId)
        {
            logger.LogInformation("AppealAttachmentController - DeleteAttachment");

            if (documentUrlId == Guid.Empty)
            {
                return BadRequest("DocumentUrl Id is required.");
            }

            var documentUrlRecord = documentUrlRepository.FirstOrDefault(query => query.Id == documentUrlId);

            // Delete the file from S3
            try
            {
                string s3Key = documentUrlRecord?.Url;

                if (!string.IsNullOrEmpty(s3Key))
                {
                    var uploadFileCommand = new DeleteFileCommand { Key = s3Key };

                    await s3Provider.HandleCommand(uploadFileCommand);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete appeal attachment file from S3");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while deleting the file from S3 for dfa_appeal."
                );
            }

            // Delete the attachment metadata from dynamics
            try
            {
                documentUrlRepository.Delete(documentUrlId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete appeal attachment metadata record");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while deleting the file metadata for dfa_appeal."
                );
            }

            return Ok(documentUrlId);
        }

        /// <summary>
        /// Get a collection of appeal attachments by appeal Id.
        /// Note: This does not return the actual file data, only the dynamics attachment metadata records.
        /// </summary>
        /// <param name="appealId">The appeal Id.</param>
        /// <returns>
        /// A collection of attachment metdata. 
        /// Returns an empty collection if no attachments are found. 
        /// Note: Does not include the raw file data, which must be fetched from S3.
        /// </returns>
        [HttpGet("byAppealId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<AppealFileMetadataUpload>> GetAttachmentsByAppealId(
            [FromQuery] [Required] Guid appealId
        )
        {
            logger.LogInformation("AppealAttachmentController - GetAttachments");

            if (appealId == Guid.Empty)
            {
                return BadRequest("AppealId is required.");
            }

            var result = documentUrlRepository.GetByAppealId(appealId);

            if (result == null || !result.Any())
            {
                logger.LogInformation("No attachments found for appeal Id: {AppealId}", appealId);
                return Ok(Enumerable.Empty<AppealFileMetadataUpload>());
            }

            IEnumerable<AppealFileMetadataUpload> fileUploads = [];

            foreach (var documentUrl in result)
            {
                AppealFileMetadataUpload fileUpload = mapper.Map<AppealFileMetadataUpload>(documentUrl);
                fileUploads = fileUploads.Append(fileUpload);
            }

            return Ok(fileUploads);
        }

        /// <summary>
        /// Get a collection of appeal attachments by case Id.
        /// Note: This does not return the actual file data, only the dynamics attachment metadata records.
        /// </summary>
        /// <param name="caseId">The case Id.</param>
        /// <returns>
        /// A collection of attachment metdata. 
        /// Returns an empty collection if no attachments are found. 
        /// Note: Does not include the raw file data, which must be fetched from S3.
        /// </returns>
        [HttpGet("byCaseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<AppealFileMetadataUpload>> GetAttachmentsByCaseId([FromQuery] [Required] Guid caseId)
        {
            logger.LogInformation("AppealAttachmentController - GetAttachments");

            if (caseId == Guid.Empty)
            {
                return BadRequest("CaseId is required.");
            }

            var result = documentUrlRepository.GetByCaseId(caseId);

            if (result == null || !result.Any())
            {
                logger.LogInformation("No attachments found for case Id: {CaseId}", caseId);
                return Ok(Enumerable.Empty<AppealFileMetadataUpload>());
            }

            IEnumerable<AppealFileMetadataUpload> fileUploads = [];

            foreach (var documentUrl in result)
            {
                AppealFileMetadataUpload fileUpload = mapper.Map<AppealFileMetadataUpload>(documentUrl);
                fileUploads = fileUploads.Append(fileUpload);
            }

            return Ok(fileUploads);
        }
    }

    /// <summary>
    /// Appeal S3 File Upload.
    /// </summary>
    public class AppealFileUpload
    {
        public Guid? Id { get; set; }
        public Guid AppealId { get; set; }
        public byte[] FileData { get; set; }
        public string? FileName { get; set; }
        public string? Description { get; set; }
        public FileCategory Category { get; } = FileCategory.Appeal;
        public string? UploadedDate { get; set; }
        public int? Size { get; set; }
        public string MimeType { get; set; }
        public bool? DeleteFlag { get; set; }
        public string? OriginCode { get; set; }
    }

    /// <summary>
    /// Appeal Dynamics Metadata
    /// </summary>
    public class AppealFileMetadataUpload
    {
        public Guid? Id { get; set; }
        public Guid AppealId { get; set; }
        public string FileName { get; set; }
        public string? Description { get; set; }
        public string Url { get; set; }
        public FileCategory Category { get; } = FileCategory.Appeal;
        public string? UploadedDate { get; set; }
        public int? Size { get; set; }
        public string MimeType { get; set; }
        public bool? DeleteFlag { get; set; }
        public string? OriginCode { get; set; }
    }
}
