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

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        private async Task UploadSignatureAnnotationAsync(
            string entityName,
            Guid entityId,
            SignatureBlockModel signature,
            string fileName,
            string displayName,
            string note)
        {
            if (signature?.Signature != null)
            {
                var base64Data = signature.Signature;
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

        /// <summary>
        /// Create an appeal
        /// </summary>
        /// <param name="appeal">The appeal information</param>
        /// <returns>appeal id</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAppeal([FromBody] AppealModel appeal)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (appeal == null) return BadRequest("Appeal details cannot be empty.");

            if (!Enum.IsDefined(typeof(DFA_AppealType), appeal.Type))
                return BadRequest("Type is required and must be a valid value.");

            var mappedAppeal = mapper.Map<Appeal>(appeal);

            var appealId = repository.Insert(mappedAppeal);

            await UploadSignatureAnnotationAsync(
                "dfa_appeal",
                appealId,
                appeal.SignAndSubmit?.ApplicantSignature,
                "applicant_signature.png",
                "Signature of Applicant",
                "This is the uploaded applicant signature.");

            await UploadSignatureAnnotationAsync(
                "dfa_appeal",
                appealId,
                appeal.SignAndSubmit?.SecondaryApplicantSignature,
                "secondary_applicant_signature.png",
                "Signature of Secondary Applicant",
                "This is the uploaded secondary applicant signature.");
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
        public IActionResult GetAppeal(Guid id)
        {
            var appeal = repository.FirstOrDefault(e => e.Id == id);
            if (appeal == null) return NotFound();
            var model = mapper.Map<AppealModel>(appeal);
            return Ok(model);
        }
    }

    public class AppealModel
    {
        public Guid? ApplicationId { get; set; }
        [Required]
        public Guid CaseId { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public DFA_AppealType Type { get; set; }
        public SignAndSubmitModel SignAndSubmit { get; set; }
    }

    public class SignAndSubmitModel
    {
        public SignatureBlockModel ApplicantSignature { get; set; }
        public SignatureBlockModel SecondaryApplicantSignature { get; set; }
    }

    public class SignatureBlockModel
    {
        public string? Signature { get; set; }
        public string? DateSigned { get; set; }
        public string? SignedName { get; set; }
    }
}
