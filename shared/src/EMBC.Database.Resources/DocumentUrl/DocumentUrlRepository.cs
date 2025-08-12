namespace EMBC.Database.Resources;

public interface IDocumentUrlRepository : IBaseRepository<DocumentUrl>
{
    /// <summary>
    /// Retrieves Document URLs associated with a specific appeal ID.
    /// </summary>
    /// <param name="appealId">The ID of the appeal.</param>
    /// <returns>A collection of Document URLs related to the specified appeal.</returns>
    IEnumerable<DocumentUrl> GetByAppealId(Guid appealId);

    /// <summary>
    /// Retrieves Document URLs associated with a specific case ID.
    /// </summary>
    /// <param name="caseId">The ID of the case.</param>
    /// <returns>A collection of Document URLs related to the specified case.</returns>
    IEnumerable<DocumentUrl> GetByCaseId(Guid caseId);

    /// <summary>
    /// Retrieves Document URLs associated with a specific amendment ID.
    /// </summary>
    /// <param name="amendmentId">The ID of the amendment.</param>
    /// <returns>A collection of Document URLs related to the specified amendment.</returns>
    IEnumerable<DocumentUrl> GetByAmendmentId(Guid amendmentId);

    /// <summary>
    /// Retrieves Document URLs associated with a specific project ID.
    /// </summary>
    /// <param name="projectId">The ID of the project.</param>
    /// <returns>A collection of Document URLs related to the specified project.</returns>
    IEnumerable<DocumentUrl> GetByProjectId(Guid projectId);
}

/// <summary>
/// Repository for managing Document URL records.
/// </summary>
public class DocumentUrlRepository : BaseRepository<BcGoV_DocumentUrl, DocumentUrl>, IDocumentUrlRepository
{
    private readonly DatabaseContext _databaseContext;

    public DocumentUrlRepository(DatabaseContext databaseContext, IMapper mapper)
        : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    /// <summary>
    /// Fetch all Document URLs records associated with a specific appeal ID.
    /// </summary>
    /// <param name="appealId"></param>
    /// <returns></returns>
    public IEnumerable<DocumentUrl> GetByAppealId(Guid appealId)
    {
        return _databaseContext
            .CreateQuery<BcGoV_DocumentUrl>()
            .Where(query => query.DFA_AppealId != null && query.DFA_AppealId.Id == appealId)
            .Select(result => _mapper.Map<DocumentUrl>(result))
            .ToList();
    }

    /// <summary>
    /// Fetch all Document URLs records associated with a specific case ID.
    /// </summary>
    /// <param name="caseId"></param>
    /// <returns></returns>
    public IEnumerable<DocumentUrl> GetByCaseId(Guid caseId)
    {
        return _databaseContext
            .CreateQuery<BcGoV_DocumentUrl>()
            .Where(query => query.BcGoV_CaseId != null && query.BcGoV_CaseId.Id == caseId)
            .Select(result => _mapper.Map<DocumentUrl>(result))
            .ToList();
    }

    /// <summary>
    /// Retrieves Document URLs associated with a specific amendment ID.
    /// Note: Since there's no direct amendment relationship in the database,
    /// this method returns an empty collection for now. Amendment filtering
    /// should be handled at the application level using project documents.
    /// </summary>
    /// <param name="amendmentId">The ID of the amendment.</param>
    /// <returns>A collection of Document URLs related to the specified amendment.</returns>
    public IEnumerable<DocumentUrl> GetByAmendmentId(Guid amendmentId)
    {
        // Since amendments don't have a direct relationship in BcGoV_DocumentUrl,
        // return empty for now. Amendment documents should be handled differently.
        return Enumerable.Empty<DocumentUrl>();
    }

    /// <summary>
    /// Fetch all Document URLs records associated with a specific project ID.
    /// </summary>
    /// <param name="projectId"></param>
    /// <returns></returns>
    public IEnumerable<DocumentUrl> GetByProjectId(Guid projectId)
    {
        return _databaseContext
            .CreateQuery<BcGoV_DocumentUrl>()
            .Where(query => query.DFA_Project != null && query.DFA_Project.Id == projectId)
            .Select(result => _mapper.Map<DocumentUrl>(result))
            .ToList();
    }
}
