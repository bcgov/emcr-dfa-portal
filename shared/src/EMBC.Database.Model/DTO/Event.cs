namespace EMBC.Database.Contract;

public record EventQuery
{
    public StateCode? StateCode { get; set; }
    public DateTime? BeforeNinetyDeadline { get; set; }
    public bool NotNullEventType { get; set; }
}

public record Event : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(4000)]
    public string? Description { get; set; }                // Dynamics Optional dfa_description
    public DateTime? StartDate { get; set; }                // Dynamics Optional dfa_startdate
    public DateTime? EndDate { get; set; }                  // Dynamics Optional dfa_enddate
    public EventType EventType { get; set; }                // Dynamics Business Required dfa_eventtype   
    public DateTime? Deadline { get; set; }                 // Dynamics Optional dfa_90daydeadline
    public DateTime? NinetyDayDeadline { get; set; }        // Dynamics Optional dfa_90daydeadlinenew
    public DateTime? NinetyDayDeadlineOverride { get; set; }// Dynamics Optional dfa_90daydeadlineoverwritedate
}

public enum EventType
{
    [Description("Private")]
    Private = 222710000,

    [Description("Private & Public")]
    PrivatePublic = 222710002,

    [Description("Public")]
    Public = 222710001,
}
