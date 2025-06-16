using Microsoft.AspNetCore.Mvc;

namespace EMBC.DFA.API.Controllers
{
    /// <summary>
    /// Controller for managing public project appeals.
    /// </summary>
    [ApiController]
    [Route("api/projectappeals")]
    public class ProjectAppealController : ControllerBase
    {
        /// <summary>
        /// Create a new project appeal.
        /// </summary>
        /// <param name="appeal"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult CreateProjectAppeal([FromBody] ProjectAppealModel appeal)
        {
            // TODO: Add logic to create project appeal
            return Ok(appeal);
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
            //TODO: Add logic to update project appeal
            return Ok(appeal);
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
        public string Id { get; set; }
        public string CaseId { get; set; }

        /// <summary>
        /// User submitted reason for the appeal.
        /// </summary>
        /// <value></value>
        public string Reason { get; set; }
        public string Status { get; set; }
    }
}
