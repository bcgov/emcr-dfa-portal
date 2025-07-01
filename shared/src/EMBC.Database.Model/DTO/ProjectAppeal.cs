namespace EMBC.Database.Contract;

public record ProjectAppealQuery
{
    public Guid? Id { get; set; }
}

public record ProjectAppeal : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(200)]
    public required string Name { get; set; }            // Dynamics Application Required

    public Guid ProjectId { get; set; }                 // Dynamics Optional

    // Related Entities
    public ProjectEligibilityAppeal? ProjectAppealEligibility { get; set; }
}
