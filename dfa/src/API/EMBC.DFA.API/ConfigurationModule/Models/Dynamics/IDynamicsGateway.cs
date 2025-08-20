using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.DFA.API.Controllers;
using Google.Protobuf.WellKnownTypes;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.DFA.API.ConfigurationModule.Models.Dynamics
{
    public interface IDynamicsGateway
    {
        Task<IEnumerable<Country>> GetCountriesAsync();
        Task<IEnumerable<dfa_appcontact>> GetContactsAsync();
        Task<dfa_appcontact> GetUserProfileAsync(string userId);
        Task<string> AddContact(dfa_appcontact contact);
        Task<string> AddApplication(dfa_appapplicationstart_params application, temp_dfa_appapplicationstart_params temp_params);
        Task<string> AddApplicationSignature(dfa_signature dfa_signature);
        Task<string> UpdateApplication(dfa_appapplicationmain_params application, temp_dfa_appapplicationmain_params temp_params);
        Task<dfa_appapplicationstart_retrieve> GetApplicationStartById(Guid applicationId);
        Task<dfa_appapplicationmain_retrieve> GetApplicationMainById(Guid applicationId);
        Task<IEnumerable<dfa_appdamageditems_retrieve>> GetDamagedItemsListAsync(Guid applicationId);
        Task<string> UpsertDeleteDamagedItemAsync(dfa_appdamageditems_params objDamagedItems);
        Task<string> UpsertDeleteSecondaryApplicantAsync(dfa_appsecondaryapplicant_params objSecondaryApplicant);
        Task<IEnumerable<dfa_appsecondaryapplicant_retrieve>> GetSecondaryApplicantsListAsync(Guid applicationId);
        Task<string> UpsertDeleteOtherContactAsync(dfa_appothercontact_params objOtherContact);
        Task<IEnumerable<dfa_appothercontact_retrieve>> GetOtherContactsListAsync(Guid applicationId);
        Task<string> UpsertDeleteFullTimeOccupantAsync(dfa_appoccupant_params objAppOccupant);
        Task<IEnumerable<dfa_appoccupant_retrieve>> GetFullTimeOccupantsListAsync(Guid applicationId);
        Task<string> UpsertDeleteCleanUpLogItemAsync(dfa_appcleanuplogs_params objCleanUpLog);
        Task<IEnumerable<dfa_appcleanuplogs_retrieve>> GetCleanUpLogItemsListAsync(Guid applicationId);
        Task<string> InsertDocumentLocationAsync(SubmissionEntity submission);
        Task<string> DeleteDocumentLocationAsync(dfa_DFAActionDeleteDocuments_parms dfa_DFAActionDeleteDocuments_parms);
        Task<string> InsertS3DocumentAsync(S3SubmissionEntity submission);
        Task<string> CreateDocumentMetadataAsync(MetadataSubmissionEntity parameters);
        Task<string> DeleteDocumentMetadataAsync(MetadataDeleteParams parameters);
        Task<IEnumerable<bcgov_documenturl>> GetS3ApplicationDocumentListAsync(Guid applicationId);
        Task<IEnumerable<bcgov_documenturl>> GetS3ProjectAppealDocumentListAsync(Guid appealId);
        Task<IEnumerable<dfa_appdocumentlocation>> GetDocumentLocationsListAsync(Guid applicationId);
        Task<IEnumerable<dfa_appapplication>> GetApplicationListAsync(string profileId);
        Task<int> GetEventCount();
        Task<IEnumerable<dfa_event>> GetOpenEventList();
        Task<IEnumerable<dfa_effectedregioncommunities>> GetEffectedRegionCommunitiesList();
        Task<IEnumerable<dfa_areacommunitieses>> GetCommunitiesAsync();
        Task<dfa_incident_retrieve> GetCaseDetailsListAsync(Guid caseId);
    }
}
