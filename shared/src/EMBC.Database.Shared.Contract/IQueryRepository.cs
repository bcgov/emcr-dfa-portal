namespace Shared.Contract;

public interface IFindRepository<TQuery, TDto>
{
    TDto FirstOrDefault(TQuery query);
}

public interface IQueryRepository<TQuery, TDto>
{
    IEnumerable<TDto> Query(TQuery query);
}
