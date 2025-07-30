using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Contract;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;


namespace EMBC.DFA.API.Controllers
{
    [Route("api/applications")]
    [ApiController]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;

        public ApplicationController(
            IHostEnvironment env,
            IMessagingClient messagingClient,
            IMapper mapper,
            IConfigurationHandler handler)
        {
            this.env = env;
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.handler = handler;
        }

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        /// <summary>
        /// Create an application
        /// </summary>
        /// <param name="application">The application information</param>
        /// <returns>application id</returns>
        [HttpPost("create")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> AddApplication(DFAApplicationStart application)
        {
            // fill in current user
            var dfa_appcontact = await handler.HandleGetUser(currentUserId);
            application.ProfileVerification.profileId = dfa_appcontact.Id;

            if (application == null) return BadRequest("Application details cannot be empty.");
            var mappedApplication = mapper.Map<dfa_appapplicationstart_params>(application);
            var tempParms = mapper.Map<temp_dfa_appapplicationstart_params>(application); // TODO: remove

            var applicationId = await handler.HandleApplication(mappedApplication, tempParms);

            // Verify Profile
            application.ProfileVerification.profile.BCServiceCardId = currentUserId;
            var mappedProfile = mapper.Map<dfa_appcontact>(application.ProfileVerification.profile);
            var msg = await handler.HandleContact(mappedProfile);

            // If no insurance, add signatures
            if (application.AppTypeInsurance.insuranceOption == InsuranceOption.No)
            {
                IEnumerable<dfa_signature> insuranceSignatures = Enumerable.Empty<dfa_signature>();
                if (application.AppTypeInsurance.applicantSignature != null && application.AppTypeInsurance.applicantSignature.signature != null)
                {
                    var primarySignature = new dfa_signature();
                    primarySignature.signature = application.AppTypeInsurance.applicantSignature.signature.Substring(application.AppTypeInsurance.applicantSignature.signature.IndexOf(',') + 1);
                    primarySignature.filename = "primaryApplicantSignatureNoIns";
                    primarySignature.dfa_appapplicationid = applicationId;
                    await handler.HandleSignature(primarySignature);
                }

                if (application.AppTypeInsurance.secondaryApplicantSignature != null && application.AppTypeInsurance.secondaryApplicantSignature.signature != null)
                {
                    var secondarySignature = new dfa_signature();
                    secondarySignature.signature = application.AppTypeInsurance.secondaryApplicantSignature.signature.Substring(application.AppTypeInsurance.secondaryApplicantSignature.signature.IndexOf(',') + 1);
                    secondarySignature.filename = "secondaryApplicantSignatureNoIns";
                    secondarySignature.dfa_appapplicationid = applicationId;
                    await handler.HandleSignature(secondarySignature);
                }
            }
            return Ok(applicationId);
        }

        /// <summary>
        /// Update an application
        /// </summary>
        /// <param name="application">The application information</param>
        /// <returns>application id</returns>
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpdateApplication(DFAApplicationMain application)
        {
            if (application == null) return BadRequest("Application details cannot be empty.");
            var mappedApplication = mapper.Map<dfa_appapplicationmain_params>(application);
            var temp_params = mapper.Map<temp_dfa_appapplicationmain_params>(application);

            var result = await handler.HandleApplicationUpdate(mappedApplication, temp_params);

            // Add signatures
            if (application.signAndSubmit?.applicantSignature?.signature != null &&
                application.deleteFlag == false)
            {
                var primarySignature = new dfa_signature();
                primarySignature.signature = application.signAndSubmit.applicantSignature.signature.Substring(application.signAndSubmit.applicantSignature.signature.IndexOf(',') + 1);
                primarySignature.filename = "primaryApplicantSignature";
                primarySignature.dfa_appapplicationid = application.Id.ToString();
                await handler.HandleSignature(primarySignature);
            }

            if (application.signAndSubmit?.secondaryApplicantSignature?.signature != null &&
                application.deleteFlag == false)
            {
                var secondarySignature = new dfa_signature();
                secondarySignature.signature = application.signAndSubmit.secondaryApplicantSignature.signature.Substring(application.signAndSubmit.secondaryApplicantSignature.signature.IndexOf(',') + 1);
                secondarySignature.filename = "secondaryApplicantSignature";
                secondarySignature.dfa_appapplicationid = application.Id.ToString();
                await handler.HandleSignature(secondarySignature);
            }

            return Ok(result);
        }

        /// <summary>
        /// Get an application by Id
        /// </summary>
        /// <returns> DFAApplicationStart</returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("appstart/byId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DFAApplicationStart>> GetApplicationStart(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            var dfa_appapplication = await handler.GetApplicationStartAsync(applicationId);
            DFAApplicationStart dfaApplicationStart = new DFAApplicationStart();
            dfaApplicationStart.Id = applicationId;
            dfaApplicationStart.eventName = dfa_appapplication.dfa_eventname;
            dfaApplicationStart.ProfileVerification = mapper.Map<ProfileVerification>(dfa_appapplication);
            dfaApplicationStart.Consent = mapper.Map<Consent>(dfa_appapplication);
            dfaApplicationStart.AppTypeInsurance = mapper.Map<AppTypeInsurance>(dfa_appapplication);
            dfaApplicationStart.OtherPreScreeningQuestions = mapper.Map<OtherPreScreeningQuestions>(dfa_appapplication);

            // Fill in profile
            var userId = currentUserId;
            var profile = await handler.HandleGetUser(userId);
            dfaApplicationStart.ProfileVerification.profile = profile;
            return Ok(dfaApplicationStart);
        }

        /// <summary>
        /// Get an application main by Id
        /// </summary>
        /// <returns> DFAApplicationMain</returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("appmain/byId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DFAApplicationStart>> GetApplicationMain(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            var userId = currentUserId;
            var appContactProfile = await handler.HandleGetUser(userId);

            var dfa_appapplication = await handler.GetApplicationMainAsync(applicationId);
            DFAApplicationMain dfaApplicationMain = new DFAApplicationMain();
            dfaApplicationMain.Id = applicationId;
            dfaApplicationMain.eventName = dfa_appapplication.dfa_eventname;
            dfaApplicationMain.ApplicationType = dfa_appapplication.dfa_applicanttype;
            dfaApplicationMain.damagedPropertyAddress = mapper.Map<DamagedPropertyAddress>(dfa_appapplication);
            dfaApplicationMain.propertyDamage = mapper.Map<PropertyDamage>(dfa_appapplication);
            dfaApplicationMain.signAndSubmit = mapper.Map<SignAndSubmit>(dfa_appapplication);
            dfaApplicationMain.cleanUpLog = mapper.Map<CleanUpLog>(dfa_appapplication);
            dfaApplicationMain.supportingDocuments = mapper.Map<SupportingDocuments>(dfa_appapplication);
            dfaApplicationMain.onlyOccupantInHome = dfa_appapplication.dfa_iamtheonlypersoninthehome == Convert.ToInt32(YesNoOptionSet.Yes) ? true : false;
            dfaApplicationMain.onlyOtherContact = dfa_appapplication.dfa_idonthaveanothercontact == Convert.ToInt32(YesNoOptionSet.Yes) ? true : false;

            if ((appContactProfile.lastUpdatedDateBCSC == null || DateTime.Parse(dfa_appapplication.createdon) < DateTime.Parse(appContactProfile.lastUpdatedDateBCSC))
                && dfa_appapplication.dfa_primaryapplicantsigneddate == null)
            {
                dfaApplicationMain.notifyUser = true;
            }

            dfaApplicationMain.createdon = dfa_appapplication.createdon;
            

            return Ok(dfaApplicationMain);
        }

        /// <summary>
        /// get dfa applications
        /// </summary>
        /// <returns>list of dfa applications</returns>
        [HttpGet("dfaapplication")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentApplication>>> GetDFAApplications()
        {
            var userId = currentUserId;
            var profile = await handler.HandleGetUser(userId);
            if (profile == null) return NotFound(userId);
            var profileId = profile.Id;
            var lstApplications = await handler.HandleApplicationList(profileId);
            return Ok(lstApplications);
        }


        /// <summary>
        /// Get case details by case ID
        /// </summary>
        /// <param name="caseId">The unique identifier of the case.</param>
        /// <returns>List of current case details.</returns>
        [HttpGet("cases/:caseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CurrentCase>> GetCaseDetails(Guid caseId)
        {
            var caseDetails = await handler.HandleCaseDetails(caseId);
            var  mappedcasedDetails = mapper.Map<CurrentCase>(caseDetails);
            return Ok(mappedcasedDetails);
        }
    }

    /// <summary>
    /// Application
    /// </summary>
    public class DFAApplicationStart
    {
        public Guid? Id { get; set; }

        public Consent Consent { get; set; }

        public ProfileVerification ProfileVerification { get; set; }

        public AppTypeInsurance AppTypeInsurance { get; set; }

        public OtherPreScreeningQuestions OtherPreScreeningQuestions { get; set; }
        public string? eventName { get; set; }
        public bool notifyUser { get; set; }

    }

    public class DFAApplicationMain
    {
        public Guid Id { get; set; }

        public DamagedPropertyAddress? damagedPropertyAddress { get; set; }

        public PropertyDamage? propertyDamage { get; set; }

        public CleanUpLog? cleanUpLog { get; set; }

        public SupportingDocuments? supportingDocuments { get; set; }

        public SignAndSubmit? signAndSubmit { get; set; }
        public bool deleteFlag { get; set; }
        public bool notifyUser { get; set; }
        public bool onlyOccupantInHome { get; set; }
        public bool onlyOtherContact { get; set; }
        public string? eventName { get; set; }
        public string? ApplicationType { get; set; }
        public string? createdon { get; set; }
    }

    public class CurrentApplication
    {
        public string ApplicationId { get; set; }
        public string EventId { get; set; }
        public string ApplicationType { get; set; }
        public string ApplicationSubType { get; set; }
        public string LegalName { get; set; }
        public string DamagedAddress { get; set; }
        public string CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string DateOfDamage { get; set; }
        public string PrimaryApplicantSignedDate { get; set; }
        public string DateFileClosed { get; set; }
        public string DateAppealClosed { get; set; }
        public string Status { get; set; }
        public List<StatusBar> StatusBar { get; set; }
        public string StatusLastUpdated { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool hasAppealStages { get; set; }
        public CaseEligibilityAppeal CaseEligibilityAppeal { get; set; }
        public CasePaidAmountAppeal CaseAmountAppeal { get; set; }
        public string CaseEligibility { get; set; }
    }

    public class StatusBar
    {
        public string Label { get; set; }
        public bool IsCompleted { get; set; }
        public bool CurrentStep { get; set; }
        public bool IsFinalStep { get; set; }
        public bool IsErrorInStatus { get; set; }
    }

    public class CurrentCase
    {
        public Guid CaseId { get; set; }
        public string CaseEligibility { get; set; }
        public string CaseNumber { get; set; }
    }
}
