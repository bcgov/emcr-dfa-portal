namespace EMBC.Database.Contract;

public record CaseEligibilityAppeal : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    public Guid? CaseAppealId { get; set; }       // Dynamics Optional
    public Stage[]? Stages { get; set; }            // Dynamics Optional

    // Related Entities
    public Stage? ActiveStage { get; set; }         // Dynamics Optional
}