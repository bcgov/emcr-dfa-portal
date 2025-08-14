using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMBC.Database.Model;

namespace EMBC.Database.Resources
{
    public class ProjectAmendmentMapper : Profile
    {
        public ProjectAmendmentMapper()
        {
            CreateMap<DFA_ProjectAmendment, ProjectAmendment>()
                .ForMember(d => d.CreatedDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.CreatedOn).Year < 2020 ? string.Empty : Convert.ToDateTime(s.CreatedOn).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.AmendmentReceivedDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.DFA_AmendmentReceivedDate).Year < 2020 ? string.Empty : Convert.ToDateTime(s.DFA_AmendmentReceivedDate).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.AmendmentApprovedDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.DFA_AmendmentApprovedDate).Year < 2020 ? string.Empty : Convert.ToDateTime(s.DFA_AmendmentApprovedDate).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.AmendedProjectDeadlineDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.DFA_AmendedProjectDeadlineDate).Year < 2020 ? string.Empty : Convert.ToDateTime(s.DFA_AmendedProjectDeadlineDate).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.Amended18MonthDeadline, opts => opts.MapFrom(s => Convert.ToDateTime(s.DFA_Amended18MonthDeadline).Year < 2020 ? string.Empty : Convert.ToDateTime(s.DFA_Amended18MonthDeadline).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.AmendmentNumber, opts => opts.MapFrom(s => s.DFA_AmendmentNumber))
                .ForMember(d => d.ProjectId, opts => opts.MapFrom(s => s.DFA_Project.Id))
                .ForMember(d => d.AmendmentReason, opts => opts.MapFrom(s => s.DFA_AmendmentReason))
                .ForMember(d => d.EmcrDecisionComments, opts => opts.MapFrom(s => s.DFA_EMCRApprovalComments))
                .ForMember(d => d.AmendmentId, opts => opts.MapFrom(s => s.DFA_ProjectAmendmentId))
                .ForMember(d => d.EstimatedAdditionalProjectCost, opts => opts.MapFrom(s => s.DFA_EstimatedAdditionalProjectCost))
                .ForMember(d => d.ApprovedAdditionalProjectCost, opts => opts.MapFrom(s => s.DFA_ApprovedAdditionalProjectCost))
                .ForMember(d => d.RequestforProjectDeadlineExtention, opts => opts.MapFrom(s => s.DFA_RequestForProjectDeadlineExtension == true ? "Yes" : (s.DFA_RequestForProjectDeadlineExtension == false ? "No" : null)))
                .ForMember(d => d.DeadlineExtensionApproved, opts => opts.MapFrom(s => s.DFA_DeadlineExtensionApproved == true ? "Yes" : "No"))
                .ForMember(d => d.RequestforAdditionalProjectCost, opts => opts.MapFrom(s => s.DFA_RequestForAdditionalProjectCost == true ? "Yes" : (s.DFA_RequestForAdditionalProjectCost == false ? "No" : null)))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.DFA_AmendmentStagesName))
                .ForMember(d => d.Stage, opts => opts.MapFrom(s => s.DFA_AmendmentSubStagesName))
                .ForMember(d => d.AdditionalProjectCostDecision, opts => opts.MapFrom(s => s.DFA_AdditionalProjectCostDecisionName))
                .ForMember(d => d.AmendmentDecision, opts => opts.MapFrom(s => s.DFA_AmendmentDecisionName));
                ;

            CreateMap<ProjectAmendment, DFA_ProjectAmendment>()
                .ForMember(d => d.DFA_ProjectAmendmentId, opts => opts.MapFrom(s => s.AmendmentId))
                .ForMember(
                    d => d.DFA_Project,
                    opt => opt.MapFrom(s => new SingleReferenceKey(Guid.Parse(s.ProjectId), "dfa_project"))
                )
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CreatedDate))
                .ForMember(d => d.DFA_AmendmentReceivedDate, opts => opts.MapFrom(s => s.AmendmentReceivedDate))
                .ForMember(d => d.DFA_AmendmentApprovedDate, opts => opts.MapFrom(s => s.AmendmentApprovedDate))
                .ForMember(d => d.DFA_AmendedProjectDeadlineDate, opts => opts.MapFrom(s => s.AmendedProjectDeadlineDate))
                .ForMember(d => d.DFA_Amended18MonthDeadline, opts => opts.MapFrom(s => s.Amended18MonthDeadline))
                .ForMember(d => d.DFA_AmendmentNumber, opts => opts.MapFrom(s => Convert.ToInt32(s.AmendmentNumber)))
                .ForMember(d => d.DFA_AmendmentReason, opts => opts.MapFrom(s => s.AmendmentReason))
                .ForMember(d => d.DFA_EMCRApprovalComments, opts => opts.MapFrom(s => s.EmcrDecisionComments))
                .ForMember(d => d.DFA_ProjectAmendmentId, opts => opts.MapFrom(s => s.AmendmentId))
                .ForMember(d => d.DFA_EstimatedAdditionalProjectCost, opts => opts.MapFrom(s => Convert.ToDecimal(s.EstimatedAdditionalProjectCost)))
                .ForMember(d => d.DFA_ApprovedAdditionalProjectCost, opts => opts.MapFrom(s => Convert.ToDecimal(s.ApprovedAdditionalProjectCost)))
                .ForMember(d => d.DFA_RequestForProjectDeadlineExtension, opts => opts.MapFrom(s => s.RequestforProjectDeadlineExtention == "Yes" ? true : (s.RequestforProjectDeadlineExtention == "No" ? false : (bool?)null)))
                .ForMember(d => d.DFA_DeadlineExtensionApprovedName, opts => opts.MapFrom(s => s.DeadlineExtensionApproved))
                .ForMember(d => d.DFA_RequestForAdditionalProjectCost, opts => opts.MapFrom(s => s.RequestforAdditionalProjectCost == "Yes" ? true : (s.RequestforAdditionalProjectCost == "No" ? false : (bool?)null)))
                .ForMember(d => d.DFA_AmendmentStagesName, opts => opts.MapFrom(s => s.Stage))
                .ForMember(d => d.DFA_AmendmentSubStagesName, opts => opts.MapFrom(s => s.Status))
                .ForMember(d => d.DFA_AdditionalProjectCostDecisionName, opts => opts.MapFrom(s => s.AdditionalProjectCostDecision))
                .ForMember(d => d.DFA_AmendmentDecisionName, opts => opts.MapFrom(s => s.AmendmentDecision))
                ;
        }
    }
}
