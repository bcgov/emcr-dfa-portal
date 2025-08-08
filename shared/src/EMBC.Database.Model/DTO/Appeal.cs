namespace EMBC.Database.Contract;

public enum PrivateAppealDecision
{
    [Description("Overturned")]
    Overturned = 222710001,

    [Description("Upheld")]
    Upheld = 222710000,
}

public record AppealQuery
{
    public Guid? CaseId { get; set; }
}

public class Appeal : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }
    public required string CaseId { get; set; }
    public required string Status { get; set; }
    public required string Reason { get; set; }
    public required string AppealType { get; set; }
    public string? DateSigned { get; set; }
    public string? SignedName { get; set; }
    public string? Signature { get; set; }
    public SignAndSubmit? SignAndSubmit { get; set; }
    public string? AmountAppealPortalNote { get; set; }
    public string? AmountAppealStatusPortal { get; set; }
    public string? EligibilityAppealPortalNote { get; set; }
    public string? EligibilityAppealStatusPortal { get; set; }
    // public bool? CreatedOnPortal { get; set; }
    public PrivateAppealDecision? AppealDecision { get; set; }
    public Guid? ProcessId { get; set; }

    // Related Entities
    public CaseEligibilityAppeal? CaseEligibilityAppeal { get; set; }
    public CasePaidAmountAppeal? CasePaidAmountAppeal { get; set; }
}

public class SignAndSubmit
{
    public DateTime? NinetyDayDeadline { get; set; }
    public DigitalSignature? ApplicantSignature { get; set; }
    public DigitalSignature? SecondaryApplicantSignature { get; set; }
}

public class DigitalSignature
{
    public string? Signature { get; set; }
    public DateTime DateSigned { get; set; }
    public string? SignedName { get; set; }
}
