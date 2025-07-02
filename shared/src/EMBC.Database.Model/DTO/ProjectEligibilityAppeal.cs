namespace EMBC.Database.Contract;

public record ProjectEligibilityAppeal : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    public Guid ProjectAppealId { get; set; }       // Dynamics Optional
    public Stage[]? Stages { get; set; }            // Dynamics Optional

    // Related Entities
    public Stage? ActiveStage { get; set; }         // Dynamics Optional
}
