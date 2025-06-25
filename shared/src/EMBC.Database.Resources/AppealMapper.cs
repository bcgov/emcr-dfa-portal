namespace EMBC.Database.Resources;

public class AppealMapper : Profile
{
    public AppealMapper()
    {
        CreateMap<string, Guid>().ConvertUsing(src =>
            string.IsNullOrEmpty(src) ? Guid.NewGuid() : Guid.Parse(src)
        );

        CreateMap<DFA_Appeal, Appeal>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DFA_AppealId))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.StateCode))
            .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.DFA_CaseId != null ? src.DFA_CaseId.Id.ToString() : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.DFA_AppealStatus.HasValue ? src.DFA_AppealStatus.Value.ToString() : null))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.DFA_Reason))
            .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.DFA_AppealType))
            .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore());

        CreateMap<Appeal, DFA_Appeal>()
            .ForMember(dest => dest.DFA_AppealId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (DFA_Appeal_StateCode)(int)src.StateCode))
            .ForMember(dest => dest.DFA_AppealStatus, opt => opt.Ignore())
            .ForMember(dest => dest.DFA_Reason, opt => opt.MapFrom(src => src.Reason))
            .ForMember(dest => dest.DFA_AppealType, opt => opt.MapFrom(src => src.AppealType));
            // .ForMember(dest => dest.SignAndSubmit, opt => opt.Ignore());

    }
}