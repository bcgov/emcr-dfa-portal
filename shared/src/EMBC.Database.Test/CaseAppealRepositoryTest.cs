public class CaseAppealRepositoryTest(IAppealRepository repository)
{
    [Fact]
    public void Query()
    {
        var query = new AppealQuery();
        query.CaseId = new Guid("<GUID>"); // Replace with a valid Guid for testing
        var results = repository.GetEligibilityWorkflow(query);
    }
}
