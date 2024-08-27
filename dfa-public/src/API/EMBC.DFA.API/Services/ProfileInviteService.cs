using System;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Telemetry;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.DFA.API.Services
{
    public interface IProfileInviteService
    {
        Task<bool> ProcessInvite(string inviteId, string loggedInUserId);
    }

    public class ProfileInviteService : IProfileInviteService
    {
        private readonly ITelemetryReporter logger;

        public ProfileInviteService(ITelemetryProvider telemetryProvider)
        {
            this.logger = telemetryProvider.Get<ProfileInviteService>();
        }

        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public async Task<bool> ProcessInvite(string inviteId, string loggedInUserId)
        {
            return await Task.FromResult(false);
        }
    }
}
