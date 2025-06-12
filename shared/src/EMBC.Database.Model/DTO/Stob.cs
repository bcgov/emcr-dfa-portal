namespace Model;

public record Stob : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(100)]
    public string? Code { get; set; }   // Dynamics Optional emcr_code
}
