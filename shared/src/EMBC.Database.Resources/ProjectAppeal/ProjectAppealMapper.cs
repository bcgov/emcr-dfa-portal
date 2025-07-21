namespace EMBC.Database.Resources;

public class ProjectAppealMapper : Profile
{
    public ProjectAppealMapper()
    {
        CreateMap<ProjectAppealComposite, ProjectAppeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProjectAppeal.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_Name))
            .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ProjectId))
            .ForMember(dest => dest.StatusCode, opt => opt.MapFrom(src => src.ProjectAppeal.StatusCode))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => src.ProjectAppeal.StateCode))
            .ForMember(dest => dest.AssignedToAdjudicator, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AssignedToAdjudicator))
            .ForMember(dest => dest.AssignedToEvaluator, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AssignedToEvaluator))
            .ForMember(dest => dest.AdditionalInfoRequested, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AdditionalInfoRequested))
            .ForMember(dest => dest.CaseMaterialsReviewed, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_CaseMaterialsReviewed))
            .ForMember(dest => dest.RequiresDecisionNote, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_RequiresDecisionNote))
            .ForMember(dest => dest.WaitingOnLegal, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_WaitingOnLegal))
            .ForMember(dest => dest.EligibleProjectScope, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_EligibleProjectsCope))
            .ForMember(dest => dest.BackUpDocuments, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_BackupDocuments))
            .ForMember(dest => dest.PreExistingCondition, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_PreexistingCondition))
            .ForMember(dest => dest.StampAllDocuments, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_StampAllDocs))
            .ForMember(dest => dest.IcrpSpeadSheetComplete, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_IcRPSpreadsheetCompleteAndCorrect))
            .ForMember(dest => dest.GenerateAppealDecisionLetter, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_GenerateAppealDecisionLetter))
            .ForMember(dest => dest.CheckLgOrIgbAppealDecisionLetter, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_CheckAppealDecisionLetter))
            .ForMember(dest => dest.TimelineNoteAdded, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_TimelineNoteAdded))
            .ForMember(dest => dest.SubmittedForDirectorReview, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_SubmittedForDirectorReview))
            .ForMember(dest => dest.InEApprovals, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_INeApprovals))
            .ForMember(dest => dest.AarAdditionalInfoRequest, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AAr_AdditionalInfoRequested))
            .ForMember(dest => dest.AarCheckLgOrIgbAppealDecisionLetter, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AAr_CheckLGiGbAppealDecisionLetter))
            .ForMember(dest => dest.AarRequiresDecisionNote, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AAr_RequiresDecisionNote))
            .ForMember(dest => dest.AarWaitingOnLegal, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AAr_WaitingOnLegal))
            .ForMember(dest => dest.AccAdditionaInfoRequested, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_AdditionalInfoRequested))
            .ForMember(dest => dest.AccBackupDocuments, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_BackupDocuments))
            .ForMember(dest => dest.AccIcrpSpreadsheetComplete, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_IcRPSpreadsheetCompleteAndCorrect))
            .ForMember(dest => dest.AccCheckLgOrIgbAppealDecisionLetter, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_CheckLGiGbAppealDecisionLetter))
            .ForMember(dest => dest.AccEligibleProjectScope, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AcC_EligibleProjectsCope))
            .ForMember(dest => dest.AccPreExistingCondition, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_PreexistingCondition))
            .ForMember(dest => dest.AccTimelineNoteAdded, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_RAFtTimelineNoteAdded))
            .ForMember(dest => dest.AccStampAllDocuments, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ACc_StampAllDocs))
            .ForMember(dest => dest.ApAdditionalInfoRequest, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_Ap_AdditionalInfoRequested))
            .ForMember(dest => dest.ApRequiresDecisionNote, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_Ap_RequiresDecisionNote))
            .ForMember(dest => dest.ApWaitingOnLegal, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_Ap_WaitingOnLegal))
            .ForMember(dest => dest.AppealDecision, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AppealDecision))
            .ForMember(dest => dest.AppealDecisionCommentsAdded, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_AppealDecisionCommentsAdded))
            .ForMember(dest => dest.ReviewAppealDecisionLetter, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ReviewAppealDecisionLetter))
            .ForMember(dest => dest.UpdateProjectDecision, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_UpdateProjectDecision))
            .ForMember(dest => dest.UpdateProjectApprovedCosts, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_UpdateProjectApprovedCosts))
            .ForMember(dest => dest.ProjectAppealEligibility, opt => opt.MapFrom(src => src.ProjectEligibilityAppeal))
            .AfterMap((src, dest) => dest.ProjectAppealEligibility.ActiveStage = new Stage() { Id = src.ProcessStage.Id, Name = src.ProcessStage.StageName });

        CreateMap<DFA_ProjectEligibilityAppeal, ProjectEligibilityAppeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => src.StateCode))
            .ForMember(dest => dest.ProjectAppealId, opt => opt.MapFrom(src => src.Bpf_DFA_ProjectAppealId.Id))
            .ForMember(dest => dest.CompletedOn, opt => opt.MapFrom(src => src.CompletedOn))
            .AfterMap((src, dest) => dest.Stages = src.TraversedPath?.Split(",").Select(x => new Stage { Id = new Guid(x), Name = string.Empty }).ToArray());

        CreateMap<ProcessStage, Stage>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.StageName));
    }
}
