public class RecoveryClaimRepositoryTests(IRecoveryClaimRepository repository/*, IRecoveryClaimService recoveryClaimService*/, IMapper mapper)
{
    // WARNING these are not valid unit tests and depend on data in Dynamics not changing, use for local testing purposes only

    [Fact]
    public void Query()
    {
        var query = new RecoveryClaimQuery
        {
            //IncludeChildren = true,
            //Id = new Guid("<guid>"),
            //CodingBlockSubmissionStatus = CodingBlockSubmissionStatus.PendingSubmission,
            //AfterInvoiceDate = new DateTime(2023, 1, 1),
            //AfterDateGoodsReceived = new DateTime(2023, 1, 1),
            //AfterDateInvoiceReceived = new DateTime(2023, 1, 1)
        };
        var recoveryClaims = repository.Query(query);

        // Assert
        Assert.NotNull(recoveryClaims);
    }

    //[Fact]
    //public async Task GetPending_Success()
    //{
    //    var responses = await recoveryClaimService.ProcessClaims();

    //    Assert.NotNull(responses);
    //}

    [Fact]
    public void UpdateCodingBlockSubmissionStatus_Success()
    {
        var id = new Guid("<guid>");
        var codingBlockSubmissionStatus = CodingBlockSubmissionStatus.Failed;

        repository.UpdateCodingBlockSubmissionStatus(id, codingBlockSubmissionStatus);

        var updatedClaim = repository
            .Query(new RecoveryClaimQuery { Id = id })
            .FirstOrDefault();
        Assert.NotNull(updatedClaim);
        Assert.Equal(codingBlockSubmissionStatus, updatedClaim.CodingBlockSubmissionStatus);
    }

    [Fact]
    public void UpdateCodingBlockSubmissionFailure_Success()
    {
        var id = new Guid("<guid>");
        var errorMessage = "An error occurred while processing the request. Our system was unable to successfully perform the request via the API gateway and/or the OpenShift service. Please check the plugins trace logs for more details.";

        repository.UpdateFailure(id, errorMessage);

        var updatedClaim = repository
            .Query(new RecoveryClaimQuery { Id = id })
            .FirstOrDefault();
        Assert.NotNull(updatedClaim);
        Assert.Equal(errorMessage, updatedClaim.LastCodingBlockSubmissionError);
    }
}
