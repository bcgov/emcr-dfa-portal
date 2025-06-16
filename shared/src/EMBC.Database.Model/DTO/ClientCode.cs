namespace EMBC.Database.Contract;

public record ClientCode : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    [MaxLength(100)]
    public string Code { get; set; }   // Dynamics Business Required dfa_code

    // TODO add remaining properties here, match DFA_ClientCode entity
}
