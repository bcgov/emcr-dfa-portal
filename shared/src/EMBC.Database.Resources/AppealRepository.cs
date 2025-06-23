using System;
using System.Linq.Expressions;

namespace EMBC.Database.Resources;

public interface IAppealRepository : IBaseRepository<Appeal>
{}

public class AppealRepository : BaseRepository<DFA_Appeal, Appeal>, IAppealRepository
{
    private readonly DatabaseContext _databaseContext;

    public AppealRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

}