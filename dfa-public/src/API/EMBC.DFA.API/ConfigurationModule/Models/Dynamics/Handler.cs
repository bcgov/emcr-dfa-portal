using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Cronos;
using EMBC.DFA.API.Controllers;
using EMBC.DFA.API.Mappers;
using EMBC.Utilities.Caching;
using Microsoft.Extensions.Logging;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;
using static Pipelines.Sockets.Unofficial.SocketConnection;
using Profile = EMBC.DFA.API.Controllers.Profile;

namespace EMBC.DFA.API.ConfigurationModule.Models.Dynamics
{
    public interface IConfigurationHandler
    {
        Task<IEnumerable<Contact>> Handle();
        Task<Profile> HandleGetUser(string userID);
        Task<IEnumerable<Country>> HandleCountry();
        Task<string> HandleContact(dfa_appcontact objContact);
        Task<string> HandleApplication(dfa_appapplicationstart_params objApplication, temp_dfa_appapplicationstart_params temp_params);
        Task<string> HandleSignature(dfa_signature objSignature);
        Task<string> HandleApplicationUpdate(dfa_appapplicationmain_params objApplication, temp_dfa_appapplicationmain_params temp_params);
        Task<string> HandleProjectCreateUpdate(dfa_project_params objProject);
        Task<dfa_appapplicationstart_retrieve> GetApplicationStartAsync(Guid applicationId);
        Task<dfa_appapplicationmain_retrieve> GetApplicationMainAsync(Guid applicationId);
        Task<string> HandleDamagedItemsAsync(dfa_appdamageditems_params objDamagedItems);
        Task<IEnumerable<dfa_appdamageditems_retrieve>> GetDamagedItemsAsync(Guid applicationId);
        Task<string> HandleSecondaryApplicantAsync(dfa_appsecondaryapplicant_params objSecondaryApplicants);
        Task<IEnumerable<dfa_appsecondaryapplicant_retrieve>> GetSecondaryApplicantsAsync(Guid applicationId);
        Task<string> HandleOtherContactAsync(dfa_appothercontact_params objOtherContact);
        Task<IEnumerable<dfa_appothercontact_retrieve>> GetOtherContactsAsync(Guid applicationId);
        Task<string> HandleFullTimeOccupantAsync(dfa_appoccupant_params objAppOccupant);
        Task<IEnumerable<dfa_appoccupant_retrieve>> GetFullTimeOccupantsAsync(Guid applicationId);
        Task<string> HandleCleanUpLogItemAsync(dfa_appcleanuplogs_params objCleanUpLogItem);
        Task<IEnumerable<dfa_appcleanuplogs_retrieve>> GetCleanUpLogItemsAsync(Guid applicationId);
        Task<string> HandleFileUploadAsync(SubmissionEntity submission);
        Task<string> HandleFileUploadClaimAsync(SubmissionEntityClaim objDocumentLocation);
        Task<string> DeleteFileUploadAsync(dfa_DFAActionDeleteDocuments_parms dfa_DFAActionDeleteDocuments_parms);
        Task<IEnumerable<dfa_projectdocumentlocation>> GetProjectFileUploadsAsync(Guid projectId);
        Task<IEnumerable<dfa_projectclaimdocumentlocation>> GetProjectClaimFileUploadsAsync(Guid claimId);
        Task<List<CurrentApplication>> HandleApplicationList(string profileId);
        Task<int> HandleEvents();
        Task<IEnumerable<dfa_event>> HandleOpenPublicEventList();
        Task<IEnumerable<dfa_effectedregioncommunities>> HandleEffectedRegionCommunityList();
        Task<List<AreaCommunity>> HandleGetAreaCommunities();
        Task<dfa_projectmain_retrieve> GetProjectMainAsync(Guid projectId);
        Task<List<CurrentProject>> HandleProjectList(string applicationId);
        Task<CurrentApplication> HandleApplicationDetails(string applicationId);
        Task<CurrentProject> HandleProjectDetails(string projectId);
        Task<string> HandleClaimCreateUpdate(dfa_claim_params objClaim);
        Task<List<CurrentClaim>> HandleClaimList(string projectId);
        Task<RecoveryClaim> HandleClaimDetails(string claimId);
        Task<string> HandleInvoiceCreateUpdate(dfa_invoice_params objInvoice);
        Task<List<CurrentInvoice>> HandleInvoiceList(string claimId);
        Task<string> HandleInvoiceDelete(dfa_invoice_delete_params objInvoice);
    }

    public class Handler : IConfigurationHandler
    {
        //private readonly CRMWebAPI api;
        //private readonly IListsRepository listsRepository;
        private readonly ICache cache;
        private readonly IDynamicsGateway listsGateway;
        private AutoMapper.MapperConfiguration mapperConfig;
        private AutoMapper.IMapper mapper => mapperConfig.CreateMapper();

        public Handler(ICache cache,
            IDynamicsGateway listsGateway)
        {
            this.cache = cache;
            this.listsGateway = listsGateway;
            mapperConfig = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Mappings));
            });
        }

        public async Task<IEnumerable<Contact>> Handle()
        {
            try
            {
                var contacts = await listsGateway.GetContactsAsync();
                //var lst = mapper.Map<IEnumerable<Contact>>(contacts);
                return contacts.Select(c => new Contact
                {
                    FirstName = c.dfa_firstname,
                    LastName = c.dfa_lastname,
                    //Initial = c.dfa_initial,
                    //Email = c.dfa_emailaddress,
                    //Mobile = c.dfa_cellphonenumber,
                    //ResidencePhone = c.dfa_residencetelephonenumber,
                    //AlternatePhone = c.dfa_alternatephonenumber
                }).OrderBy(c => c.FirstName);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Country>> HandleCountry()
        {
            //await cache.Refresh("countries", listsGateway.GetCountriesAsync, TimeSpan.FromDays(1));
            return await listsGateway.GetCountriesAsync();
        }

        public async Task<Profile> HandleGetUser(string userID)
        {
            var objUser = await listsGateway.GetUserProfileAsync(userID);
            var mappedProfile = mapper.Map<Profile>(objUser);
            return mappedProfile;
        }

        public async Task<string> HandleContact(dfa_appcontact objContact)
        {
            var contactId = await listsGateway.AddContact(objContact);
            return contactId;
        }

        public async Task<string> HandleApplication(dfa_appapplicationstart_params objApplication, temp_dfa_appapplicationstart_params temp_params)
        {
            var applicationId = await listsGateway.AddApplication(objApplication, temp_params);
            return applicationId;
        }

        public async Task<string> HandleSignature(dfa_signature objSignature)
        {
            var result = await listsGateway.AddApplicationSignature(objSignature);
            return result;
        }

        public async Task<string> HandleApplicationUpdate(dfa_appapplicationmain_params objApplication, temp_dfa_appapplicationmain_params temp_params)
        {
            var result = await listsGateway.UpdateApplication(objApplication, temp_params);
            return result;
        }

        public async Task<dfa_appapplicationstart_retrieve> GetApplicationStartAsync(Guid applicationId)
        {
            var dfa_appapplication = await listsGateway.GetApplicationStartById(applicationId);
            return dfa_appapplication;
        }
        public async Task<dfa_appapplicationmain_retrieve> GetApplicationMainAsync(Guid applicationId)
        {
            var dfa_appapplication = await listsGateway.GetApplicationMainById(applicationId);
            return dfa_appapplication;
        }

        public async Task<dfa_projectmain_retrieve> GetProjectMainAsync(Guid projectId)
        {
            var dfa_project = await listsGateway.GetProjectMainById(projectId);
            return dfa_project;
        }

        public async Task<List<CurrentProject>> HandleProjectList(string applicationId)
        {
            var lstApps = await listsGateway.GetProjectListAsync(applicationId);
            var mappedProjects = mapper.Map<List<CurrentProject>>(lstApps);
            return mappedProjects;
        }

        public async Task<List<CurrentApplication>> HandleApplicationList(string profileId)
        {
            var lstApps = await listsGateway.GetApplicationListAsync(profileId);
            var mappedApps = mapper.Map<List<CurrentApplication>>(lstApps);
            return mappedApps;
        }
        public async Task<CurrentApplication> HandleApplicationDetails(string applicationId)
        {
            var objApp = await listsGateway.GetApplicationDetailsAsync(applicationId);
            var mappedApp = mapper.Map<CurrentApplication>(objApp);
            return mappedApp;
        }

        public async Task<CurrentProject> HandleProjectDetails(string projectId)
        {
            var objProject = await listsGateway.GetProjectDetailsAsync(projectId);
            var mappedProject = mapper.Map<CurrentProject>(objProject);
            return mappedProject;
        }

        public async Task<RecoveryClaim> HandleClaimDetails(string claimId)
        {
            var objClaim = await listsGateway.GetClaimDetailsAsync(claimId);
            var mappedClaim = mapper.Map<RecoveryClaim>(objClaim);
            return mappedClaim;
        }

        public async Task<string> HandleDamagedItemsAsync(dfa_appdamageditems_params objDamagedItems)
        {
            var result = await listsGateway.UpsertDeleteDamagedItemAsync(objDamagedItems);
            return result;
        }

        public async Task<IEnumerable<dfa_appdamageditems_retrieve>> GetDamagedItemsAsync(Guid applicationId)
        {
            return await listsGateway.GetDamagedItemsListAsync(applicationId);
        }

        public async Task<string> HandleSecondaryApplicantAsync(dfa_appsecondaryapplicant_params objSecondaryApplicant)
        {
            var result = await listsGateway.UpsertDeleteSecondaryApplicantAsync(objSecondaryApplicant);
            return result;
        }

        public async Task<IEnumerable<dfa_appsecondaryapplicant_retrieve>> GetSecondaryApplicantsAsync(Guid applicationId)
        {
            return await listsGateway.GetSecondaryApplicantsListAsync(applicationId);
        }

        public async Task<string> HandleOtherContactAsync(dfa_appothercontact_params objOtherContact)
        {
            var result = await listsGateway.UpsertDeleteOtherContactAsync(objOtherContact);
            return result;
        }

        public async Task<IEnumerable<dfa_appothercontact_retrieve>> GetOtherContactsAsync(Guid applicationId)
        {
            return await listsGateway.GetOtherContactsListAsync(applicationId);
        }

        public async Task<string> HandleFullTimeOccupantAsync(dfa_appoccupant_params objAppOccupant)
        {
            var result = await listsGateway.UpsertDeleteFullTimeOccupantAsync(objAppOccupant);
            return result;
        }

        public async Task<IEnumerable<dfa_appoccupant_retrieve>> GetFullTimeOccupantsAsync(Guid applicationId)
        {
            return await listsGateway.GetFullTimeOccupantsListAsync(applicationId);
        }

        public async Task<string> HandleCleanUpLogItemAsync(dfa_appcleanuplogs_params objCleanUpLogItem)
        {
            var result = await listsGateway.UpsertDeleteCleanUpLogItemAsync(objCleanUpLogItem);
            return result;
        }

        public async Task<IEnumerable<dfa_appcleanuplogs_retrieve>> GetCleanUpLogItemsAsync(Guid applicationId)
        {
            return await listsGateway.GetCleanUpLogItemsListAsync(applicationId);
        }

        public async Task<string> HandleFileUploadAsync(SubmissionEntity objDocumentLocation)
        {
            var result = await listsGateway.InsertDocumentLocationAsync(objDocumentLocation);
            return result;
        }

        public async Task<string> HandleFileUploadClaimAsync(SubmissionEntityClaim objDocumentLocation)
        {
            var result = await listsGateway.InsertDocumentLocationClaimAsync(objDocumentLocation);
            return result;
        }

        public async Task<string> DeleteFileUploadAsync(dfa_DFAActionDeleteDocuments_parms dfa_DFAActionDeleteDocuments_parms)
        {
            var result = await listsGateway.DeleteDocumentLocationAsync(dfa_DFAActionDeleteDocuments_parms);
            return result;
        }

        public async Task<IEnumerable<dfa_projectdocumentlocation>> GetProjectFileUploadsAsync(Guid projectId)
        {
            return await listsGateway.GetProjectDocumentLocationsListAsync(projectId);
        }

        public async Task<IEnumerable<dfa_projectclaimdocumentlocation>> GetProjectClaimFileUploadsAsync(Guid claimId)
        {
            return await listsGateway.GetProjectClaimDocumentLocationsListAsync(claimId);
        }

        public async Task<int> HandleEvents()
        {
            return await listsGateway.GetEventCount();
        }
        public async Task<IEnumerable<dfa_event>> HandleOpenPublicEventList()
        {
            return await listsGateway.GetOpenPublicEventList();
        }

        public async Task<IEnumerable<dfa_effectedregioncommunities>> HandleEffectedRegionCommunityList()
        {
            return await listsGateway.GetEffectedRegionCommunitiesList();
        }

        public async Task<List<AreaCommunity>> HandleGetAreaCommunities()
        {
            var lstCommunities = await listsGateway.GetCommunitiesAsync();
            var mappedList = mapper.Map<List<AreaCommunity>>(lstCommunities);
            return mappedList;
        }

        public async Task<string> HandleProjectCreateUpdate(dfa_project_params objProject)
        {
            var result = await listsGateway.UpsertProject(objProject);
            return result;
        }

        public async Task<List<CurrentClaim>> HandleClaimList(string projectId)
        {
            var lstApps = await listsGateway.GetClaimListAsync(projectId);
            var mappedClaims = mapper.Map<List<CurrentClaim>>(lstApps);
            return mappedClaims;
        }

        public async Task<string> HandleClaimCreateUpdate(dfa_claim_params objClaim)
        {
            var result = await listsGateway.UpsertClaim(objClaim);
            return result;
        }

        public async Task<string> HandleInvoiceCreateUpdate(dfa_invoice_params objInvoice)
        {
            var result = await listsGateway.UpsertInvoice(objInvoice);
            return result;
        }

        public async Task<string> HandleInvoiceDelete(dfa_invoice_delete_params objInvoice)
        {
            var result = await listsGateway.DeleteInvoice(objInvoice);
            return result;
        }

        public async Task<List<CurrentInvoice>> HandleInvoiceList(string claimId)
        {
            var lstApps = await listsGateway.GetInvoiceListAsync(claimId);
            var mappedInvoices = mapper.Map<List<CurrentInvoice>>(lstApps);
            return mappedInvoices;
        }
    }
}
