namespace Model;

public record ServiceLine : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(100)]
    public required string Code { get; set; }   // Dynamics Business Required emcr_code
}
