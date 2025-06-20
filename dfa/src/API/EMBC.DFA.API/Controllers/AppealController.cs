using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/appeal")]
    [ApiController]
    public class AppealController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IAppealRepository repository;

        public AppealController(IMapper mapper, IAppealRepository repository)
        {
            this.mapper = mapper;
            this.repository = repository;
        }

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        /// <summary>
        /// Create an appeal
        /// </summary>
        /// <param name="appeal">The appeal information</param>
        /// <returns>appeal id</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateAppeal([FromBody] AppealModel appeal)
        {
            if (appeal == null) return BadRequest("Appeal details cannot be empty.");

            var mappedAppeal = mapper.Map<Appeal>(appeal);
            repository.Insert(mappedAppeal);
            return Ok(mappedAppeal.Id);
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
            var appeal = repository.GetById(id);
            if (appeal == null) return NotFound();
            var model = mapper.Map<AppealModel>(appeal);
            return Ok(model);
        }
    }

    public class AppealModel
    {
        public string? Id { get; set; }
        [Required]
        public string CaseId { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public int Type { get; set; }
        public SignAndSubmitModel? SignAndSubmit { get; set; }
    }

    public class SignAndSubmitModel
    {
        public SignatureBlockModel ApplicantSignature { get; set; }
        public SignatureBlockModel SecondaryApplicantSignature { get; set; }
        public string NinetyDayDeadline { get; set; }
    }

    public class SignatureBlockModel
    {
        public string Signature { get; set; }
        public string DateSigned { get; set; }
        public string SignedName { get; set; }
    }
}
