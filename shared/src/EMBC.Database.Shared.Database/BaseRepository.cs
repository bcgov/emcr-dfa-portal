namespace EMBC.Database.Shared.Database;

public abstract class BaseRepository<TEntity, TDto>
    where TEntity : Entity
    where TDto : IDto
{
    // TODO check if this acts like a singleton otherwise check if we can have concurrency issues
    private readonly OrganizationServiceContext _databaseContext;
    protected readonly IMapper _mapper;

    public BaseRepository(OrganizationServiceContext databaseContext, IMapper mapper)
    {
        _databaseContext = databaseContext;
        _mapper = mapper;
    }

    public virtual Guid Insert(TDto dto)
    {
        var entity = Map(dto);
        _databaseContext.AddObject(entity);
        _databaseContext.SaveChanges();
        return entity.Id;
    }

    public TDto FirstOrDefault(Expression<Func<TDto, bool>> predicates)
    {
        var entity = MapExpression(predicates)
            .FirstOrDefault();
        return Map(entity!);
    }

    public IEnumerable<TDto> Where(Expression<Func<TDto, bool>> predicates)
    {
        var entities = MapExpression(predicates)
            .ToList();
        return Map(entities);
    }

    public virtual Guid Upsert(TDto dto)
    {
        var entity = Map(dto);
        var existingEntity = _databaseContext
            .CreateQuery<TEntity>()
            .FirstOrDefault(x => x.Id == entity.Id);
        if (existingEntity != null)
        {
            _databaseContext.Detach(existingEntity);
            _databaseContext.Attach(entity);
            _databaseContext.UpdateObject(entity);
        }
        else
        {
            _databaseContext.AddObject(entity);
        }
        _databaseContext.SaveChanges();
        return entity.Id;
    }

    // NOTE only use field names for the properties argument
    // otherwise the expression parser will throw an exception
    // var dto = new Dto { SomeProperty = 1, OtherProperty = "2" };
    // repository.Update(dto, x => x.SomeProperty, x => x.OtherProperty);
    public virtual bool Update(TDto dto, params Expression<Func<TDto, object>>[] properties)
    {
        (dto?.Id).ThrowIfNullOrEmpty("Id cannot be empty or missing.");

        var entity = _databaseContext
            .CreateQuery<TEntity>()
            .FirstOrDefault(x => x.Id == dto.Id);

        // use this to get the mapped values of the properties
        var mappedEntity = Map(dto);

        // map the expression to entity expression and parse the value from the mapped entity
        // apply each value to the tracked entity
        foreach (var expression in properties)
        {
            var entityExpression = _mapper.MapExpression<Expression<Func<TEntity, object>>>(expression);
            var entityMemberName = ((entityExpression.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            var attributeName = entityMemberName.ToLower();
            var value = mappedEntity.Attributes.Single(x => x.Key == attributeName).Value;
            entity.Attributes[attributeName] = value;
        }

        // only the properties changed on the entity will be updated
        _databaseContext.UpdateObject(entity);

        return !_databaseContext
            .SaveChanges()
            .HasError;
    }

    public virtual bool Update(TDto dto)
    {
        (dto?.Id).ThrowIfNullOrEmpty("Id cannot be empty or missing.");

        var entity = Map(dto);
        return Update(entity);
    }

    public virtual bool Update(TEntity entity)
    {
        (entity?.Id).ThrowIfNullOrEmpty("Id cannot be empty or missing.");

        if (!_databaseContext.IsAttached(entity))
        {
            _databaseContext.Attach(entity);
        }
        _databaseContext.UpdateObject(entity);
        return !_databaseContext
            .SaveChanges()
            .HasError;
    }

    public virtual bool TryDelete(Guid id)
    {
        id.ThrowIfNull("Id cannot be empty.");

        var dto = Activator.CreateInstance<TDto>();
        dto.Id = id;
        return TryDelete(dto);
    }

    public virtual bool TryDelete(TDto dto, bool isRecursive = false)
    {
        (dto?.Id).ThrowIfNullOrEmpty("Id cannot be empty or missing.");

        try
        {
            var entity = Map(dto!);
            if (!_databaseContext.IsAttached(entity))
            {
                _databaseContext.Attach(entity);
            }
            _databaseContext.DeleteObject(entity, isRecursive);
            _databaseContext.SaveChanges();
            _databaseContext.Detach(entity);
            return true;
        }
        catch
        {
            return false;
        }
    }

    // safe delete, use TryDelete for faster deletes
    public virtual bool Delete(Guid id)
    {
        id.ThrowIfNull("Id cannot be empty.");

        var entity = _databaseContext
            .CreateQuery<TEntity>()
            .FirstOrDefault(x => x.Id == id);
        if (entity == null)
        {
            return false;
        }
        _databaseContext.DeleteObject(entity);
        _databaseContext.SaveChanges();
        _databaseContext.Detach(entity);
        return true;
    }

    public virtual bool TryDeleteRange(IEnumerable<TDto> dtos, bool isRecursive = false)
    {
        bool result = true;
        foreach (var dto in dtos)
        {
            if (!TryDelete(dto, isRecursive))
            {
                result = false;
            }
        }
        return result;
    }

    protected TEntity Map(TDto dto)
    {
        return _mapper.Map<TEntity>(dto);
    }

    protected TDto Map(TEntity entity)
    {
        return _mapper.Map<TDto>(entity);
    }

    protected IEnumerable<TDto> Map(IEnumerable<TEntity> entity)
    {
        return _mapper.Map<IEnumerable<TDto>>(entity);
    }

    protected IEnumerable<TEntity> Map(IEnumerable<TDto> dto)
    {
        return _mapper.Map<IEnumerable<TEntity>>(dto);
    }

    protected IQueryable<TEntity> MapExpression(Expression<Func<TDto, bool>> predicates)
    {
        var entityPredicateExpression = _mapper.MapExpression<Expression<Func<TEntity, bool>>>(predicates);
        return _databaseContext
            .CreateQuery<TEntity>()
            .Where(entityPredicateExpression);
    }
}
