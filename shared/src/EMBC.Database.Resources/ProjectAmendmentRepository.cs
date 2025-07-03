
namespace EMBC.Database.Resources
{
    public interface IProjectAmendmentRepository : IQueryRepository<ProjectAmendmentQuery, ProjectAmendment>, IBaseRepository<ProjectAmendment>
    {}

    public class ProjectAmendmentRepository : BaseRepository<DFA_ProjectAmendment, ProjectAmendment>, IProjectAmendmentRepository
    {
        private readonly DatabaseContext _databaseContext;

        public ProjectAmendmentRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
        {
            _databaseContext = databaseContext;
        }

        public Guid InsertAmendment(ProjectAmendment projectAmendment)
        {
            var entity = _mapper.Map<DFA_ProjectAmendment>(projectAmendment);

            _databaseContext.AddObject(entity);
            _databaseContext.SaveChanges();

            return entity.Id;
        }

        public IEnumerable<ProjectAmendment> Query(ProjectAmendmentQuery query)
        {
            var queryResults = _databaseContext.DFA_ProjectAmendmentSet
/*                .WhereIf(query.ProgramId != null, c => c.Vsd_ProgramId.Id == query.ProgramId)
                .WhereIf(query.Origin != null, c => c.Vsd_Origin == (Vsd_Invoice_Vsd_Origin?)query.Origin)
                .WhereIf(query.InvoiceDate != null, c => c.Vsd_InvoicedAte == query.InvoiceDate)*/
                .ToList();

            return _mapper.Map<IEnumerable<ProjectAmendment>>(queryResults);  
        }

    }

}
