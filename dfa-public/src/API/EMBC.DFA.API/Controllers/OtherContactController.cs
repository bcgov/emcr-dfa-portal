using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/othercontacts")]
    [ApiController]
    [Authorize]
    public class OtherContactController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;

        public OtherContactController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
        }

        /// <summary>
        /// Create / update / delete an other contact
        /// </summary>
        /// <param name="otherContact">The other contact information</param>
        /// <returns>other contact id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertDeleteOtherContact(OtherContact otherContact)
        {
            if (otherContact == null) return BadRequest("OtherContact details cannot be empty.");
            var mappedOtherContact = mapper.Map<dfa_appothercontact_params>(otherContact);

            var result = await handler.HandleOtherContactAsync(mappedOtherContact);
            return Ok(result);
        }

        /// <summary>
        /// Get a list of other contacts by application id
        /// </summary>
        /// <returns> OtherContacts </returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("byApplicationId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<OtherContact>>> GetOtherContacts(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            IEnumerable<dfa_appothercontact_retrieve> dfa_OtherContacts = await handler.GetOtherContactsAsync(applicationId);
            IEnumerable<OtherContact> otherContacts = new OtherContact[] { };
            foreach (dfa_appothercontact_retrieve dfa_otherContact in dfa_OtherContacts)
            {
                OtherContact otherContact = mapper.Map<OtherContact>(dfa_otherContact);
                otherContacts = otherContacts.Append<OtherContact>(otherContact);
            }
            return Ok(otherContacts);
        }
    }

    /// <summary>
    /// Full Time Other Contact
    /// </summary>
    public class OtherContact
    {
        public Guid? id { get; set; }
        public Guid? applicationId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phoneNumber { get; set; }
        public string email { get; set; }
        public bool deleteFlag { get; set; }
    }
}
