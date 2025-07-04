
namespace EMBC.Database.Resources
{
    public interface IProjectAmendmentRepository : IQueryRepository<ProjectAmendmentQuery, ProjectAmendment>, IBaseRepository<ProjectAmendment>
    {
        public int GetNextAmendmentNumber(string projectId);
    }

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

        public int GetNextAmendmentNumber(string projectId)
        {
            int maxNumber = 0;
            var result = _databaseContext.DFA_ProjectAmendmentSet.Where(x => x.DFA_Project.Id == new Guid(projectId)).OrderBy(x => x.DFA_AmendmentNumber).ToList().LastOrDefault();

            if (result != null)
            {
                maxNumber = result.DFA_AmendmentNumber != null ? (int)result.DFA_AmendmentNumber : 0;
            }
            maxNumber++;

            return (int)maxNumber;
        }

        public IEnumerable<ProjectAmendment> Query(ProjectAmendmentQuery query)
        {
            var queryResults = _databaseContext.DFA_ProjectAmendmentSet.ToList();

            return _mapper.Map<IEnumerable<ProjectAmendment>>(queryResults);  
        }

    }

}
