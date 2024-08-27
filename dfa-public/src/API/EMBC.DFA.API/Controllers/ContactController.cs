using System;
using System.Diagnostics;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.AuthModels;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using bceid = EMBC.Gov.BCeID;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/contacts")]
    [ApiController]
    [Authorize]

    public class ContactController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;
        private readonly IProfileInviteService profileInviteService;
        private readonly IConfigurationHandler handler;
        private readonly IUserService userService;

        public ContactController(
            IMapper mapper,
            IEvacuationSearchService evacuationSearchService,
            IProfileInviteService profileInviteService,
            IConfigurationHandler handler,
            IUserService userService)
        {
            this.mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            this.evacuationSearchService = evacuationSearchService ?? throw new ArgumentNullException(nameof(evacuationSearchService));
            this.profileInviteService = profileInviteService ?? throw new ArgumentNullException(nameof(profileInviteService));
            this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        [HttpGet("dashboard")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bceid.BCeIDBusiness> GetDashboardContactInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userData = userService.GetJWTokenData();

                if (userData == null) return NotFound("Authentication missing");

                var bceidData = mapper.Map<bceid.BCeIDBusiness>(userData);
                return Ok(bceidData);
            }
            else
            {
                Debug.WriteLine("No Authentication!");
                return Ok();
            }
        }

        /// <summary>
        /// If user isn't authenticated, return NULL
        /// </summary>
        /// <returns>NULL if user isn't authenticated</returns>
        [HttpGet("login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<BceidUserData> GetLoginInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userData = userService.GetJWTokenData();

                return Ok(userData);
            }
            else
            {
                Debug.WriteLine("No Authentication!");
                return Ok(null);
            }
        }
    }
}
