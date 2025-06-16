namespace EMBC.Database.Contract;

public record ResponsibilityCentre : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(100)]
    public required string Code { get; set; }   // Dynamics Business Required emcr_code

    // TODO add remaining properties here, match EMCR_ResponsibilityCentre entity
}
