using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Database.Resources;
using EMBC.Database.Shared.Contract;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Services;
using EMBC.DFA.PUBLIC.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace EMBC.DFA.API.Controllers
{
    [Route("api/projects")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMapper mapper;
        private readonly IConfigurationHandler handler;
        private readonly ProjectAppealService projectAppealService;
        private readonly IProjectAppealRepository projectAppealRepository;
        // 2024-08-11 EMCRI-595 waynezen; BCeID Authentication
        private readonly IUserService userService;
        private readonly IConfiguration configuration;

        public ProjectController(
            IHostEnvironment env, IMapper mapper, IConfigurationHandler handler, ProjectAppealService projectAppealService, IProjectAppealRepository projectAppealRepository,
            IUserService userService, IConfiguration configuration)
        {
            this.env = env;
            this.mapper = mapper;
            this.handler = handler;
            this.projectAppealService = projectAppealService.ThrowIfNull();
            this.projectAppealRepository = projectAppealRepository.ThrowIfNull();
            this.userService = userService.ThrowIfNull();
            this.configuration = configuration;
        }

        private string currentUserId => userService.GetBCeIDBusinessId();

        /// <summary>
        /// get dfa applications
        /// </summary>
        /// <param name="applicationId">The application Id.</param>
        /// <returns>list of dfa applications</returns>
        [HttpGet("dfaprojects")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CurrentProject>>> GetDFAProjects(string applicationId)
        {
            var lstProjects = await handler.HandleProjectList(applicationId);
            // TODO consolidate the above query with the below N queries to have only one query
            lstProjects.ForEach(project => 
            {
                // load project appeals including process stages(timeline)
                var query = new Database.Contract.ProjectAppealQuery();
                query.ProjectId = Guid.Parse(project.ProjectId);
                var workflow = projectAppealRepository
                    .GetWorkflow(query);
                if (workflow?.ProjectAppeals?.Any() ?? false)
                {
                    var currentProjectAppeal = workflow.ProjectAppeals.Last();
                    project.ActiveStage = new CurrentProjectAppeal();
                    project.ActiveStage.CompletedOn = currentProjectAppeal.ProjectAppealEligibility.CompletedOn;
                    project.ActiveStage.Stage = currentProjectAppeal.ProjectAppealEligibility.ActiveStage.Name;
                    project.ActiveStage.Status = projectAppealService.MapStageNote(currentProjectAppeal);
                    // NOTE currently, to be consistent, the stages are hard-coded
                    // if you want dynamic stages/steps for the timeline, uncomment and finish the below code
                    // I would strongly recommend refactoring all of the timelines before moving towards dynamic stages
                    // currently, the data is not normalized, the UI and business logic are not separated, and various other issues
                    //project.StatusBar = currentEligibility.Stages
                    //    .Select(s =>
                    //    {
                    //        var currentStage = workflow.Stages.Any(w => w.Id == s.Id);
                    //        return new ProjectStatusBar()
                    //        {
                    //            CurrentStep = currentStage,
                    //            IsCompleted = s.Id == currentEligibility.Id,
                    //            IsFinalStep = s == currentEligibility.Stages.Last(),
                    //            Stage = currentStage ? project.Stage : string.Empty,
                    //            Status = s.Name,
                    //            //StatusColor
                    //        };
                    //    })
                    //    .ToList();
                }
            });
            return Ok(lstProjects);
        }

        /// <summary>
        /// create or update project
        /// </summary>
        /// <param name="project">The project information</param>
        /// <returns>application id</returns>
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpsertProject(DFAProjectMain project)
        {
            if (project == null) return BadRequest("Project details cannot be empty.");
            var dfa_appcontact = await handler.HandleGetUser(currentUserId);
            var mappedProject = mapper.Map<dfa_project_params>(project);
            var result = await handler.HandleProjectCreateUpdate(mappedProject);

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
        public async Task<ActionResult<DFAProjectMain>> GetProjectMain(
            [FromQuery]
            [Required]
            Guid projectId)
        {
            var userId = currentUserId;
            var appContactProfile = await handler.HandleGetUser(userId);

            var dfa_project = await handler.GetProjectMainAsync(projectId);
            DFAProjectMain dfaProjectMain = new DFAProjectMain();
            dfaProjectMain.Id = projectId;
            dfaProjectMain.Project = mapper.Map<RecoveryPlan>(dfa_project);
            if (dfaProjectMain.Project != null && dfaProjectMain.Project.estimateCostIncludingTax == 0)
            {
                dfaProjectMain.Project.estimateCostIncludingTax = null;
            }

            return Ok(dfaProjectMain);
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

        /// <summary>
        /// Get the applicant subtype records
        /// </summary>
        /// <returns>applicant subtype records</returns>
        [HttpGet("projecttypes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ProjectTypes>> GetProjectTypes()
        {
            var lstProjecttypes = new List<ProjectType>()
            {
                new ProjectType()
                {
                    id = "1",
                    type = GetEnumMemberAttrValue(ProjectTypeCategories.InfrastructureRepair),
                },
                new ProjectType()
                {
                    id = "2",
                    type = GetEnumMemberAttrValue(ProjectTypeCategories.DebrisCleanup),
                },
                new ProjectType()
                {
                    id = "3",
                    type = GetEnumMemberAttrValue(ProjectTypeCategories.Engineering),
                },
                new ProjectType()
                {
                    id = "4",
                    type = GetEnumMemberAttrValue(ProjectTypeCategories.PlanningDesign),
                },
                new ProjectType()
                {
                    id = "5",
                    type = GetEnumMemberAttrValue(ProjectTypeCategories.Other),
                }
            };
            return Ok(lstProjecttypes);
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

    public class CurrentProject
    {
        public string ApplicationId { get; set; }
        public string ProjectId { get; set; }
        public string ProjectNumber { get; set; }
        public string ProjectName { get; set; }
        public string SiteLocation { get; set; }
        public string CreatedDate { get; set; }
        public string EstimatedCompletionDate { get; set; }
        public string EMCRApprovedAmount { get; set; }
        public string Deadline18Month { get; set; }
        public string Status { get; set; }
        public string Stage { get; set; }
        public List<ProjectStatusBar> StatusBar { get; set; }
        public string StatusLastUpdated { get; set; }
        public bool IsErrorInStatus { get; set; }
        public bool IsHidden { get; set; } = true;
        public string StatusColor { get; set; }
        public string DateFileClosed { get; set; }
        public bool IsClaimSubmission { get; set; }
        public bool HasAmendment { get; set; }
        public string ProjectDecision { get; set; }
        public string ProjectType { get; set; }
        public string ProjectTypeOther { get; set; }
        public string ProjectApprovedDate { get; set; }
        public CurrentProjectAppeal ActiveStage { get; set; }
    }

    public class CurrentProjectAppeal
    {
        public string id { get; set; }
        public DateTime? SubmissionDate { get; set; }
        public DateTime? CompletedOn { get; set; }
        public string Status { get; set; }
        public string Stage { get; set; }
    }

    public class ProjectType
    {
        public string id { get; set; }
        public string type { get; set; }
    }
    public class ProjectStatusBar
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
