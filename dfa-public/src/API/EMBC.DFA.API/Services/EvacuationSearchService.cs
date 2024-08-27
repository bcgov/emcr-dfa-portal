using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.DFA.API.Services
{
    public interface IEvacuationSearchService
    {
        Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus);

        Task<RegistrantProfile> GetRegistrantByUserId(string userId);
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        public EvacuationSearchService()
        {
        }

        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public async Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus)
        {
            IEnumerable<EvacuationFile> files = null;
            return await Task.FromResult(files);
        }

        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public async Task<RegistrantProfile> GetRegistrantByUserId(string userId)
        {
            RegistrantProfile registrant = null;
            return await Task.FromResult(registrant);
        }
    }
}
