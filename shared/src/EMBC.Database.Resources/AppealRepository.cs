namespace EMBC.Database.Resources;

public interface IAppealRepository : IBaseRepository<Appeal>
{
    IEnumerable<Appeal> GetEligibilityWorkflow(AppealQuery query);
    IEnumerable<Appeal> GetAmountWorkflow(AppealQuery query);
}

public class AppealRepository : BaseRepository<DFA_Appeal, Appeal>, IAppealRepository
{
    private readonly DatabaseContext _databaseContext;

    public AppealRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    // TODO you can consolidate this and the below methods
    public IEnumerable<Appeal> GetEligibilityWorkflow(AppealQuery query)
    {
        var stages = _databaseContext.ProcessStageSet
            .Where(x => x.PrimaryEntityTypeCode == DFA_Appeal.EntityLogicalName)
            .ToList();

        var queryResults = (
            from ca in _databaseContext.DFA_AppealSet
            join ce in _databaseContext.DFA_CaseEligibilityAppealSet on ca.Id equals ce.Bpf_DFA_AppealId.Id
            join ps in _databaseContext.ProcessStageSet on ce.ActiveStageId.Id equals ps.Id
            where ca.DFA_CaseId.Id == query.CaseId && ca.DFA_AppealType == DFA_AppealType.Eligibility && ce.StateCode == DFA_CaseEligibilityAppeal_StateCode.Active
            orderby ca.CreatedOn descending
            select new CaseEligibilityAppealComposite(ca, ce, ps))
            .ToList();

        var results = _mapper.Map<IEnumerable<Appeal>>(queryResults).ToList();

        results.ForEach(
            ca => ca.CaseEligibilityAppeal?.Stages?.ToList().ForEach(
                ce => ce.Name = stages.Single(x => x.Id == ce.Id).StageName));

        return results;
    }

    public IEnumerable<Appeal> GetAmountWorkflow(AppealQuery query)
    {
        var stages = _databaseContext.ProcessStageSet
            .Where(x => x.PrimaryEntityTypeCode == DFA_Appeal.EntityLogicalName)
            .ToList();

        var queryResults = (
            from ca in _databaseContext.DFA_AppealSet
            join ce in _databaseContext.DFA_CasePaidAmountAppealSet on ca.Id equals ce.Bpf_DFA_AppealId.Id
            join ps in _databaseContext.ProcessStageSet on ce.ActiveStageId.Id equals ps.Id
            where ca.DFA_CaseId.Id == query.CaseId && ca.DFA_AppealType == DFA_AppealType.Amount && ce.StateCode == DFA_CasePaidAmountAppeal_StateCode.Active
            orderby ca.CreatedOn descending
            select new CasePaidAmountAppealComposite(ca, ce, ps))
            .ToList();

        var results = _mapper.Map<IEnumerable<Appeal>>(queryResults).ToList();

        results.ForEach(
            ca => ca.CasePaidAmountAppeal?.Stages?.ToList().ForEach(
                ce => ce.Name = stages.Single(x => x.Id == ce.Id).StageName));

        return results;
    }
}

public record CaseEligibilityAppealComposite(DFA_Appeal caseAppeal, DFA_CaseEligibilityAppeal caseEligibilityAppeal, ProcessStage ProcessStage);

public record CasePaidAmountAppealComposite(DFA_Appeal caseAppeal, DFA_CasePaidAmountAppeal casePaidAmountAppeal, ProcessStage ProcessStage);
