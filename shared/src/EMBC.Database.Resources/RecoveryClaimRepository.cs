namespace Resources;

public interface IRecoveryClaimRepository : IQueryRepository<RecoveryClaimQuery, RecoveryClaim>, IBaseRepository<RecoveryClaim>
{
    IEnumerable<RecoveryClaim> GetPending();
    bool UpdateCodingBlockSubmissionStatus(Guid id, CodingBlockSubmissionStatus submitted);
    bool UpdateFailure(Guid id, string errorMessage);
}

public class RecoveryClaimRepository : BaseRepository<DFA_ProjectClaim, RecoveryClaim>, IRecoveryClaimRepository
{
    private readonly DatabaseContext _databaseContext;

    public RecoveryClaimRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    // TODO using Query would be ideal but there are limitations with the LINQ where method that need to be overcome
    public IEnumerable<RecoveryClaim> GetPending()
    {
        var queryResults = (
            from pc in _databaseContext.DFA_ProjectClaimSet
            join su in _databaseContext.SystemUserSet on pc.DFA_QualifiedReceiver.Id equals su.Id
            join cc in _databaseContext.DFA_ClientCodeSet on pc.DFA_ClientCodeId.Id equals cc.Id
            join ep in _databaseContext.EMCR_ExpenseProjectSet on pc.DFA_ProjectNumber.Id equals ep.Id
            join s  in _databaseContext.EMCR_StobSet on pc.DFA_Stob.Id equals s.Id
            join rc in _databaseContext.EMCR_ResponsibilityCentreSet on pc.DFA_Resp.Id equals rc.Id
            join sl in _databaseContext.EMCR_ServiceLineSet on pc.DFA_ServiceLine.Id equals sl.Id
            where pc.DFA_CodingBlockSubmissionStatus == DFA_CodingBlockSubmissionStatus.PendingSubmission || pc.DFA_CodingBlockSubmissionStatus == DFA_CodingBlockSubmissionStatus.Failed
            select new { ProjectClaim = pc, QualifiedReceiver = su, ClientCode = cc, ExpenseProject = ep, Stob = s, ResponsibilityCentre = rc, ServiceLine = sl })
                .ToList()
                .Select(x => new ProjectClaimEntity(x.ProjectClaim, x.QualifiedReceiver, x.ClientCode, x.ExpenseProject, x.Stob, x.ResponsibilityCentre, x.ServiceLine));

        // TODO this is not as performant as it could be, we are filtering the results AFTER the database call
        // it is likely possible to add the commented out clauses below to the above query but it requires reading the documentation and working around the limitations of LINQ support
            //where pc.DFA_InvoiceDate.HasValue && pc.DFA_InvoiceDate.Value.AddDays(10) > DateTime.UtcNow
            //where pc.DFA_ClaimReceivedDate.HasValue && pc.DFA_ClaimReceivedDate.Value.AddDays(10) > DateTime.UtcNow
            //where pc.DFA_DateGoodsAndServicesReceived.HasValue && pc.DFA_DateGoodsAndServicesReceived.Value.AddDays(10) > DateTime.UtcNow

        queryResults = queryResults
            .Where(x => 
                (x.ProjectClaim.DFA_InvoiceDate.HasValue && x.ProjectClaim.DFA_InvoiceDate.Value.AddDays(10) > DateTime.UtcNow)
                || (x.ProjectClaim.DFA_ClaimReceivedDate.HasValue && x.ProjectClaim.DFA_ClaimReceivedDate.Value.AddDays(10) > DateTime.UtcNow)
                || (x.ProjectClaim.DFA_DateGoodsAndServicesReceived.HasValue && x.ProjectClaim.DFA_DateGoodsAndServicesReceived.Value.AddDays(10) > DateTime.UtcNow));

        return _mapper.Map<IEnumerable<RecoveryClaim>>(queryResults);
    }

    // TODO this should be generic and performance could be improved
    public bool UpdateCodingBlockSubmissionStatus(Guid id, CodingBlockSubmissionStatus codingBlockSubmissionStatus)
    {
        var projectClaim = _databaseContext.DFA_ProjectClaimSet.FirstOrDefault(x => x.Id == id);
        if (projectClaim == null)
            return false;

            projectClaim.DFA_CodingBlockSubmissionStatus = (DFA_CodingBlockSubmissionStatus)codingBlockSubmissionStatus;
        _databaseContext.UpdateObject(projectClaim);

        return _databaseContext
            .SaveChanges()
            .HasError;   
    }

    // TODO this should be generic and performance could be improved
    public bool UpdateFailure(Guid id, string errorMessage)
    {
        var projectClaim = _databaseContext.DFA_ProjectClaimSet.FirstOrDefault(x => x.Id == id);
        if (projectClaim == null)
            return false;

        projectClaim.DFA_CodingBlockSubmissionStatus = DFA_CodingBlockSubmissionStatus.Failed;
        projectClaim.DFA_LastCodingBlockSubmissionError = errorMessage.Truncate(4000);
        _databaseContext.UpdateObject(projectClaim);

        return _databaseContext
            .SaveChanges()
            .HasError;
    }

    // TODO could not fully implement with "IncludeChildren", more research required
    public IEnumerable<RecoveryClaim> Query(RecoveryClaimQuery query)
    {
        //if (query.IncludeChildren)
        //{
        //    //var queryResults = _databaseContext.DFA_ProjectClaimSet
        //    //    .Join(_databaseContext.SystemUserSet, pc => pc.DFA_QualifiedReceiver.Id, su => su.Id, (pc, su) => new { ProjectClaim = pc, QualifiedReceiver = su })
        //    //    .WhereIf(query.Id != null, x => x.ProjectClaim.Id == query.Id.Value)
        //    //    .WhereIf(query.CodingBlockSubmissionStatus != null, x => x.ProjectClaim.DFA_CodingBlockSubmissionStatus == (DFA_CodingBlockSubmissionStatus?)query.CodingBlockSubmissionStatus)
        //    //    .WhereIf(query.AfterInvoiceDate != null, x => x.ProjectClaim.DFA_InvoiceDate >= query.AfterInvoiceDate)
        //    //    .WhereIf(query.AfterDateGoodsReceived != null, x => x.ProjectClaim.DFA_DateGoodsAndServicesReceived >= query.AfterDateGoodsReceived)
        //    //    .WhereIf(query.AfterDateInvoiceReceived != null, x => x.ProjectClaim.DFA_ClaimReceivedDate >= query.AfterDateInvoiceReceived);

        //    var queryResults = (
        //        from pc in _databaseContext.DFA_ProjectClaimSet
        //        join su in _databaseContext.SystemUserSet on pc.DFA_QualifiedReceiver.Id equals su.Id
        //        join cc in _databaseContext.DFA_ClientCodeSet on pc.DFA_ClientCodeId.Id equals cc.Id
        //        where pc.DFA_CodingBlockSubmissionStatus == (DFA_CodingBlockSubmissionStatus?)query.CodingBlockSubmissionStatus
        //        select new { ProjectClaim = pc, QualifiedReceiver = su, ClientCode = cc, ExpenseProject = ep })
        //            .ToList()
        //            .Select(x => new ProjectClaimEntity(x.ProjectClaim, x.QualifiedReceiver, x.ClientCode, x.ExpenseProject));

        //    return _mapper.Map<IEnumerable<RecoveryClaim>>(queryResults);
        //}
        //else
        //{
            var queryResults = _databaseContext.DFA_ProjectClaimSet
                .Where(query)
                .ToList();
            return _mapper.Map<IEnumerable<RecoveryClaim>>(queryResults);
        //}
    }
}

public record ProjectClaimEntity(DFA_ProjectClaim ProjectClaim, SystemUser QualifiedReceiver, DFA_ClientCode ClientCode, EMCR_ExpenseProject ExpenseProject, EMCR_Stob Stob, EMCR_ResponsibilityCentre ResponsibilityCentre, EMCR_ServiceLine ServiceLine);

public static class RecoveryClaimRepositoryExtensions
{
    public static IQueryable<DFA_ProjectClaim> Where(this IQueryable<DFA_ProjectClaim> results, RecoveryClaimQuery query)
    {
        return results
            .WhereIf(query.Id != null, x => x.Id == query.Id)
            .WhereIf(query.CodingBlockSubmissionStatus != null, x => x.DFA_CodingBlockSubmissionStatus == (DFA_CodingBlockSubmissionStatus?)query.CodingBlockSubmissionStatus)
            .WhereIf(query.AfterInvoiceDate != null, x => x.DFA_InvoiceDate >= query.AfterInvoiceDate)
            .WhereIf(query.AfterDateGoodsReceived != null, x => x.DFA_DateGoodsAndServicesReceived >= query.AfterDateGoodsReceived)
            .WhereIf(query.AfterDateInvoiceReceived != null, x => x.DFA_ClaimReceivedDate >= query.AfterDateInvoiceReceived);
    }
}
