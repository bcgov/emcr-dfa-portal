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
            
            try
            {
                System.Console.WriteLine($"Upserting amendment. ID: {projectAmendment.Id}, ProjectId: {projectAmendment.ProjectId}");
                
                if (projectAmendment.ProjectAmendment != null)
                {
                    // Update existing amendment
                    if (projectAmendment.Id != null)
                    {
                        projectAmendment.ProjectAmendment.Id = projectAmendment.Id.Value; // Set the primary key
                        projectAmendment.ProjectAmendment.AmendmentId = projectAmendment.Id.Value.ToString();
                    }
                    projectAmendment.ProjectAmendment.ProjectId = projectAmendment.ProjectId;
                    System.Console.WriteLine($"Updating existing amendment: {projectAmendment.ProjectAmendment.AmendmentId}");
                }
                else
                {
                    // Create new amendment
                    projectAmendment.ProjectAmendment = new ProjectAmendment();
                    
                    // Generate a new GUID for the primary key
                    var newAmendmentId = Guid.NewGuid();
                    projectAmendment.ProjectAmendment.Id = newAmendmentId;
                    projectAmendment.ProjectAmendment.AmendmentId = newAmendmentId.ToString();
                    
                    projectAmendment.ProjectAmendment.AmendmentNumber = projectAmendmentRepository.GetNextAmendmentNumber(projectAmendment.ProjectId);
                    projectAmendment.ProjectAmendment.ProjectId = projectAmendment.ProjectId;
                    System.Console.WriteLine($"Creating new amendment. ID: {newAmendmentId}, Number: {projectAmendment.ProjectAmendment.AmendmentNumber}");
                }
                
                var result = projectAmendmentRepository.Upsert(projectAmendment.ProjectAmendment);
                System.Console.WriteLine($"Upsert result: {result}");

                return Ok(result.ToString());
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"Exception during upsert: {ex.Message}");
                System.Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// delete project amendment
        /// </summary>
        /// <param name="amendmentId">The amendment Id.</param>
        /// <returns>success status</returns>
        [HttpDelete("{amendmentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> DeleteProjectAmendment(string amendmentId)
        {
            if (string.IsNullOrEmpty(amendmentId))
            {
                return BadRequest("Amendment ID cannot be empty.");
            }

            try
            {
                System.Console.WriteLine($"Attempting to delete amendment with ID: {amendmentId}");
                
                // Use the handler to delete amendment (same system as GET endpoint uses)
                // This ensures consistency between GET and DELETE operations
                var result = await handler.HandleProjectAmendmentDelete(amendmentId);
                
                if (!string.IsNullOrEmpty(result))
                {
                    System.Console.WriteLine($"Amendment deleted successfully: {amendmentId}");
                    return Ok(true);
                }
                else
                {
                    System.Console.WriteLine($"Amendment deletion failed: {amendmentId}");
                    return NotFound("Amendment could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"Exception during delete: {ex.Message}");
                System.Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
        public int? AmendmentNumber { get; set; }
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
