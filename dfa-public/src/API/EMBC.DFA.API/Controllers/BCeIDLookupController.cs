using System;
using System.Diagnostics;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using EMBC.Gov.BCeID;
using Grpc.Core.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using bceid = EMBC.Gov.BCeID;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/bceid")]
    [ApiController]
    [Authorize]
    public class BCeIDLookupController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ILogger<BCeIDLookupController> logger;
        private readonly IConfigurationHandler handler;
        private readonly IUserService userService;
        private readonly IBCeIDBusinessQuery bceidQuery;

        public BCeIDLookupController(
            IMapper mapper,
            ILogger<BCeIDLookupController> logger,
            IConfigurationHandler handler,
            IUserService userService,
            IBCeIDBusinessQuery query)
        {
            this.mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
            this.bceidQuery = query ?? throw new ArgumentNullException(nameof(query));
        }

        [HttpGet("self")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bceid.BCeIDBusiness>> GetBCeIDSelfInfo()
        {
            try
            {
                var userData = userService.GetJWTokenData();

                if (userData == null) return NotFound("JWT Token bad - Authentication missing");

                var userGuid = userData.bceid_user_guid;
                var bceidData = await this.bceidQuery.ProcessBusinessQuery(userGuid);

                if (bceidData == null) return NotFound("BCeID Self not found");

                return Ok(bceidData);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message, ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("other")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bceid.BCeIDBusiness>> GetBCeIDOtherInfo(string userId)
        {
            try
            {
                var userData = userService.GetJWTokenData();

                if (userData == null) return NotFound("JWT Token bad - Authentication missing");

                var userGuid = userData.bceid_user_guid;
                var bceidData = await this.bceidQuery.ProcessBusinessQuery(userGuid, userId);

                if (bceidData == null) return NotFound("BCeID Self not found");

                return Ok(bceidData);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message, ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
