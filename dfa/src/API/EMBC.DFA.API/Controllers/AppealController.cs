using Microsoft.AspNetCore.Mvc;

namespace EMBC.DFA.API.Controllers
{
    [ApiController]
    [Route("api/appeal")]
    public class AppealController : ControllerBase
    {
        // POST: api/appeal/create
        [HttpPost("create")]
        public IActionResult CreateAppeal([FromBody] AppealModel appeal)
        {
            // Add logic to create appeal
            return Ok(appeal);
        }

        // PUT: api/appeal/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateAppeal(string id, [FromBody] AppealModel appeal)
        {
            // Add logic to update appeal
            return Ok(appeal);
        }
    }

    public class AppealModel
    {
        public string Id { get; set; }
        public string CaseId { get; set; }
        public AppealReasonModel AppealReason { get; set; }
        public SignAndSubmitModel SignAndSubmit { get; set; }
        public string Status { get; set; }
    }

    public class AppealReasonModel
    {
        public string Reason { get; set; }
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
