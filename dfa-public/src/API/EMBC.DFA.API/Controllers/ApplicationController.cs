using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using Google.Protobuf.WellKnownTypes;
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
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;

        public ApplicationController(
            IHostEnvironment env,
            IMapper mapper,
            IConfigurationHandler handler,
            IUserService userService)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        private string currentUserId => userService.GetBCeIDBusinessId();

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
            var userId = userService.GetBCeIDBusinessId();
            if (string.IsNullOrEmpty(userId)) return NotFound();

            var dfa_appcontact = await handler.HandleGetUser(userId);
            application.ProfileVerification.profileId = dfa_appcontact.Id;

            if (application == null) return BadRequest("Application details cannot be empty.");
            var mappedApplication = mapper.Map<dfa_appapplicationstart_params>(application);
            var tempParms = mapper.Map<temp_dfa_appapplicationstart_params>(application); // TODO: remove

            var applicationId = await handler.HandleApplication(mappedApplication, tempParms);

            // Verify Profile
            application.ProfileVerification.profile.BCeIDBusinessGuid = currentUserId;
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
            var e2 = ((ApplicantSubtypeCategories)System.Enum.Parse(typeof(ApplicantSubtypeCategories), "FirstNationCommunity")).ToString();
            var e3 = ((EstimatedPercent)System.Enum.Parse(typeof(EstimatedPercent), "FirstNationCommunity")).ToString();

            if (application == null) return BadRequest("Application details cannot be empty.");

            //var dfa_appcontact = await handler.HandleGetUser(currentUserId);
            //currentUserId = "6e0d26eb-376a-ef11-b851-00505683fbf4";
            //application.ProfileVerification = new ProfileVerification() { profileId = currentUserId };
            application.ProfileVerification = new ProfileVerification() { profileId = "6e0d26eb-376a-ef11-b851-00505683fbf4" };

            var mappedApplication = mapper.Map<dfa_appapplicationmain_params>(application);
            var result = await handler.HandleApplicationUpdate(mappedApplication, null);

            if (application.OtherContact != null)
            {
                foreach (var objContact in application.OtherContact)
                {
                    if (string.IsNullOrEmpty(mappedApplication.dfa_appapplicationid))
                    {
                        objContact.applicationId = Guid.Parse(result);
                    }
                    else
                    {
                        objContact.applicationId = Guid.Parse(mappedApplication.dfa_appapplicationid);
                    }
                    var mappedOtherContact = mapper.Map<dfa_appothercontact_params>(objContact);

                    var resultContact = await handler.HandleOtherContactAsync(mappedOtherContact);
                }
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
            dfaApplicationStart.ProfileVerification = mapper.Map<ProfileVerification>(dfa_appapplication);
            dfaApplicationStart.Consent = mapper.Map<Consent>(dfa_appapplication);
            dfaApplicationStart.AppTypeInsurance = mapper.Map<AppTypeInsurance>(dfa_appapplication);
            dfaApplicationStart.OtherPreScreeningQuestions = mapper.Map<OtherPreScreeningQuestions>(dfa_appapplication);

            // Fill in profile
            // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
            var userId = userService.GetBCeIDBusinessId();
            if (string.IsNullOrEmpty(userId)) return NotFound();

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
        public async Task<ActionResult<DFAApplicationMain>> GetApplicationMain(
            [FromQuery]
            [Required]
            Guid applicationId)
        {
            try
            {
                // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
                var userId = userService.GetBCeIDBusinessId();
                if (string.IsNullOrEmpty(userId)) return NotFound();

                var appContactProfile = await handler.HandleGetUser(userId);

                var dfa_appapplication = await handler.GetApplicationMainAsync(applicationId);
                DFAApplicationMain dfaApplicationMain = new DFAApplicationMain();
                dfaApplicationMain.Id = applicationId;
                dfaApplicationMain.propertyDamage = mapper.Map<PropertyDamage>(dfa_appapplication);

                return Ok(dfaApplicationMain);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// get dfa applications
        /// </summary>
        /// <returns>list of dfa applications</returns>
        [HttpGet("dfaapplication")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentApplication>>> GetDFAApplications()
        {
            // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
            var userData = userService.GetJWTokenData();

            if (userData == null) return NotFound();
            var profileId = "6e0d26eb-376a-ef11-b851-00505683fbf4"; //userData.bceid_business_guid.ToString(); //"ed762426-1075-ee11-b846-00505683fbf4";
            var lstApplications = await handler.HandleApplicationList(profileId);
            return Ok(lstApplications);
        }

        /// <summary>
        /// get dfa applications
        /// </summary>
        /// <returns>list of dfa applications</returns>
        /// <param name="applicationId">The application Id.</param>
        [HttpGet("dfaapplicationbyID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CurrentApplication>> GetApplicationDetailsForProject([FromQuery]
            [Required]
            Guid applicationId)
        {
            var lstApplications = await handler.HandleApplicationDetails(Convert.ToString(applicationId));
            return Ok(lstApplications);
        }

        /// <summary>
        /// Get the applicant subtype records
        /// </summary>
        /// <returns>applicant subtype records</returns>
        [HttpGet("applicantsubtypes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ApplicantSubtypes>> GetApplicantSubTypes()
        {
            var lstApplicantSubtypes = new List<ApplicantSubtypes>()
            {
                new ApplicantSubtypes()
                {
                    ID = "1",
                    SubType = GetEnumMemberAttrValue(ApplicantSubtypeCategories.FirstNationCommunity),
                    DFAComment = string.Empty,
                    EstimatePercent = Convert.ToInt32(EstimatedPercent.FirstNationCommunity),
                },
                new ApplicantSubtypes()
                {
                    ID = "2",
                    SubType = GetEnumMemberAttrValue(ApplicantSubtypeCategories.Municipality),
                    DFAComment = string.Empty,
                    EstimatePercent = Convert.ToInt32(EstimatedPercent.FirstNationCommunity),
                },
                new ApplicantSubtypes()
                {
                    ID = "3",
                    SubType = GetEnumMemberAttrValue(ApplicantSubtypeCategories.RegionalDistrict),
                    DFAComment = string.Empty,
                    EstimatePercent = Convert.ToInt32(EstimatedPercent.RegionalDistrict),
                },
                new ApplicantSubtypes()
                {
                    ID = "4",
                    SubType = GetEnumMemberAttrValue(ApplicantSubtypeCategories.OtherLocalGovernmentBody),
                    DFAComment = string.Empty,
                    EstimatePercent = Convert.ToInt32(EstimatedPercent.OtherLocalGovernmentBody),
                },
                new ApplicantSubtypes()
                {
                    ID = "5",
                    SubType = GetEnumMemberAttrValue(ApplicantSubtypeCategories.Other),
                    DFAComment = string.Empty,
                    EstimatePercent = Convert.ToInt32(EstimatedPercent.Other),
                }
            };
            return Ok(lstApplicantSubtypes);
        }

        /// <summary>
        /// Get the applicant subtype records
        /// </summary>
        /// <returns>applicant subtype records</returns>
        [HttpGet("applicantsubsubtypes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ApplicantSubtypeSubCategories> GetApplicantSubSubTypes()
        {
            return Ok(null);
        }

        public static string GetEnumDescription(System.Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

            if (attributes != null && attributes.Any())
            {
                return attributes.First().Description;
            }

            return value.ToString();
        }

        public string GetEnumMemberAttrValue<T>(T enumVal)
        {
            var enumType = typeof(T);
            var memInfo = enumType.GetMember(enumVal.ToString());
            var attr = memInfo.FirstOrDefault()?.GetCustomAttributes(false).OfType<EnumMemberAttribute>().FirstOrDefault();
            if (attr != null)
            {
                return attr.Value;
            }

            return null;
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
        public bool notifyUser { get; set; }
    }

    public class DFAApplicationMain
    {
        public Guid? Id { get; set; }
        public PropertyDamage? propertyDamage { get; set; }
        public ProfileVerification? ProfileVerification { get; set; }
        public OtherContact[]? OtherContact { get; set; }
        public bool deleteFlag { get; set; }
        public bool notifyUser { get; set; }
    }

    public class CurrentApplication
    {
        public string ApplicationId { get; set; }
        public string EventId { get; set; }
        public string ApplicationType { get; set; }
        public string DamagedAddress { get; set; }
        public string CaseNumber { get; set; }
        public string DateOfDamage { get; set; }
        public string DateOfDamageTo { get; set; }
        public string PrimaryApplicantSignedDate { get; set; }
        public string DateFileClosed { get; set; }
        public string Status { get; set; }
        public List<StatusBar> StatusBar { get; set; }
        public string StatusLastUpdated { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool? floodDamage { get; set; }
        public bool? landslideDamage { get; set; }
        public bool? stormDamage { get; set; }
        public bool? wildfireDamage { get; set; }
        public bool? otherDamage { get; set; }
        public bool? eligibleGST { get; set; }
        public string? otherDamageText { get; set; }
    }

    public class ApplicantSubtypes
    {
        public string ID { get; set; }
        public string SubType { get; set; }
        public int EstimatePercent { get; set; }
        public string DFAComment { get; set; }
    }

    public class StatusBar
    {
        public string Label { get; set; }
        public bool IsCompleted { get; set; }
        public bool CurrentStep { get; set; }
        public bool IsFinalStep { get; set; }
        public bool IsErrorInStatus { get; set; }
    }
}
