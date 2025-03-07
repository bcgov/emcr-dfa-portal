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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/attachments")]
    [ApiController]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        // 2024-08-15 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;

        public AttachmentController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler,
            IUserService userService)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
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
        [RequestSizeLimit(36700160)]
        public async Task<ActionResult<string>> DeleteProjectAttachment(FileUpload fileUpload)
        {
            var app_parms = new dfa_DFAActionDeleteDocuments_parms();
            var proj_parms = new dfa_DeleteDocument_params();
            if (fileUpload.id != null) app_parms.AppDocID = (Guid)fileUpload.id;
            var result = await handler.DeleteFileUploadAsync(app_parms, proj_parms);
            return Ok(result);

            //return Ok(null);
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
        [RequestSizeLimit(36700160)]
        public async Task<ActionResult<string>> UpsertDeleteProjectAttachment(FileUpload fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");

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

            //return Ok(null);
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
        [RequestSizeLimit(36700160)]
        public async Task<ActionResult<string>> UpsertDeleteClaimAttachment(FileUploadClaim fileUpload)
        {
            if (fileUpload.fileData == null && fileUpload.deleteFlag == false) return BadRequest("FileUpload data cannot be empty.");
            if (fileUpload.id == null && fileUpload.deleteFlag == true) return BadRequest("FileUpload id cannot be empty on delete");

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

            //return Ok(null);
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

    /// <summary>
    /// File Upload
    /// </summary>
    public class FileUpload
    {
        public Guid? projectId { get; set; }
        public Guid? id { get; set; }
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
