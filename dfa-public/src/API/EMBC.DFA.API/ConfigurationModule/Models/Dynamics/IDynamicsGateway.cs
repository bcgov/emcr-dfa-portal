using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
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
        Task<dfa_appapplication> GetApplicationDetailsAsync(string appId);
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
        Task<string> InsertDocumentLocationClaimAsync(SubmissionEntityClaim submission);
        Task<string> DeleteDocumentLocationAsync(dfa_DFAActionDeleteDocuments_parms dfa_DFAActionDeleteDocuments_parms);
        Task<IEnumerable<dfa_projectdocumentlocation>> GetProjectDocumentLocationsListAsync(Guid projectId);
        Task<IEnumerable<dfa_projectclaimdocumentlocation>> GetProjectClaimDocumentLocationsListAsync(Guid claimId);
        Task<IEnumerable<dfa_appapplication>> GetApplicationListAsync(string profileId);
        Task<int> GetEventCount();
        Task<IEnumerable<dfa_event>> GetOpenPublicEventList();
        Task<IEnumerable<dfa_effectedregioncommunities>> GetEffectedRegionCommunitiesList();
        Task<IEnumerable<dfa_areacommunitieses>> GetCommunitiesAsync();
        Task<string> UpsertProject(dfa_project_params project);
        Task<dfa_projectmain_retrieve> GetProjectMainById(Guid projectId);
        Task<dfa_project> GetProjectDetailsAsync(string projectId);
        Task<IEnumerable<dfa_project>> GetProjectListAsync(string applicationId);
        Task<IEnumerable<dfa_projectclaim>> GetClaimListAsync(string projectId);
        Task<string> UpsertClaim(dfa_claim_params claim);
        Task<dfa_claim_retrieve> GetClaimDetailsAsync(string claimId);
        Task<string> UpsertInvoice(dfa_invoice_params invoice);
        Task<IEnumerable<dfa_recoveryinvoice>> GetInvoiceListAsync(string claimId);
        Task<string> DeleteInvoice(dfa_invoice_delete_params invoice);
    }
}
