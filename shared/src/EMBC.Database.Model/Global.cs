namespace Model;

public enum CodingBlockSubmissionStatus
{
    Draft = 222710000,
    EaReview = 222710001,
    Failed = 222710004,
    PendingSubmission = 222710002,
    Submitted = 222710003
}

public enum PayGroup
{
    [Description("GEN CHQ")]
    GenChq = 222710000,

    [Description("GEN EFT")]
    GenEft = 222710001,
}