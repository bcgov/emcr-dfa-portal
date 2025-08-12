using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using EMBC.DFA.API.Controllers;
using EMBC.Utilities.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EMBC.DFA.PUBLIC.API.Controllers
{
    /// <summary>
    /// Controller for managing amendment attachments (documents).
    /// Files are stored in S3 and related metadata is stored in Dynamics.
    /// </summary>
    [Route("api/amendment/attachments")]
    [ApiController]
    [Authorize]
    public class AmendmentAttachmentController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly ILogger logger;
        private readonly IS3Provider s3Provider;
        private readonly IDocumentUrlRepository documentUrlRepository;
        private const int ONEMEGABYTE = 1024 * 1024; // 1 MB
        private const int MAXFILESIZE = 100 * ONEMEGABYTE; // 100 MB

        public AmendmentAttachmentController(
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

            logger = factory.CreateLogger<AmendmentAttachmentController>();
        }

        /// <summary>
        /// Create / update a file attachment.
        /// </summary>
        /// <param name="amendmentFileUpload">The attachment data.</param>
        /// <returns>The ID of the inserted or updated document record.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(MAXFILESIZE)]
        public async Task<ActionResult<string>> UpsertAttachment([Required] AmendmentFileUpload amendmentFileUpload)
        {
            logger.LogInformation("AmendmentAttachmentController - UpsertAttachment");

            if (amendmentFileUpload.AmendmentId == Guid.Empty)
            {
                return BadRequest("AmendmentId is required.");
            }

            // If an ID is provided, it indicates an update operation; otherwise, it's a new insert.
            bool isAmendmentFileMetadataUpdate = amendmentFileUpload.Id.HasValue;

            // Get or generate the amendment file metadata ID, which is used in the S3 key and Dynamics record.
            var amendmentFileMetadataId = amendmentFileUpload.Id ?? Guid.NewGuid();

            string s3Key = $"dfa_amendment/{amendmentFileUpload.ProjectId}/{amendmentFileUpload.AmendmentId}/{amendmentFileMetadataId}";

            // Upsert the file to S3
            try
            {
                var file = new S3File { FileName = amendmentFileUpload.FileName, Content = amendmentFileUpload.FileData };

                var uploadFileCommand = new UploadFileCommand { File = file, Key = s3Key };

                await s3Provider.HandleCommand(uploadFileCommand);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to upload file to S3");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading file to S3 for dfa_amendment."
                );
            }

            // Upsert the attachment metadata to dynamics
            try
            {
                var amendmentFileMetadata = new AmendmentFileMetadataUpload
                {
                    Id = amendmentFileMetadataId,
                    ProjectId = amendmentFileUpload.ProjectId,
                    AmendmentId = amendmentFileUpload.AmendmentId,
                    FileName = amendmentFileUpload.FileName,
                    Description = amendmentFileUpload.Description,
                    Url = s3Key,
                    Size = amendmentFileUpload.Size,
                    MimeType = amendmentFileUpload.MimeType,
                    UploadedDate = amendmentFileUpload.UploadedDate,
                };

                var bcgovDocumentUrl = mapper.Map<AmendmentFileMetadataUpload, DocumentUrl>(amendmentFileMetadata);

                if (isAmendmentFileMetadataUpdate)
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
                logger.LogError(ex, "Failed to upsert amendment attachment record");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading file for dfa_amendment."
                );
            }

            return Ok(amendmentFileMetadataId);
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
            logger.LogInformation("AmendmentAttachmentController - DeleteAttachment");

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
                    var deleteFileCommand = new DeleteFileCommand { Key = s3Key };

                    await s3Provider.HandleCommand(deleteFileCommand);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete amendment attachment file from S3");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while deleting the file from S3 for dfa_amendment."
                );
            }

            // Delete the attachment metadata from dynamics
            try
            {
                documentUrlRepository.Delete(documentUrlId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to delete amendment attachment metadata record");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while deleting the file metadata for dfa_amendment."
                );
            }

            return Ok(documentUrlId);
        }

        /// <summary>
        /// Get a collection of amendment attachments by amendment Id.
        /// Note: This does not return the actual file data, only the dynamics attachment metadata records.
        /// Since amendments don't have a direct relationship in the database, this currently returns empty.
        /// Amendment documents should be handled through project documents with appropriate filtering.
        /// </summary>
        /// <param name="amendmentId">The amendment Id.</param>
        /// <returns>
        /// A collection of attachment metadata. 
        /// Returns an empty collection if no attachments are found. 
        /// Note: Does not include the raw file data, which must be fetched from S3.
        /// </returns>
        [HttpGet("byAmendmentId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<AmendmentFileMetadataUpload>> GetAttachmentsByAmendmentId(
            [FromQuery] [Required] Guid amendmentId
        )
        {
            logger.LogInformation("AmendmentAttachmentController - GetAttachmentsByAmendmentId");

            if (amendmentId == Guid.Empty)
            {
                return BadRequest("AmendmentId is required.");
            }

            var result = documentUrlRepository.GetByAmendmentId(amendmentId);

            if (result == null || !result.Any())
            {
                logger.LogInformation("No attachments found for amendment Id: {AmendmentId}", amendmentId);
                return Ok(Enumerable.Empty<AmendmentFileMetadataUpload>());
            }

            IEnumerable<AmendmentFileMetadataUpload> fileUploads = [];

            foreach (var documentUrl in result)
            {
                AmendmentFileMetadataUpload fileUpload = mapper.Map<AmendmentFileMetadataUpload>(documentUrl);
                fileUploads = fileUploads.Append(fileUpload);
            }

            return Ok(fileUploads);
        }

        /// <summary>
        /// Get a collection of amendment attachments by project Id.
        /// Note: This does not return the actual file data, only the dynamics attachment metadata records.
        /// </summary>
        /// <param name="projectId">The project Id.</param>
        /// <returns>
        /// A collection of attachment metadata. 
        /// Returns an empty collection if no attachments are found. 
        /// Note: Does not include the raw file data, which must be fetched from S3.
        /// </returns>
        [HttpGet("byProjectId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<AmendmentFileMetadataUpload>> GetAttachmentsByProjectId(
            [FromQuery] [Required] Guid projectId
        )
        {
            logger.LogInformation("AmendmentAttachmentController - GetAttachmentsByProjectId");

            if (projectId == Guid.Empty)
            {
                return BadRequest("ProjectId is required.");
            }

            var result = documentUrlRepository.GetByProjectId(projectId);

            if (result == null || !result.Any())
            {
                logger.LogInformation("No attachments found for project Id: {ProjectId}", projectId);
                return Ok(Enumerable.Empty<AmendmentFileMetadataUpload>());
            }

            IEnumerable<AmendmentFileMetadataUpload> fileUploads = [];

            foreach (var documentUrl in result)
            {
                // Filter for amendment documents based on category
                if (documentUrl.Category != null && documentUrl.Category.Contains("Amendment", StringComparison.OrdinalIgnoreCase))
                {
                    AmendmentFileMetadataUpload fileUpload = mapper.Map<AmendmentFileMetadataUpload>(documentUrl);
                    fileUploads = fileUploads.Append(fileUpload);
                }
            }

            return Ok(fileUploads);
        }
    }

    /// <summary>
    /// Amendment S3 File Upload.
    /// </summary>
    public class AmendmentFileUpload
    {
        public Guid? Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid AmendmentId { get; set; }
        public byte[] FileData { get; set; }
        public string? FileName { get; set; }
        public string? Description { get; set; }
        public FileCategoryAmendment Category { get; } = FileCategoryAmendment.Amendment;
        public string? UploadedDate { get; set; }
        public int? Size { get; set; }
        public string MimeType { get; set; }
        public bool? DeleteFlag { get; set; }
    }

    /// <summary>
    /// Amendment Dynamics Metadata.
    /// </summary>
    public class AmendmentFileMetadataUpload
    {
        public Guid? Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid AmendmentId { get; set; }
        public string FileName { get; set; }
        public string? Description { get; set; }
        public string Url { get; set; }
        public FileCategoryAmendment Category { get; } = FileCategoryAmendment.Amendment;
        public string? UploadedDate { get; set; }
        public int? Size { get; set; }
        public string MimeType { get; set; }
        public bool? DeleteFlag { get; set; }
    }
}
