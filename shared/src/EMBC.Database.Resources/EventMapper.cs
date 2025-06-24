public class EventMapper : Profile
{
    public EventMapper()
    {
        CreateMap<DFA_Event, Event>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode?)src.StateCode))
            .ForMember(dest => dest.Deadline, opt => opt.MapFrom(src => src.DFA_DeadlineDate))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.DFA_Description))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.DFA_EndDate))
            .ForMember(dest => dest.EventType, opt => opt.MapFrom(src => src.DFA_EventType))
            .ForMember(dest => dest.NinetyDayDeadline, opt => opt.MapFrom(src => src.DFA_90DayDeadlineNew))
            .ForMember(dest => dest.NinetyDayDeadlineOverride, opt => opt.MapFrom(src => src.DFA_90DayDeadlineOverwriteDate));
    }
}
