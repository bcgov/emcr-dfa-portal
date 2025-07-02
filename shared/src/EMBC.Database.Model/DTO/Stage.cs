namespace EMBC.Database.Contract;

public record Stage
{
    public Guid Id { get; set; }
    public required string Name { get; set; }    // Dynamics System Required
}
