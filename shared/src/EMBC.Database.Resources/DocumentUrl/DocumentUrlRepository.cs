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
    /// Filters by URL pattern since amendment documents are stored with S3 keys containing the amendmentId.
    /// </summary>
    /// <param name="amendmentId">The ID of the amendment.</param>
    /// <returns>A collection of Document URLs related to the specified amendment.</returns>
    public IEnumerable<DocumentUrl> GetByAmendmentId(Guid amendmentId)
    {
        // Amendment documents are stored with S3 keys in the format: dfa_amendment/{projectId}/{amendmentId}/{fileId}
        // Filter by documents where the URL contains the amendmentId pattern
        var amendmentUrlPattern = $"/{amendmentId}/";
        
        return _databaseContext
            .CreateQuery<BcGoV_DocumentUrl>()
            .Where(query => query.BcGoV_Url != null && query.BcGoV_Url.Contains(amendmentUrlPattern))
            .Select(result => _mapper.Map<DocumentUrl>(result))
            .ToList();
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
