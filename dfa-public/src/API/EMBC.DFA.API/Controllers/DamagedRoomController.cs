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
    [Route("api/damagedrooms")]
    [ApiController]
    [Authorize]
    public class DamagedRoomController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;

        public DamagedRoomController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
        }

        /// <summary>
        /// Create / update / delete a damaged room
        /// </summary>
        /// <param name="damagedRoom">The damaged room information</param>
        /// <returns>damaged room id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertDeleteDamagedRoom(DamagedRoom damagedRoom)
        {
            if (damagedRoom == null) return BadRequest("DamagedRoom details cannot be empty.");
            var mappedDamagedRoom = mapper.Map<dfa_appdamageditems_params>(damagedRoom);

            var result = await handler.HandleDamagedItemsAsync(mappedDamagedRoom);
            return Ok(result);
        }

        /// <summary>
        /// Get a list of damaged rooms by application Id
        /// </summary>
        /// <returns> DamagedRooms </returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("byApplicationId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<DamagedRoom>>> GetDamagedRooms(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            IEnumerable<dfa_appdamageditems_retrieve> dfa_appdamagedItems = await handler.GetDamagedItemsAsync(applicationId);
            IEnumerable<DamagedRoom> damagedRooms = new DamagedRoom[] { };
            foreach (dfa_appdamageditems_retrieve dfa_appdamagedItem in dfa_appdamagedItems)
            {
                DamagedRoom damagedRoom = mapper.Map<DamagedRoom>(dfa_appdamagedItem);
                damagedRooms = damagedRooms.Append<DamagedRoom>(damagedRoom);
            }
            return Ok(damagedRooms);
        }
    }

    /// <summary>
    /// Damaged Room
    /// </summary>
    public class DamagedRoom
    {
        public Guid applicationId { get; set; }
        public Guid? id { get; set; }
        public RoomType roomType { get; set; }
        public string? otherRoomType { get; set; }
        public string description { get; set; }
        public bool deleteFlag { get; set; }
    }
}
