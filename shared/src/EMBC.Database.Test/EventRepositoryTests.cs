public class EventTests(IEventRepository repository, IMapper mapper, IOrganizationServiceAsync service)
{
    // WARNING these are not valid unit tests and depend on data in Dynamics not changing, use for local testing purposes only

    [Fact]
    public void Query()
    {
        var query = new EventQuery
        {
            StateCode = StateCode.Active,
            BeforeNintyDeadline = new DateTime(2023, 1, 1),
            NotNullEventType = true
        };
        var events = repository.Query(query);

        Assert.NotNull(events);
    }

    // NOTE these tests will only run if you add "virtual" keyword to DatabaseContext.DFA_EventSet property
    [Fact]
    public void Query_Deadline_Success()
    {
        var mockContext = new Mock<DatabaseContext>(service);
        mockContext
            .Setup(m => m.DFA_EventSet)
            .Returns(new List<DFA_Event>
            {
                new DFA_Event
                {
                    StateCode = DFA_Event_StateCode.Active,
                    DFA_90DayDeadlineNew = new DateTime(2023, 1, 2),
                    DFA_90DayDeadlineOverwriteDate = null,
                    DFA_EventType = DFA_Event_DFA_EventType.Private
                },
                new DFA_Event
                {
                    StateCode = DFA_Event_StateCode.Active,
                    DFA_90DayDeadlineNew = new DateTime(2023, 1, 3),
                    DFA_90DayDeadlineOverwriteDate = null,
                    DFA_EventType = DFA_Event_DFA_EventType.Private
                }
            }
            .AsQueryable());
        var repository = new EventRepository(mockContext.Object, mapper);

        var query = new EventQuery
        {
            StateCode = StateCode.Active,
            BeforeNintyDeadline = new DateTime(2023, 1, 2),
            NotNullEventType = true
        };
        var events = repository.Query(query);
        Assert.Single(events);
    }

    // NOTE these tests will only run if you add "virtual" keyword to DatabaseContext.DFA_EventSet property
    [Fact]
    public void Query_Deadline_Override_Success()
    {
        var mockContext = new Mock<DatabaseContext>(service);
        mockContext
            .Setup(m => m.DFA_EventSet)
            .Returns(new List<DFA_Event>
            {
                new DFA_Event
                {
                    StateCode = DFA_Event_StateCode.Active,
                    DFA_90DayDeadlineNew = new DateTime(2023, 1, 2),
                    DFA_90DayDeadlineOverwriteDate = null,
                    DFA_EventType = DFA_Event_DFA_EventType.Private
                },
                new DFA_Event
                {
                    StateCode = DFA_Event_StateCode.Active,
                    DFA_90DayDeadlineNew = new DateTime(2023, 1, 3),
                    DFA_90DayDeadlineOverwriteDate = new DateTime(2023, 1, 2),
                    DFA_EventType = DFA_Event_DFA_EventType.Private
                }
            }
            .AsQueryable());
        var repository = new EventRepository(mockContext.Object, mapper);

        var query = new EventQuery
        {
            StateCode = StateCode.Active,
            BeforeNintyDeadline = new DateTime(2023, 1, 3),
            NotNullEventType = true
        };
        var events = repository.Query(query);
        Assert.Equal(2, events.Count());
    }
}
