using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection.Metadata;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Messaging;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using NJsonSchema.Annotations;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;
        private readonly IProfileInviteService profileInviteService;
        private readonly IConfigurationHandler handler;

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub).Split('@')[0];

        public ProfileController(
            IHostEnvironment env,
            IMessagingClient messagingClient,
            IMapper mapper,
            IEvacuationSearchService evacuationSearchService,
            IProfileInviteService profileInviteService,
            IConfigurationHandler handler)
        {
            this.env = env;
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.evacuationSearchService = evacuationSearchService;
            this.profileInviteService = profileInviteService;
            this.handler = handler;
        }

        /// <summary>
        /// Get the current logged in user's profile
        /// </summary>
        /// <returns>Currently logged in user's profile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Profile>> GetProfile()
        {
            var userId = currentUserId;
            //var profile = mapper.Map<Profile>(await evacuationSearchService.GetRegistrantByUserId(userId));
            //var profile = null;
            //if (profile == null)
            //{
            //    //try get BCSC profile
            //    profile = GetUserFromPrincipal();
            //}
            var profile = await handler.HandleGetUser(userId);
            if (profile == null)
            {
                //try get BCSC profile
                profile = GetUserFromPrincipal();
            }
            else
            {
                var profileBCSC = GetUserFromPrincipal();
                var profileDFA = mapper.Map<Profile>(profile);
                var conflicts = ProfilesConflictDetector.DetectConflicts(profileDFA, profileBCSC);

                if (conflicts.Count() > 0)
                {
                    profile.ContactDetails.Email = profileBCSC.ContactDetails.Email;
                    profile.PersonalDetails.FirstName = profileBCSC.PersonalDetails.FirstName;
                    profile.PersonalDetails.LastName = profileBCSC.PersonalDetails.LastName;
                    profile.PrimaryAddress = profileBCSC.PrimaryAddress;
                    profile.lastUpdatedDateBCSC = DateTime.Now.ToShortDateString();

                    var mappedProfile = mapper.Map<dfa_appcontact>(profile);

                    var addressConflicts = ProfilesConflictDetector.DetectAddressConflicts(profileDFA);

                    if (addressConflicts.Count() > 0)
                    {
                        mappedProfile.dfa_isprimaryandsecondaryaddresssame = Convert.ToInt32(SameAddressOptionSet.No);
                        profile.IsMailingAddressSameAsPrimaryAddress = SameAddressOptionSet.No.ToString();
                    }
                    else
                    {
                        mappedProfile.dfa_isprimaryandsecondaryaddresssame = Convert.ToInt32(SameAddressOptionSet.Yes);
                        profile.IsMailingAddressSameAsPrimaryAddress = SameAddressOptionSet.Yes.ToString();
                    }

                    var contactId = await handler.HandleContact(mappedProfile);
                }
            }

            if (profile == null) return NotFound(userId);
            return Ok(profile);
        }

        /// <summary>
        /// Get the current logged in user's profile, with first name, last name, primary address and email from BCSC
        /// </summary>
        /// <returns>Currently logged in user's profile with BCSC Updates</returns>
        [HttpGet("currentWithBCSCUpdates")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Profile>> GetProfileWithUpdatedBCSC()
        {
            var userId = currentUserId;
            var appContactProfile = await handler.HandleGetUser(userId);

            // get BCSC profile
            //var bcscProfile = GetUserFromPrincipal();

            //// update appContact details from BCSC login
            //appContactProfile.ContactDetails.Email = bcscProfile.ContactDetails.Email;
            //appContactProfile.PersonalDetails.FirstName = bcscProfile.PersonalDetails.FirstName;
            //appContactProfile.PersonalDetails.LastName = bcscProfile.PersonalDetails.LastName;
            //appContactProfile.PrimaryAddress = bcscProfile.PrimaryAddress;

            return Ok(appContactProfile);
        }

        /// <summary>
        /// check if user exists or not
        /// </summary>
        /// <returns>true if existing user, false if a new user</returns>
        [HttpGet("current/exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> GetDoesUserExists()
        {
                var userId = currentUserId;
                var profile = await handler.HandleGetUser(userId);
                return Ok(profile != null);
            }

        /// <summary>
        /// Create or update the current user's profile
        /// </summary>
        /// <param name="profile">The profile information</param>
        /// <returns>profile id</returns>
        [HttpPost("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> AddContact(Profile profile)
        {
            profile.BCServiceCardId = currentUserId;
            var mappedProfile = mapper.Map<dfa_appcontact>(profile);
            if (profile == null) return BadRequest("Profile details cannot be empty!");

            var contactId = await handler.HandleContact(mappedProfile);
            return Ok(contactId);
        }

        /// <summary>
        /// Get the logged in user's profile and conflicts with the data that came from the authenticating identity provider
        /// </summary>
        /// <returns>The current user's profile, the identity provider's profile and the detected conflicts</returns>
        [HttpGet("current/conflicts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ProfileDataConflict>>> GetProfileConflicts()
        {
            var userId = currentUserId;

            var profile = await evacuationSearchService.GetRegistrantByUserId(userId);
            if (profile == null) return NotFound(userId);

            var userProfile = GetUserFromPrincipal();
            var conflicts = ProfilesConflictDetector.DetectConflicts(mapper.Map<Profile>(profile), userProfile);
            return Ok(conflicts);
        }

        /// <summary>
        /// Marking the BCSC address change message as displayed
        /// </summary>
        /// <returns>true after update</returns>
        [HttpGet("addressChangeMsg")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> MarkAddressChangeMessageDisplay()
        {
            var userId = currentUserId;
            var profile = await handler.HandleGetUser(userId);

            if (profile != null)
            {
                var mappedProfile = mapper.Map<dfa_appcontact>(profile);
                mappedProfile.dfa_lastdateupdated = !string.IsNullOrEmpty(mappedProfile.dfa_lastdateupdated) ?
                    Convert.ToDateTime(mappedProfile.dfa_lastdateupdated).ToShortDateString() : null;
                var contactId = await handler.HandleContact(mappedProfile);
            }

            return Ok(true);
        }

        private Profile GetUserFromPrincipal()
        {
            if (!User.HasClaim(c => c.Type.Equals("userInfo", System.StringComparison.OrdinalIgnoreCase))) return null;
            var userProfile = BcscUserInfoMapper.MapBcscUserInfoToProfile(User.Identity?.Name, JsonDocument.Parse(User.FindFirstValue("userInfo")));
            return userProfile;
        }

        [HttpPost("invite-anonymous")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<IActionResult> Invite(InviteRequest request)
        {
            var file = (await messagingClient.Send(new EvacuationFilesQuery { FileId = request.FileId })).Items.SingleOrDefault();
            if (file == null) return NotFound(request.FileId);
            await messagingClient.Send(new InviteRegistrantCommand { RegistrantId = file.PrimaryRegistrantId, Email = request.Email });
            return Ok();
        }

        [HttpPost("current/join")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ProcessInvite(InviteToken token)
        {
            return Ok(await profileInviteService.ProcessInvite(token.Token, currentUserId));
        }
    }

    /// <summary>
    /// User's profile
    /// </summary>
    public class Profile
    {
        public string? Id { get; set; }

        public PersonDetails PersonalDetails { get; set; }

        public ContactDetails ContactDetails { get; set; }

        public Address PrimaryAddress { get; set; }

        public Address MailingAddress { get; set; }

        public string IsMailingAddressSameAsPrimaryAddress { get; set; }

        public string? BCServiceCardId { get; set; }

        public string? lastUpdatedDateBCSC { get; set; }
        public bool? isMailingAddressVerified { get; set; }
    }

    /// <summary>
    /// Base class for profile data conflicts
    /// </summary>
    [JsonConverter(typeof(PolymorphicJsonConverter<ProfileDataConflict>))]
    [KnownType(typeof(DateOfBirthDataConflict))]
    [KnownType(typeof(NameDataConflict))]
    [KnownType(typeof(AddressDataConflict))]
    public abstract class ProfileDataConflict
    {
        [Required]
        public abstract string DataElementName { get; }
    }

    /// <summary>
    /// Date of birth data conflict
    /// </summary>
    public class DateOfBirthDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => nameof(DateOfBirthDataConflict);

        public string ConflictingValue { get; set; }

        public string OriginalValue { get; set; }
    }

    /// <summary>
    /// Name data conflict
    /// </summary>
    public class NameDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => nameof(NameDataConflict);

        public ProfileName ConflictingValue
        { get; set; }

        public ProfileName OriginalValue
        { get; set; }
    }

    public class ProfileName
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    /// <summary>
    /// Address data conflict
    /// </summary>
    public class AddressDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => nameof(AddressDataConflict);

        public Address ConflictingValue { get; set; }

        public Address OriginalValue { get; set; }
    }

    public class InviteRequest
    {
        [Required]
        public string FileId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class InviteToken
    {
        [Required]
        public string Token { get; set; }
    }
}
