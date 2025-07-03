using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/projectamendments")]
    [ApiController]
    [Authorize]
    public class ProjectAmendmentController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        private readonly IUserService userService;
        private readonly IConfiguration configuration;
        private readonly IProjectAmendmentRepository projectAmendmentRepository;

        public ProjectAmendmentController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler,
            IUserService userService,
            IConfiguration configuration,
            IProjectAmendmentRepository projectAmendmentRepository)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
            this.configuration = configuration;
            this.projectAmendmentRepository = projectAmendmentRepository;
        }

        private string currentUserId => userService.GetBCeIDBusinessId();

        /// <summary>
        /// get project amendments
        /// </summary>
        /// <param name="projectId">The project Id.</param>
        /// <returns>list of project amendments</returns>
        [HttpGet("projectamendments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentProjectAmendment>>> GetDFAProjectAmendments(string projectId)
        {
            var lstProjectAmendments = await handler.HandleProjectAmendmentList(projectId);

            return Ok(lstProjectAmendments);
        }

        /// <summary>
        /// create or update project amendment
        /// </summary>
        /// <param name="projectAmendment">The project amendment information</param>
        /// <returns>application id</returns>
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<string> UpsertProjectAmendment(DfaProjectAmendmentMain projectAmendment)
        {
            if (projectAmendment == null)
            {
                return BadRequest("Project amendment details cannot be empty.");
            }
            if (projectAmendment.ProjectAmendment != null)
            {
                if (projectAmendment.Id != null)
                {
                    projectAmendment.ProjectAmendment.AmendmentId = projectAmendment.Id.ToString();
                }
                projectAmendment.ProjectAmendment.ProjectId = projectAmendment.ProjectId;
            }
            else
            {
                projectAmendment.ProjectAmendment = new ProjectAmendment();
            }
            var result = projectAmendmentRepository.Upsert(projectAmendment.ProjectAmendment);

            return Ok(result.ToString());
        }
    }

    public class CurrentProjectAmendment
    {
        public string? AdditionalProjectCostDecision { get; set; }
        public string? Amended18MonthDeadline { get; set; }
        public string? AmendedProjectDeadlineDate { get; set; }
        public string? AmendmentApprovedDate { get; set; }
        public string? AmendmentDecision { get; set; }
        public string? AmendmentId { get; set; }
        public string? AmendmentNumber { get; set; }
        public string? AmendmentReason { get; set; }
        public string? AmendmentReceivedDate { get; set; }
        public decimal? ApprovedAdditionalProjectCost { get; set; }
        public string? CreatedDate { get; set; }
        public string? DeadlineExtensionApproved { get; set; }
        public string? EmcrDecisionComments { get; set; }
        public decimal? EstimatedAdditionalProjectCost { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool IsHidden { get; set; } = true;
        public string? ProjectId { get; set; }
        public string? RequestforAdditionalProjectCost { get; set; }
        public string? RequestforProjectDeadlineExtention { get; set; }
        public string? Stage { get; set; }
        public string? Status { get; set; }
        public List<ProjectStatusBar> StatusBar { get; set; }
        public string? StatusColor { get; set; }
        public string? StatusLastUpdated { get; set; }
    }

}
