public class ProjectAppealRepositoryTests(IProjectAppealRepository repository)
{
    [Fact]
    public void Query()
    {
        var query = new ProjectAppealQuery();
        query.Id = new Guid("<guid>");
        var results = repository.Query(query);
    }
}
