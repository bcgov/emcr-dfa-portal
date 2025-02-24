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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/invoices")]
    [ApiController]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;

        public InvoiceController(
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
        /// get dfa invoices
        /// </summary>
        /// <param name="claimId">The claim Id.</param>
        /// <returns>list of dfa invoices</returns>
        [HttpGet("dfainvoices")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentInvoice>>> GetDFAInvoices(string claimId)
        {
            //var userId = currentUserId;
            //var profile = await handler.HandleGetUser(userId);
            //if (profile == null) return NotFound(userId);
            //var profileId = profile.Id;
            var lstInvoices = await handler.HandleInvoiceList(claimId);

            return Ok(lstInvoices);
        }

        /// <summary>
        /// create or update invoice
        /// </summary>
        /// <param name="invoice">The invoice information</param>
        /// <returns>invoice id</returns>
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertInvoice(DFAInvoiceMain invoice)
        {
            if (invoice == null) return BadRequest("Invoice details cannot be empty.");
            var dfa_appcontact = await handler.HandleGetUser(currentUserId);
            dfa_invoice_params mappedInvoice = null;

            try
            {
                mappedInvoice = mapper.Map<dfa_invoice_params>(invoice);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
            var result = await handler.HandleInvoiceCreateUpdate(mappedInvoice);

            return Ok(result);
        }

        /// <summary>
        /// delete invoice
        /// </summary>
        /// <param name="invoice">The invoice information</param>
        /// <returns>invoice id</returns>
        [HttpPut("delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> DeleteInvoice(DFAInvoiceMain invoice)
        {
            if (invoice == null) return BadRequest("Invoice details cannot be empty.");
            var invoiceParams = mapper.Map<dfa_invoice_delete_params>(invoice);
            var result = await handler.HandleInvoiceDelete(invoiceParams);

            return Ok(result);
        }

        /// <summary>
        /// Get project main by Id
        /// </summary>
        /// <returns> DFAProjectMain</returns>
        /// <param name="projectId">The project Id.</param>
        [HttpGet("appmain/byId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DFAClaimMain>> GetProjectMain(
            [FromQuery]
            [Required]
            Guid projectId)
        {
            var userId = currentUserId;
            var appContactProfile = await handler.HandleGetUser(userId);

            var dfa_project = await handler.GetProjectMainAsync(projectId);
            DFAClaimMain dfaClaimMain = new DFAClaimMain();
            dfaClaimMain.Id = projectId;
            //dfaClaimMain.Project = mapper.Map<RecoveryPlan>(dfa_project);

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

    public class CurrentInvoice : Invoice
    {
        public string ApplicationId { get; set; }
        public string ProjectId { get; set; }
        public string ClaimId { get; set; }
        public string InvoiceId { get; set; }
        public string Status { get; set; }
        public string StatusLastUpdated { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool IsHidden { get; set; } = true;
        public string StatusColor { get; set; }
        public string ClaimDecision { get; set; }
    }
}
