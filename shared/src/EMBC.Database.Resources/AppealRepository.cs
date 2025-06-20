using System;
using System.Linq.Expressions;

namespace EMBC.Database.Resources;

public interface IAppealRepository
{
    Guid Insert(Appeal appeal);
    Appeal? GetById(Guid id);
}

public class AppealRepository : BaseRepository<DFA_Appeal, Appeal>, IAppealRepository
{
    private readonly DatabaseContext _databaseContext;

    public AppealRepository(DatabaseContext databaseContext, IMapper mapper) : base(databaseContext, mapper)
    {
        _databaseContext = databaseContext;
    }

    public Appeal? GetById(Guid id)
    {
        var entity = _databaseContext.DFA_AppealSet.FirstOrDefault(e => e.DFA_AppealId == id);
        if (entity == null)
        {
            return null;
        }
        return Map(entity);
    }

}