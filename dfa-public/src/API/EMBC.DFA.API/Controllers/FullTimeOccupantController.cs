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
    [Route("api/fulltimeoccupants")]
    [ApiController]
    [Authorize]
    public class FullTimeOccupantController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;

        public FullTimeOccupantController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
        }

        /// <summary>
        /// Create / update / delete a full time occupant
        /// </summary>
        /// <param name="fullTimeOccupant">The full time occupant information</param>
        /// <returns>full time occupant id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertDeleteFullTimeOccupant(FullTimeOccupant fullTimeOccupant)
        {
            if (fullTimeOccupant == null) return BadRequest("FullTimeOccupant details cannot be empty.");
            var mappedFullTimeOccupant = mapper.Map<dfa_appoccupant_params>(fullTimeOccupant);

            var result = await handler.HandleFullTimeOccupantAsync(mappedFullTimeOccupant);
            return Ok(result);
        }

        /// <summary>
        /// Get a list of full time occupants by application Id
        /// </summary>
        /// <returns> FullTimeOccupants </returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("byApplicationId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<FullTimeOccupant>>> GetFullTimeOccupants(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            IEnumerable<dfa_appoccupant_retrieve> dfa_appOcupants = await handler.GetFullTimeOccupantsAsync(applicationId);
            IEnumerable<FullTimeOccupant> fullTimeOccupants = new FullTimeOccupant[] { };
            foreach (dfa_appoccupant_retrieve dfa_appOcupant in dfa_appOcupants)
            {
                FullTimeOccupant fullTimeOccupant = mapper.Map<FullTimeOccupant>(dfa_appOcupant);
                fullTimeOccupants = fullTimeOccupants.Append<FullTimeOccupant>(fullTimeOccupant);
            }
            return Ok(fullTimeOccupants);
        }
    }

    /// <summary>
    /// Full Time Occupants
    /// </summary>
    public class FullTimeOccupant
    {
        public Guid? id { get; set; }
        public Guid applicationId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string relationship { get; set; }
        public bool deleteFlag { get; set; }
    }
}
