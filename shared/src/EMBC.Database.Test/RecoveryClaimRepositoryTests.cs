public class RecoveryClaimRepositoryTests(IRecoveryClaimRepository repository, IMapper mapper)
{
    // WARNING these are not valid unit tests and depend on data in Dynamics not changing, use for local testing purposes only

    [Fact]
    public void Query()
    {
        var query = new RecoveryClaimQuery
        {
            //IncludeChildren = true,
            //Id = new Guid("<guid>"),
            CodingBlockSubmissionStatus = CodingBlockSubmissionStatus.PendingSubmission,
            AfterInvoiceDate = new DateTime(2023, 1, 1),
            AfterDateGoodsReceived = new DateTime(2023, 1, 1),
            AfterDateInvoiceReceived = new DateTime(2023, 1, 1)
        };
        var recoveryClaims = repository.Query(query);

        // Assert
        Assert.NotNull(recoveryClaims);
    }

    //[Fact]
    //public void Update_Success()
    //{
    //    var id = new Guid("a33ca996-86cd-ec11-b832-00505683fbf4");

    //    repository.Update(id, x => x.CodingBlockSubmissionStatus == CodingBlockSubmissionStatus.Failed);

    //    var updatedClaim = repository
    //        .Query(new RecoveryClaimQuery { Id = id })
    //        .FirstOrDefault();
    //    Assert.NotNull(updatedClaim);
    //    Assert.Equal(CodingBlockSubmissionStatus.Failed, updatedClaim.CodingBlockSubmissionStatus);
    //}

    [Fact]
    public void Where()
    {
        var results = repository.Where(x => x.CodingBlockSubmissionStatus == CodingBlockSubmissionStatus.PendingSubmission);

        Assert.NotEmpty(results);
    }
}
