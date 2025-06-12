namespace Model;

public class User : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(200)]
    public string? FullName { get; set; } // Dynamics Optional fullname
}
