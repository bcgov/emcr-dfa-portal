namespace EMBC.Database.Resources;

public interface IProjectAppealRepository : IBaseRepository<ProjectAppeal> 
{
    // Workflow is synonymous with Dynamics BPF and UI timeline
    ProjectAppealWorkflow GetWorkflow(ProjectAppealQuery query);
}

public class ProjectAppealRepository : BaseRepository<DFA_ProjectAppeal, ProjectAppeal>, IProjectAppealRepository
{
    private readonly DatabaseContext _databaseContext;

    public ProjectAppealRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    public ProjectAppealWorkflow GetWorkflow(ProjectAppealQuery query)
    {
        var stages = _databaseContext.ProcessStageSet
            .Where(x => x.PrimaryEntityTypeCode == DFA_ProjectAppeal.EntityLogicalName)
            .ToList();

        var mappedStages = _mapper.Map<IEnumerable<Stage>>(stages);

        var queryResults = (
            from pa in _databaseContext.DFA_ProjectAppealSet
            join pe in _databaseContext.DFA_ProjectEligibilityAppealSet on pa.Id equals pe.Bpf_DFA_ProjectAppealId.Id
            join ps in _databaseContext.ProcessStageSet on pe.ActiveStageId.Id equals ps.Id
            where pa.DFA_ProjectId.Id == query.ProjectId
            select new ProjectAppealComposite(pa, pe, ps))
            .ToList();

        // map the results from entity to dto
        var results = _mapper
            .Map<IEnumerable<ProjectAppeal>>(queryResults)
            .ToList();

        // map the stage names
        results.ForEach(
            pa => pa.ProjectAppealEligibility?.Stages?.ToList().ForEach(
                pe => pe.Name = stages.Single(x => x.Id == pe.Id).StageName));

        return new ProjectAppealWorkflow(results, mappedStages);
    }
}

public record ProjectAppealComposite(DFA_ProjectAppeal ProjectAppeal, DFA_ProjectEligibilityAppeal ProjectEligibilityAppeal, ProcessStage ProcessStage);
public record ProjectAppealWorkflow(IEnumerable<ProjectAppeal> ProjectAppeals, IEnumerable<Stage> Stages);
