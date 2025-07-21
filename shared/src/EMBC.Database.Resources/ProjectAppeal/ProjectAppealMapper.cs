namespace EMBC.Database.Resources;

public class ProjectAppealMapper : Profile
{
    public ProjectAppealMapper()
    {
        CreateMap<ProjectAppealComposite, ProjectAppeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProjectAppeal.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_Name))
            .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.ProjectAppeal.DFA_ProjectId))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => src.ProjectAppeal.StateCode))
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
