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
using EMBC.DFA.API.ConfigurationModule.Models.PDF;
using EMBC.DFA.API.ConfigurationModule.Models.PDF.PDFService;
using EMBC.DFA.API.Services;
using EMBC.Gov.BCeID;
using Google.Protobuf.WellKnownTypes;
using HandlebarsDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
        private readonly PDFServiceHandler pDFServiceHandler;
        private readonly IBCeIDBusinessQuery bceidQuery;
        private readonly ILogger<ApplicationController> logger;

        public ApplicationController(
            IHostEnvironment env,
            IMapper mapper,
            ILogger<ApplicationController> logger,
            IConfigurationHandler handler,
            IUserService userService,
            PDFServiceHandler pdfServiceHandler,
            IBCeIDBusinessQuery query)
        {
            this.env = env;
            this.mapper = mapper;
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.handler = handler;
            this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
            this.pDFServiceHandler = pdfServiceHandler ?? throw new ArgumentNullException($"{nameof(pdfServiceHandler)}");
            this.bceidQuery = query ?? throw new ArgumentNullException($"{nameof(query)}");
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
            var txt = JsonConvert.SerializeObject(application, Formatting.Indented);
            var e2 = ((ApplicantSubtypeCategories)System.Enum.Parse(typeof(ApplicantSubtypeCategories), "FirstNationCommunity")).ToString();
            var e3 = ((EstimatedPercent)System.Enum.Parse(typeof(EstimatedPercent), "FirstNationCommunity")).ToString();

            if (application == null) return BadRequest("Application details cannot be empty.");

            var userData = userService.GetJWTokenData();
            if (userData == null) return NotFound();

            // 2024-09-17 EMCRI-663 waynezen; handle Primary Contact
            var primeContactIn = mapper.Map<dfa_applicationprimarycontact_params>(application.applicationContacts);

            var contactId = primeContactIn?.dfa_appcontactid;
            if (primeContactIn?.dfa_bceiduserguid != null)
            {
                // saving new Application - try to find existing Primary contact using BCeID user guid
                contactId = await handler.HandlePrimaryContactAsync(primeContactIn);

                // if still no contactId, then error
                if (contactId == null)
                {
                    return BadRequest("Create/update Primary Contact failed");
                }
            }

            var mappedApplication = mapper.Map<dfa_appapplicationmain_params>(application);
            mappedApplication.dfa_applicant = contactId;

            // 2024-09-17 EMCRI-676 waynezen; if no Primary Contact yet, use BCeID guid's of logged in user
            if (mappedApplication?.dfa_bceidbusinessguid == null && primeContactIn?.dfa_bceidbusinessguid == null)
            {
                mappedApplication.dfa_bceidbusinessguid = userData.bceid_business_guid.ToString();
            }
            else
            {
                mappedApplication.dfa_bceidbusinessguid = primeContactIn.dfa_bceidbusinessguid;
            }

            // 2024-10-29 EMCRI-922 waynezen; check if a verified Primary Contact exists
            // 2024-10-29 EMCRI-922 waynezen; during UAT testing, they decided to NOT set confirmed primary contact from Portal
            mappedApplication.verified_contact_id = null;
            //if (contactId != null && primeContactIn?.dfa_bceiduserguid != null)
            //{
            //    var confirmedPrimContact = await handler.HandleGetVerifiedPrimaryContactAsync(primeContactIn.dfa_bceiduserguid);
            //    if (confirmedPrimContact == null)
            //    {
            //        mappedApplication.verified_contact_id = null;
            //    }
            //    else
            //    {
            //        mappedApplication.verified_contact_id = confirmedPrimContact.contactid;
            //    }
            //}

            var result = await handler.HandleApplicationUpdate(mappedApplication, null);

            if (string.IsNullOrEmpty(mappedApplication.dfa_appapplicationid) && result != null && Guid.TryParse(result, out Guid appId))
            {
                mappedApplication.dfa_appapplicationid = result;
            }
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
            if (application != null && application.applicationDetails != null && application.applicationDetails.appStatus == ApplicationStageOptionSet.SUBMIT)
            {
                PdfReuest pdfReuest = new PdfReuest
                {
                    PdfApplicationData = GetPdfApplicationData(application),
                    Template = "dfa_application_summary"
                };

                var file = await pDFServiceHandler.GetFileDataAsync(pdfReuest);
                ApplicationReviewPDFUpload applicationReviewPDFUpload = null;
                try
                {
                    // 2024-10-23 EMCRI-901 waynezen; GetPdfApplicationData can return null
                    if (pdfReuest?.PdfApplicationData == null)
                    {
                        throw new Exception("Error in GetPdfApplicationData() function");
                    }

                    applicationReviewPDFUpload = BuildApplicationReviewPDFUpload(mappedApplication, file);
                    var mappedFileUpload = mapper.Map<AttachmentEntity>(applicationReviewPDFUpload);
                    var submissionEntity = mapper.Map<SubmissionEntityPDF>(applicationReviewPDFUpload);
                    submissionEntity.documentCollection = Enumerable.Empty<AttachmentEntity>();
                    submissionEntity.documentCollection = submissionEntity.documentCollection.Append<AttachmentEntity>(mappedFileUpload);
                    var fileUploadResult = await handler.HandleFileUploadApplicationPDFAsync(submissionEntity);
                }
                catch (Exception ex)
                {
                    return Ok(ex.Message);
                }
            }
            return Ok(result);
        }

        private ApplicationReviewPDFUpload BuildApplicationReviewPDFUpload(dfa_appapplicationmain_params mappedApplication, byte[] file)
        {
            return new ApplicationReviewPDFUpload
            {
                dfa_appapplicationid = Guid.Parse(mappedApplication.dfa_appapplicationid),
                contentType = "application/pdf",
                fileData = file,
                fileType = FileCategory.AppplicationPDF,
                fileName = $"{mappedApplication.dfa_appapplicationid}.pdf",
                fileDescription = "Appplication PDF",
                uploadedDate = DateTime.Now.ToString()
            };
        }

        /// <summary>
        /// Create content that will be transformed into PDF
        /// </summary>
        /// <param name="application">application</param>
        /// <returns>pdfApplicationData or NULL if an exception is thrown</returns>
        public PdfApplicationData GetPdfApplicationData(DFAApplicationMain application)
        {
            Contact[] contacts = null;
            if (application.OtherContact != null && application.OtherContact.Count() > 0)
            {
              contacts = mapper.Map<Contact[]>(application.OtherContact);
            }
            var contactText = new StringBuilder();
            contactText.Append($@"<div class='contacts-container'>");
            if (contacts != null && contacts.Count() > 0)
            {
                contactText.Append($@"<table class='contacts' style='width:95%'>");
                contactText.Append($@"<tr style='background-color: #415a88;color: #fff;'>
                         <th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Cell Phone</th><th>Job Title</th></tr>");
                foreach (var contact in contacts)
                {
                    contactText.Append($@"<tr>
                        <td>{contact.FirstName}</td>
                        <td>{contact.LastName}</td>
                        <td>{contact.BusinessPhone}</td>   
                        <td>{contact.Email}</td>
                        <td>{contact.CellPhone}</td>
                        <td>{contact.JobTitle}</td>
                        </tr>");
                }
                contactText.Append($@"</table>");
            }
            else
            {
                contactText.Append($@"<div class='row' style='display:flex;'> ");
                contactText.Append($@"<div class='col-6'> <span >Other Contacts info missing</span> </div>");
                contactText.Append($@"<div class='col-6'> <span style='color:red'>At least one other contact is required.</span> </div>");
                contactText.Append($@"</div>");
            }

            contactText.Append($@"</div>");

            PdfApplicationData pdfApplicationData = new PdfApplicationData();
            if (application.applicationDetails != null)
            {
                try
                {
                    pdfApplicationData = mapper.Map<PdfApplicationData>(application);
                }
                catch (Exception ex)
                {
                    pdfApplicationData.ContactsText = ex.Message;
                    throw;
                }
                try
                {
                    pdfApplicationData.ContactsText = contactText.ToString();

                    var causeofDamage = new StringBuilder();
                    if (application.applicationDetails.floodDamage.HasValue && application.applicationDetails.floodDamage.Value)
                    {
                        causeofDamage.Append("Flood Damage, ");
                    }
                    if (application.applicationDetails.landslideDamage.HasValue && application.applicationDetails.landslideDamage.Value)
                    {
                        causeofDamage.Append("Landslide Damage, ");
                    }
                    if (application.applicationDetails.stormDamage.HasValue && application.applicationDetails.stormDamage.Value)
                    {
                        causeofDamage.Append("Storm Damage, ");
                    }
                    if (application.applicationDetails.wildfireDamage.HasValue && application.applicationDetails.wildfireDamage.Value)
                    {
                        causeofDamage.Append("Wildfire Damage, ");
                    }

                    // 2024-10-23 EMCRI-901 waynezen; avoid "StartIndex cannot be less than zero" error
                    if (causeofDamage.Length > 2)
                    {
                        causeofDamage.Remove(causeofDamage.Length - 2, 2);
                    }
                    if (application.applicationDetails.otherDamage.HasValue && application.applicationDetails.otherDamage.Value)
                    {
                        causeofDamage.Append(application.applicationDetails.otherDamageText);
                    }
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex.Message, ex);
                    return null;
                }
            }
            return pdfApplicationData;
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
                var userData = userService.GetJWTokenData();
                if (userData == null) return NotFound();

                var dfa_appapplication = await handler.GetApplicationMainAsync(applicationId);
                DFAApplicationMain dfaApplicationMain = new DFAApplicationMain();
                dfaApplicationMain.Id = applicationId;
                dfaApplicationMain.applicationDetails = mapper.Map<ApplicationDetails>(dfa_appapplication);
                ApplicationContacts appContact = new ApplicationContacts();
                appContact = mapper.Map<ApplicationContacts>(dfa_appapplication);

                /* EMCRI-1066: Authorized Representative */
                dfaApplicationMain.authorizedRepresentative = mapper.Map<AuthorizedRepresentative>(dfa_appapplication);

                // 2024-09-24 EMCRI-663; get primary contact info
                if (dfa_appapplication?._dfa_applicant_value != null)
                {
                    var primeContactIn = await handler.HandleGetPrimaryContactAsync(dfa_appapplication._dfa_applicant_value);

                    // convert Dynamics DTO to UI DTO
                    appContact = mapper.Map<ApplicationContacts>(primeContactIn);
                    // add in a few extra fields from the Application -> Contacts screen
                    mapper.Map<dfa_appapplicationmain_retrieve, ApplicationContacts>(dfa_appapplication, appContact);

                    // 2024-10-05 EMCRI-804 waynezen; validate Primary Contact
                    if (!appContact.primaryContactValidated.HasValue &&
                        !string.IsNullOrEmpty(appContact?.primaryContactSearch))
                    {
                        var userGuid = userData.bceid_user_guid;
                        var orgGuid = userData.bceid_business_guid;
                        var bceidData = await this.bceidQuery.ProcessBusinessQuery(userGuid, appContact.primaryContactSearch);

                        if (bceidData != null && orgGuid.Equals(bceidData.organizationGuid))
                        {
                            appContact.primaryContactValidated = true;
                        }
                    }
                }

                dfaApplicationMain.applicationContacts = appContact;
                return Ok(dfaApplicationMain);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getcontact/byId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationContacts>> GetPrimaryContactByBCeIDAsync(
            [FromQuery]
            [Required]
            Guid bceiduserguid)
        {
            try
            {
                var primeContactIn = await handler.HandleGetPrimaryContactByBCeIDAsync(bceiduserguid.ToString());
                // convert Dynamics DTO to UI DTO
                ApplicationContacts appContact = new ApplicationContacts();
                appContact = mapper.Map<ApplicationContacts>(primeContactIn);
                return appContact;
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
            var lstApplications = await handler.HandleApplicationList(userData);
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
        public ApplicationDetails? applicationDetails { get; set; }
        // 2024-09-16 EMCRI-663 waynezen; new fields from application
        public ApplicationContacts applicationContacts { get; set; }
        public ProfileVerification? ProfileVerification { get; set; }
        public OtherContact[]? OtherContact { get; set; }
        public AuthorizedRepresentative? authorizedRepresentative { get; set; }
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
        public string Stage { get; set; }
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
        public string StatusColor { get; set; }
        public bool IsProjectSubmission { get; set; }
        public string? ARFirstName { get; set; }
        public string? ARLastName { get; set; }
        public string? ARBusinessPhone { get; set; }
        public string? AREmail { get; set; }
        public string? ARPositionTitle { get; set; }
        public bool? ARFirstDeclaration { get; set; }
        public bool? ARSecondDeclaration { get; set; }
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
        public string Status { get; set; }
        public string Stage { get; set; }
        public bool IsCompleted { get; set; }
        public bool CurrentStep { get; set; }
        public bool IsFinalStep { get; set; }
        public bool IsErrorInStatus { get; set; }
        public string StatusColor { get; set; }
    }
}
