namespace Shared.Contract;

public interface IBaseRepository<TDto> where TDto : IDto
{
    Guid Insert(TDto dto);
    Guid Upsert(TDto dto);
    IEnumerable<TDto> Where(Expression<Func<TDto, bool>> predicates);
    bool Update(TDto dto);
    //bool Update(Guid id, params Expression<Func<TDto, object>>[] properties);
    bool TryDelete(Guid id);
    bool TryDelete(TDto dto, bool isRecursive = false);
    bool TryDeleteRange(IEnumerable<TDto> invoices, bool isRecursive = false);
    bool Delete(Guid id);
}
