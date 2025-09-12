using AutoMapper;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using System;
using Microsoft.AspNetCore.Mvc;
using static StackExchange.Redis.Role;
using Microsoft.AspNetCore.Http;
using EMBC.Database.Shared.Contract;
using EMBC.DFA.PUBLIC.API.Controllers;

namespace EMBC.DFA.API.Controllers
{
    /// <summary>
    /// Controller for managing public project appeals.
    /// </summary>
    [ApiController]
    [Route("api/projectappeals")]
    public class ProjectAppealController : ControllerBase
    {
        private readonly IProjectAppealRepository projectAppealRepository;
        private readonly IMapper mapper;

        public ProjectAppealController(IProjectAppealRepository projectAppeal, IMapper mapper)
        {
            this.projectAppealRepository = projectAppeal;
            this.mapper = mapper;
        }


        /// <summary>
        /// Get appeal details by ID
        /// </summary>
        /// <param name="id">Appeal ID</param>
        /// <returns>ClaimAppeal details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProjectAppealModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProjectAppealModel> GetProjectAppealById(Guid id)
        {
            // Use FirstOrDefault to get the appeal by ID
            var appeal = projectAppealRepository.FirstOrDefault(a => a.Id == id);

            if (appeal == null)
                return NotFound();

            // Map to ProjectAppealModel for response
            var appealModel = mapper.Map<ProjectAppealModel>(appeal);

            return Ok(appealModel);
        }

        /// <summary>
        /// Create a new project appeal.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateProjectAppeal([FromBody] ProjectAppealModel appeal)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if (appeal == null) return BadRequest("Appeal details cannot be empty.");

                var mappedClaimAppeal = mapper.Map<ProjectAppeal>(appeal);

                var projectAppealId = projectAppealRepository.Insert(mappedClaimAppeal);
                return Ok(projectAppealId);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception(ex.Message);
            }

        }

        /// <summary>
        /// Update an existing project appeal by ID.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="appeal"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public IActionResult UpdateProjectAppeal(string id, [FromBody] ProjectAppealModel appeal)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                if (appeal == null) return BadRequest("Appeal details cannot be empty.");

                var mappedProjectAppeal = mapper.Map<ProjectAppeal>(appeal);

                mappedProjectAppeal.SubbmissionDate = DateTime.Now;

                var result = projectAppealRepository.Update(mappedProjectAppeal);
                return Ok(result);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// Delete a project appeal by ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public IActionResult DeleteProjectAppeal(string id)
        {
            // TODO: Add logic to delete project appeal
            return Ok(id);
        }
    }

    /// <summary>
    /// Model representing a project appeal.
    /// </summary>
    public class ProjectAppealModel
    {
        public string? Id { get; set; }
        public string? CaseId { get; set; }

        public string? Name { get; set; }

        public string? AppealDecision { get; set; }

        public DateTime? SubbmissionDate { get; set; }

        /// <summary>
        /// User submitted reason for the appeal.
        /// </summary>
        /// <value></value>
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }

    public class CreateAppealModel { }

}
