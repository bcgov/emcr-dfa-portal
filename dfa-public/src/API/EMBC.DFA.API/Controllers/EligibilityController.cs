using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using static StackExchange.Redis.Role;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/eligibility")]
    [ApiController]
    public class EligibilityController : ControllerBase
    {
        private readonly IConfigurationHandler handler;
        private readonly IMapper mapper;

        public EligibilityController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler)
        {
            this.handler = handler;
            this.mapper = mapper;
        }

        /// <summary>
        /// Checking events are present in the system
        /// </summary>
        /// <returns>number of open events</returns>
        [HttpGet("checkPublicEventsAvailable")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetEvents()
        {
            var result = await handler.HandleEvents();
            return Ok(result);
        }

        /// <summary>
        /// Retrieve list of open events
        /// </summary>
        /// <returns>list of open events</returns>
        [HttpGet("openEvents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<DisasterEvent>>> GetOpenEvents()
        {
            var dfa_events = await handler.HandleOpenPublicEventList();

            IEnumerable<DisasterEvent> disasterEvents = new DisasterEvent[] { };
            if (dfa_events != null)
            {
                foreach (dfa_event dfa_event in dfa_events)
                {
                    DisasterEvent disasterEvent = mapper.Map<DisasterEvent>(dfa_event);
                    disasterEvents = disasterEvents.Append<DisasterEvent>(disasterEvent);
                }
                return Ok(disasterEvents);
            }
            else
            {
                return Ok(null);
            }
        }

        /// <summary>
        /// Retrieve list of effected region communities
        /// </summary>
        /// <returns>list of effected region communities</returns>
        [HttpGet("regionCommunities")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<EffectedRegionCommunity>>> GetRegionCommunties()
        {
            var dfa_effectedregioncommunities = await handler.HandleEffectedRegionCommunityList();

            IEnumerable<EffectedRegionCommunity> effectedRegionCommunties = new EffectedRegionCommunity[] { };
            if (dfa_effectedregioncommunities != null)
            {
                foreach (dfa_effectedregioncommunities dfa_effectedregioncommunity in dfa_effectedregioncommunities)
                {
                    EffectedRegionCommunity effectedRegionCommunity = mapper.Map<EffectedRegionCommunity>(dfa_effectedregioncommunity);
                    effectedRegionCommunties = effectedRegionCommunties.Append<EffectedRegionCommunity>(effectedRegionCommunity);
                }
                return Ok(effectedRegionCommunties);
            }
            else
            {
                return Ok(null);
            }
        }
    }

    public class DisasterEvent
    {
        public string? eventId { get; set; }
        public string? id { get; set; }
        public string? ninetyDayDeadline { get; set; }
        public string? startDate { get; set; }
        public string? endDate { get; set; }
        public string? eventName { get; set; }
        public string? remainingDays { get; set; }
    }

    public class EffectedRegionCommunity
    {
        public string id { get; set; }
        public string communityName { get; set; }
        public string eventId { get; set; }
        public string regionName { get; set; }
    }
}
