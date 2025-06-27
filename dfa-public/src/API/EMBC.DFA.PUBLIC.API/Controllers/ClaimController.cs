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
using AutoMapper.Execution;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/claims")]
    [ApiController]
    [Authorize]
    public class ClaimController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        // 2024-08-15 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;

        public ClaimController(
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

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        /// <summary>
        /// get dfa claims
        /// </summary>
        /// <param name="projectId">The project Id.</param>
        /// <returns>list of dfa claims</returns>
        [HttpGet("dfaclaims")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentClaim>>> GetDFAClaims(string projectId)
        {
            var lstClaims = await handler.HandleClaimList(projectId);

            foreach (var claim in lstClaims)
            {
                claim.ApprovedReimbursePercent = FixDecimalPlaces(claim.ApprovedReimbursePercent);
                claim.LessFirst1000 = FixDecimalPlaces(claim.LessFirst1000);
                claim.ApprovedClaimTotal = FixDecimalPlaces(claim.ApprovedClaimTotal);
                claim.EligiblePayable = FixDecimalPlaces(claim.EligiblePayable);
                claim.PaidClaimAmount = FixDecimalPlaces(claim.PaidClaimAmount);
                claim.ClaimTotal = FixDecimalPlaces(claim.ClaimTotal);
                claim.AdvancedDrawdownAmount = FixDecimalPlaces(claim.AdvancedDrawdownAmount);
            }

            return Ok(lstClaims);
        }

        private string FixDecimalPlaces(string number)
        {
            if (string.IsNullOrEmpty(number) || number.Contains("pending"))
            {
                return number;
            }
            if (number.IndexOf(".") == -1)
            {
                number += ".00";
            }
            else if (number.IndexOf(".") == number.Length - 2)
            {
                number += "0";
            }
            return number;
        }

        /// <summary>
        /// create or update claim
        /// </summary>
        /// <param name="claim">The claim information</param>
        /// <returns>claim id</returns>
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertClaim(DFAClaimMain claim)
        {
            if (claim == null) return BadRequest("Claim details cannot be empty.");
            var dfa_appcontact = await handler.HandleGetUser(currentUserId);
            var mappedClaim = mapper.Map<dfa_claim_params>(claim);
            var result = await handler.HandleClaimCreateUpdate(mappedClaim);

            return Ok(result);
        }

        /// <summary>
        /// Get project main by Id
        /// </summary>
        /// <returns> DFAProjectMain</returns>
        /// <param name="claimId">The claim Id.</param>
        [HttpGet("appmain/byClaimId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DFAClaimMain>> GetClaimMain(
            [FromQuery]
            [Required]
            Guid claimId)
        {
            var userId = currentUserId;
            var appContactProfile = await handler.HandleGetUser(userId);

            var dfa_claim = await handler.HandleClaimDetails(claimId.ToString());
            DFAClaimMain dfaClaimMain = new DFAClaimMain();
            dfaClaimMain.Id = claimId;
            dfaClaimMain.Claim = dfa_claim;

            dfa_claim.approvedReimbursement = FixDecimalPlaces(dfa_claim.approvedReimbursement);
            dfa_claim.lessFirst1000 = FixDecimalPlaces(dfa_claim.lessFirst1000);
            dfa_claim.approvedClaimTotal = FixDecimalPlaces(dfa_claim.approvedClaimTotal);
            dfa_claim.eligiblePayable = FixDecimalPlaces(dfa_claim.eligiblePayable);
            dfa_claim.paidClaimAmount = FixDecimalPlaces(dfa_claim.paidClaimAmount);
            dfa_claim.claimTotal = FixDecimalPlaces(dfa_claim.claimTotal);
               
            

            return Ok(dfaClaimMain);
        }

        /// <summary>
        /// get dfa project details
        /// </summary>
        /// <returns>project details</returns>
        /// <param name="projectId">The project Id.</param>
        [HttpGet("dfaprojectbyID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CurrentProject>> GetProjectDetailsForClaim([FromQuery]
            [Required]
            Guid projectId)
        {
            var objProject = await handler.HandleProjectDetails(Convert.ToString(projectId));
            return Ok(objProject);
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
    }

    public class CurrentClaim
    {
        public string ApplicationId { get; set; }
        public string ProjectId { get; set; }
        public string ClaimId { get; set; }
        public string ClaimNumber { get; set; }
        public bool FirstClaim { get; set; }
        public bool FinalClaim { get; set; }
        public string CreatedDate { get; set; }
        public string SubmittedDate { get; set; }
        public string ClaimTotal { get; set; }
        public string ApprovedClaimTotal { get; set; }
        public string LessFirst1000 { get; set; }
        public string ApprovedReimbursePercent { get; set; }
        public string EligiblePayable { get; set; }
        public string PaidClaimAmount { get; set; }
        public string PaidClaimDate { get; set; }
        public string Status { get; set; }
        public string Stage { get; set; }
        public List<ClaimStatusBar> StatusBar { get; set; }
        public List<ClaimStatusBar> AppealStatusBar { get; set; }
        public string StatusLastUpdated { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool IsHidden { get; set; } = true;
        public string StatusColor { get; set; }
        public string DateFileClosed { get; set; }
        public string ClaimDecision { get; set; }
        /* D4P-112 */
        public string AdvancedDrawdownAmount { get; set; }
        public string DecisionDate { get; set; }
        public string? ClaimType { get; set; }
        public bool? IsAdjustmentClaim { get; set; }
        public IEnumerable<CurrentProjectClaimAppeal> ClaimAppeals { get; set; }
    }

    public class CurrentProjectClaimAppeal
    {
        public string Id { get; set; }
        public string AppealDecision { get; set; }
        public string AppealStatus { get; set; }
    }

    public class ClaimStatusBar
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
