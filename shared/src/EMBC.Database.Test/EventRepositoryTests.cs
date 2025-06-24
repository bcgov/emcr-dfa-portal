
public class EventTests(IEventRepository repository, IMapper mapper)
{
    // WARNING these are not valid unit tests and depend on data in Dynamics not changing, use for local testing purposes only

    [Fact]
    public void Query()
    {
        var query = new EventQuery
        {
            StateCode = StateCode.Active,
            BeforeNintyDeadline = new DateTime(2023, 1, 1),
            BeforeNinetyDayDeadlineOverride = new DateTime(2023, 1, 1),
            NotNullEventType = true
        };
        var events = repository.Query(query);

        Assert.NotNull(events);
    }
}
