namespace EMBC.Database.Resources;

public interface IEventRepository : IQueryRepository<EventQuery, Event>, IBaseRepository<Event> { }

public class EventRepository : BaseRepository<DFA_Event, Event>, IEventRepository
{
    private readonly DatabaseContext _databaseContext;

    public EventRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    public IEnumerable<Event> Query(EventQuery query)
    {
        var queryResults = _databaseContext.DFA_EventSet
            .Where(query)
            .ToList();
        return Map(queryResults);
    }
}

public static class EventRepositoryExtensions
{
    public static IQueryable<DFA_Event> Where(this IQueryable<DFA_Event> results, EventQuery query)
    {
        return results
            .WhereIf(query.StateCode != null, x => x.StateCode == (DFA_Event_StateCode?)query.StateCode)
            .WhereIf(query.BeforeNinetyDeadline != null, x => (x.DFA_90DayDeadlineOverwriteDate != null && x.DFA_90DayDeadlineOverwriteDate >= query.BeforeNinetyDeadline) || (x.DFA_90DayDeadlineOverwriteDate == null && x.DFA_90DayDeadlineNew != null && x.DFA_90DayDeadlineNew >= query.BeforeNinetyDeadline))
            .WhereIf(query.NotNullEventType, x => x.DFA_EventType != null);
    }
}
