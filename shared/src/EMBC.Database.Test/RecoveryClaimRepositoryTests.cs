public class RecoveryClaimRepositoryTests(IRecoveryClaimRepository repository, IMapper mapper)
{
    // WARNING these are not valid unit tests and depend on data in Dynamics not changing, use for local testing purposes only

    [Fact]
    public void FirstOrDefault()
    {
        var id = new Guid("<guid>");
        var recoveryClaim = repository.FirstOrDefault(x => x.Id == id);

        Assert.NotNull(recoveryClaim);
    }

    [Fact]
    public void Query()
    {
        var query = new RecoveryClaimQuery
        {
            IncludeChildren = true,
            //Id = new Guid("<guid>"),
            CodingBlockSubmissionStatus = CodingBlockSubmissionStatus.PendingSubmission,
            AfterInvoiceDate = new DateTime(2023, 1, 1),
            AfterDateGoodsReceived = new DateTime(2023, 1, 1),
            AfterDateInvoiceReceived = new DateTime(2023, 1, 1)
        };
        var recoveryClaims = repository.Query(query);

        Assert.NotNull(recoveryClaims);
    }

    //[Fact]
    //public void Update_Success()
    //{
    //    var id = new Guid("a33ca996-86cd-ec11-b832-00505683fbf4");

    [Fact]
    public void Update_Id_Success()
    {
        var codingBlockSubmissionStatus = CodingBlockSubmissionStatus.Failed;
        var id = new Guid("<guid>");

        repository.Update(id, x => x.CodingBlockSubmissionStatus == CodingBlockSubmissionStatus.Draft);

        var updatedClaim = repository
            .FirstOrDefault(x => x.Id == id);
        Assert.NotNull(updatedClaim);
        Assert.Equal(codingBlockSubmissionStatus, updatedClaim.CodingBlockSubmissionStatus);
    }

    [Fact]
    public void Update_Dto_Success()
    {
        var recoveryClaim = new RecoveryClaim();
        recoveryClaim.Id = new Guid("<guid>");
        recoveryClaim.CodingBlockSubmissionStatus = CodingBlockSubmissionStatus.Failed;

        repository.Update(recoveryClaim, x => x.CodingBlockSubmissionStatus);

        var updatedClaim = repository
            .FirstOrDefault(x => x.Id == recoveryClaim.Id);
        Assert.NotNull(updatedClaim);
        Assert.Equal(CodingBlockSubmissionStatus.Failed, updatedClaim.CodingBlockSubmissionStatus);
    }

    [Fact]
    public void Update_Dto_Multiple_Success()
    {
        var recoveryClaim = new RecoveryClaim();
        recoveryClaim.Id = new Guid("a33ca996-86cd-ec11-b832-00505683fbf4");
        recoveryClaim.CodingBlockSubmissionStatus = CodingBlockSubmissionStatus.Failed;
        recoveryClaim.PaymentAdviceComments = "TEST";

        repository.Update(recoveryClaim, x => x.CodingBlockSubmissionStatus, x => x.PaymentAdviceComments);

        var updatedClaim = repository
            .FirstOrDefault(x => x.Id == recoveryClaim.Id);
        Assert.NotNull(updatedClaim);
        Assert.Equal(CodingBlockSubmissionStatus.Failed, updatedClaim.CodingBlockSubmissionStatus);
    }

    [Fact]
    public void Where()
    {
        var results = repository.Where(x => x.CodingBlockSubmissionStatus == CodingBlockSubmissionStatus.PendingSubmission);

        Assert.NotEmpty(results);
    }
}
