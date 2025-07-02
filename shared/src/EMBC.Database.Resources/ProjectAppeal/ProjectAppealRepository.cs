namespace EMBC.Database.Resources;

public interface IProjectAppealRepository : IQueryRepository<ProjectAppealQuery, ProjectAppeal>, IBaseRepository<ProjectAppeal> { }

public class ProjectAppealRepository : BaseRepository<DFA_ProjectAppeal, ProjectAppeal>, IProjectAppealRepository
{
    private readonly DatabaseContext _databaseContext;

    public ProjectAppealRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    public IEnumerable<ProjectAppeal> Query(ProjectAppealQuery query)
    {
        var stages = _databaseContext.ProcessStageSet
            .Where(x => x.PrimaryEntityTypeCode == DFA_ProjectAppeal.EntityLogicalName)
            .ToList();

        var queryResults = (
            from pa in _databaseContext.DFA_ProjectAppealSet
            join pe in _databaseContext.DFA_ProjectEligibilityAppealSet on pa.Id equals pe.Bpf_DFA_ProjectAppealId.Id
            join ps in _databaseContext.ProcessStageSet on pe.ActiveStageId.Id equals ps.Id
            where pa.DFA_ProjectId.Id == query.Id
            select new ProjectAppealComposite(pa, pe, ps))
            .ToList();

        var results = _mapper
            .Map<IEnumerable<ProjectAppeal>>(queryResults)
            .ToList();

        results.ForEach(
            pa => pa.ProjectAppealEligibility?.Stages?.ToList().ForEach(
                pe => pe.Name = stages.Single(x => x.Id == pe.Id).StageName));

        return results;
    }
}

public record ProjectAppealComposite(DFA_ProjectAppeal ProjectAppeal, DFA_ProjectEligibilityAppeal ProjectEligibilityAppeal, ProcessStage ProcessStage);
