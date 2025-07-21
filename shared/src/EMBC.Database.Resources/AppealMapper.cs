using Microsoft.Xrm.Sdk;

namespace EMBC.Database.Resources;

public class AppealMapper : Profile
{
    public AppealMapper()
    {
        CreateMap<DFA_Appeal, Appeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DFA_AppealId))
            .ForMember(
                dest => dest.StateCode,
                opt => opt.MapFrom(src => src.StateCode.HasValue ? (StateCode)(int)src.StateCode.Value : default)
            )
            .ForMember(
                dest => dest.CaseId,
                opt => opt.MapFrom(src => src.DFA_CaseId != null ? src.DFA_CaseId.Id : Guid.Empty)
            )
            .ForMember(
                dest => dest.Status,
                opt => opt.MapFrom(src => src.DFA_AppealStatus.HasValue ? src.DFA_AppealStatus.Value.ToString() : null)
            )
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.DFA_Reason))
            .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.DFA_AppealType))
            .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore());

        CreateMap<Appeal, DFA_Appeal>()
            .ForMember(dest => dest.DFA_AppealId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.DFA_CaseId, opt => opt.MapFrom(src => new EntityReference("incident", Guid.Parse(src.CaseId))))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (DFA_Appeal_StateCode)(int)src.StateCode))
            .ForMember(dest => dest.DFA_AppealStatus, opt => opt.Ignore())
            .ForMember(dest => dest.DFA_Reason, opt => opt.MapFrom(src => src.Reason))
            .ForMember(dest => dest.DFA_AppealType, opt => opt.MapFrom(src => src.AppealType));
        //.ForMember(dest => dest.DFA_CreatedOnPortal, opt => opt.MapFrom(src => src.CreatedOnPortal));          
        // .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore());

        CreateMap<DFA_CaseEligibilityAppeal, CaseEligibilityAppeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.StateCode))
            .ForMember(dest => dest.CaseAppealId, opt => opt.MapFrom(src => src.Bpf_DFA_AppealId.Id))
            .AfterMap((src, dest) => dest.Stages = src.TraversedPath?.Split(",").Select(x => new Stage { Id = new Guid(x), Name = string.Empty }).ToArray());

        CreateMap<DFA_CasePaidAmountAppeal, CasePaidAmountAppeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.StateCode))
            .ForMember(dest => dest.CaseAppealId, opt => opt.MapFrom(src => src.Bpf_DFA_AppealId.Id))
            .AfterMap((src, dest) => dest.Stages = src.TraversedPath?.Split(",").Select(x => new Stage { Id = new Guid(x), Name = string.Empty }).ToArray());

        CreateMap<ProcessStage, Stage>()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
          .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.StageName));

        CreateMap<CaseEligibilityAppealComposite, Appeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.caseAppeal.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.caseAppeal.StateCode))
            .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.caseAppeal.DFA_CaseId != null ? src.caseAppeal.DFA_CaseId.Id.ToString() : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.caseAppeal.DFA_AppealStatus.HasValue ? src.caseAppeal.DFA_AppealStatus.Value.ToString() : null))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.caseAppeal.DFA_Reason))
            .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.caseAppeal.DFA_AppealType))
            .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore())
            .ForMember(dest => dest.CaseEligibilityAppeal, opt => opt.MapFrom(src => src.caseEligibilityAppeal))
            .AfterMap((src, dest) => dest.CaseEligibilityAppeal.ActiveStage = new Stage() { Id = src.ProcessStage.Id, Name = src.ProcessStage.StageName });


        CreateMap<CasePaidAmountAppealComposite, Appeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.caseAppeal.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.caseAppeal.StateCode))
            .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.caseAppeal.DFA_CaseId != null ? src.caseAppeal.DFA_CaseId.Id.ToString() : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.caseAppeal.DFA_AppealStatus.HasValue ? src.caseAppeal.DFA_AppealStatus.Value.ToString() : null))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.caseAppeal.DFA_Reason))
            .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.caseAppeal.DFA_AppealType))
            .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore())
            .ForMember(dest => dest.CasePaidAmountAppeal, opt => opt.MapFrom(src => src.casePaidAmountAppeal))
            .AfterMap((src, dest) => dest.CaseEligibilityAppeal.ActiveStage = new Stage() { Id = src.ProcessStage.Id, Name = src.ProcessStage.StageName });

    }
}
