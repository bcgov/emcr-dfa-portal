namespace EMBC.Database.Contract;

public class User : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(200)]
    public string? FullName { get; set; } // Dynamics Optional fullname

    // TODO add remaining properties here, match SystemUser entity
}
