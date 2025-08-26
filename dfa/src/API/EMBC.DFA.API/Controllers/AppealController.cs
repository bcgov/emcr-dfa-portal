using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Model;
using EMBC.Database.Resources;
using EMBC.Database.Shared.Database;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk.Client;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppealController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IAppealRepository repository;
        private readonly IOrganizationServiceAsync organizationService;

        public AppealController(
            IMapper mapper,
            IAppealRepository repository,
            IOrganizationServiceAsync organizationService)
        {
            this.mapper = mapper;
            this.repository = repository;
            this.organizationService = organizationService;
        }

        private async Task UploadSignatureAnnotationAsync(
            string entityName,
            Guid entityId,
            string signature,
            string fileName,
            string displayName,
            string note)
        {
            if (signature != null)
            {
                var base64Data = signature;
                if (base64Data.Contains(","))
                    base64Data = base64Data.Substring(base64Data.IndexOf(',') + 1);

                await organizationService.UploadFileAsAnnotationAsync(
                    entityName,
                    entityId,
                    fileName,
                    "image/png",
                    base64Data,
                    displayName,
                    note);
            }
        }

        private async Task<string?> GetSignatureAnnotationAsync(
          string entityName,
          Guid entityId,
          string fileName)
        {
            
            var annotation = await organizationService.GetAnnotationByFileNameAsync(entityName, entityId, fileName);
            return annotation?.FileContent ?? null;
            
        }

        /// <summary>
        /// Create an appeal
        /// </summary>
        /// <param name="appeal">The appeal information</param>
        /// <returns>appeal id</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateAppeal([FromBody] AppealModel appeal)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (appeal == null) return BadRequest("Appeal details cannot be empty.");

            if (!Enum.IsDefined(typeof(DFA_AppealType), appeal.Type))
                return BadRequest("Type is required and must be a valid value.");

            var mappedAppeal = mapper.Map<Appeal>(appeal);
            if (appeal.Type == DFA_AppealType.Amount)
                mappedAppeal.ProcessId = Guid.Empty;

            var appealId = repository.Insert(mappedAppeal);
            return Ok(appealId);
        }

        /// <summary>
        /// Retrieve an appeal
        /// </summary>
        /// <param name="id">The appeal id</param>
        /// <returns>The appeal information</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AppealModel>> GetAppeal(Guid id)
        {
            var appeal = repository.FirstOrDefault(e => e.Id == id);
            if (appeal == null) return NotFound();
            var model = mapper.Map<AppealModel>(appeal);

            model.Signature = await GetSignatureAnnotationAsync(
                "dfa_appeal",
                id,
                "applicant_signature.png");

            return Ok(model);
        }

        /// <summary>
        /// Update an appeal
        /// </summary>
        /// <param name="appeal">The appeal information</param>
        /// <returns>appeal id</returns>
        [HttpPost("update")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAppeal([FromBody] AppealUpdateRequest appeal)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (appeal == null) return BadRequest("Appeal details cannot be empty.");

            if (!Enum.IsDefined(typeof(DFA_AppealType), appeal.Type))
                return BadRequest("Type is required and must be a valid value.");

            var mappedAppeal = mapper.Map<Appeal>(appeal);

            var updateAppeal = repository.Update(mappedAppeal);

            await UploadSignatureAnnotationAsync(
                "dfa_appeal",
                appeal.Id,
                appeal.Signature,
                 "applicant_signature.png",
                "Signature of Applicant",
                "This is the uploaded applicant signature.");

            return Ok(updateAppeal);
        }
    }

    public class AppealUpdateRequest
    {
        [Required]
        public Guid Id { get; set; }
        public Guid? ApplicationId { get; set; }
        [Required]
        public Guid CaseId { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public DFA_AppealType Type { get; set; }
        public string? DateSigned { get; set; }
        public string? SignedName { get; set; }
        public string? Signature { get; set; }
        public bool? ReviewedEvaluatorReport { get; set; }
    }

    public class AppealModel
    {
       // public Guid? ApplicationId { get; set; }
        [Required]
        public Guid? CaseId { get; set; }
        public string? Status { get; set; }
        public string? Reason { get; set; }
        public DFA_AppealType? Type { get; set; }
        public string? DateSigned { get; set; }
        public string? SignedName { get; set; }
        public string? Signature { get; set; }
        public bool? ReviewedEvaluatorReport { get; set; }
    }

    public class SignAndSubmitModel
    {
        public SignatureBlock ApplicantSignature { get; set; }
        public SignatureBlock SecondaryApplicantSignature { get; set; }
    }

}
