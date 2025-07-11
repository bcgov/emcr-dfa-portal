public class ProjectAppealRepositoryTests(IProjectAppealRepository repository)
{
    [Fact]
    public void Query()
    {
        var query = new ProjectAppealQuery();
        query.ProjectId = new Guid("<guid>");
        var results = repository.GetWorkflow(query);
    }

    [Fact]
    public void Enum_AsDescription()
    {
        var status = ProjectAppealStatusCode.Closed;
        var description = status.GetDescription();
        Assert.Equal("Closed", description);
    }
}
