namespace Shared.Contract;

// Query, Find, and Base Handler
public class FindQueryBaseHandlers<TRepository, TDto, TFindQuery, TQuery> : QueryBaseHandlers<TRepository, TDto, TQuery>
    where TRepository : IFindRepository<TFindQuery, TDto>, IQueryRepository<TQuery, TDto>, IBaseRepository<TDto>
    where TDto : IDto
{
    public FindQueryBaseHandlers(TRepository repository) : base(repository) { }

    public async Task<TDto> Handle(TFindQuery query, CancellationToken cancellationToken)
    {
        var results = _repository.FirstOrDefault(query);
        return await Task.FromResult(results);
    }
}

// Query and Base Handler
public class QueryBaseHandlers<TRepository, TDto, TQuery> : BaseHandlers<TRepository, TDto>
    where TRepository : IQueryRepository<TQuery, TDto>, IBaseRepository<TDto>
    where TDto : IDto
{
    public QueryBaseHandlers(TRepository repository) : base(repository) { }

    public async Task<IEnumerable<TDto>> Handle(TQuery query, CancellationToken cancellationToken)
    {
        var results = _repository.Query(query);
        return await Task.FromResult(results);
    }
}

// Only Base Handler
public class BaseHandlers<TRepository, TDto>
    where TRepository : IBaseRepository<TDto>
    where TDto : IDto
{
    protected readonly TRepository _repository;

    public BaseHandlers(TRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(InsertCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.Insert(command.Payload);
        return await Task.FromResult(results);
    }

    public async Task<Guid> Handle(UpsertCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.Upsert(command.Payload);
        return await Task.FromResult(results);
    }

    public async Task<bool> Handle(UpdateCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.Update(command.Payload);
        return await Task.FromResult(results);
    }

    public async Task<bool> Handle(TryDeleteCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.TryDelete(command.Id);
        return await Task.FromResult(results);
    }

    public async Task<bool> Handle(TryDeleteByDtoCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.TryDelete(command.Payload);
        return await Task.FromResult(results);
    }

    public async Task<bool> Handle(DeleteCommand<TDto> command, CancellationToken cancellationToken)
    {
        var results = _repository.Delete(command.Id);
        return await Task.FromResult(results);
    }
}

public record InsertCommand<TDto>(TDto dto) : PayloadCommand<TDto, Guid>(dto) { }
public record UpsertCommand<TDto>(TDto dto) : PayloadCommand<TDto, Guid>(dto) { }
public record UpdateCommand<TDto>(TDto dto) : PayloadCommand<TDto, bool>(dto) { }

public record TryDeleteByDtoCommand<TDto>(TDto dto) : PayloadCommand<TDto, bool>(dto) { }
public record TryDeleteCommand<TDto>(Guid Id) : IdCommand<bool>(Id) { }
public record DeleteCommand<TDto>(Guid Id) : IdCommand<bool>(Id) { }