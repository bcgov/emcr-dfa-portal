namespace EMBC.Database.Contract;

    public class Appeal : IDto
    {
        public Guid Id { get; set; }
        public StateCode StateCode { get; set; }
        public required string CaseId { get; set; }
        public required string Status { get; set; }
        public required string Reason { get; set; }
        public required string AppealType { get; set; }
        public SignAndSubmit? SignAndSubmit { get; set; }
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
