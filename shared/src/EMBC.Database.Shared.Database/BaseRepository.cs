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
        return Map(entity);
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

    public virtual bool Update(TDto dto, params Expression<Func<TDto, object>>[] properties)
    {
        var entity = _databaseContext
            .CreateQuery<TEntity>()
            .FirstOrDefault(x => x.Id == dto.Id);
        if (dto?.Id == null || dto.Id == Guid.Empty)
        {
            throw new ArgumentException("Id is missing or empty.");
        }

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

    [Obsolete("Use Update(dto, properties) instead.")]
    public virtual bool Update(Guid id, params Expression<Func<TDto, object>>[] properties)
    {
        var entity = _databaseContext
            .CreateQuery<TEntity>()
            .FirstOrDefault(x => x.Id == id);
        if (entity == null)
            return false;

        // parse the value for each expression and set the value to the dto, so that we can map the values back to the entity
        // this will give use mappedEntity, an entity with all of the values mapped
        var dto = _mapper.Map<TDto>(entity);
        foreach (var expression in properties)
        {
            var binaryExpression = (expression.Body as UnaryExpression).Operand as BinaryExpression;
            var propertyName = ((binaryExpression.Left as UnaryExpression).Operand as MemberExpression).Member.Name;
            var operand = (binaryExpression.Right as UnaryExpression).Operand;
            var value = Expression.Lambda(operand).Compile().DynamicInvoke();
            var propertyInfo = dto.GetType().GetProperty(propertyName);
            propertyInfo.SetValue(dto, value);
        }
        var mappedEntity = Map(dto);

        // map the expression to entity expression and parse the value from the mapped entity
        // apply each value to the tracked entity
        foreach (var expression in properties)
        {
            var entityExpression = _mapper.MapExpression<Expression<Func<TEntity, object>>>(expression);
            var binaryExpression = (entityExpression.Body as UnaryExpression).Operand as BinaryExpression;
            var propertyName = ((binaryExpression.Left as UnaryExpression).Operand as MemberExpression).Member.Name;
            var attributeName = propertyName.ToLower();
            var value = mappedEntity.Attributes.Single(x => x.Key == attributeName).Value;
            entity.Attributes[attributeName] = value;
        }

        // only the properties changed on the entity will be updated
        _databaseContext.UpdateObject(entity);

        return !_databaseContext
            .SaveChanges()
            .HasError;
    }
        if (!_databaseContext.IsAttached(entity))
        {
            _databaseContext.Attach(entity);
        }

        foreach (var lambda in properties)
        {
            var entityExpression = _mapper
                .MapExpression<Expression<Func<TEntity, object>>>(lambda)
                .Compile();
            entityExpression.Invoke(entity);
        }

        return !_databaseContext
            .SaveChanges()
            .HasError;
    }

    public virtual bool Update(TDto dto)
    {
        if (dto.Id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty");
        }
        var entity = Map(dto);
        return Update(entity);
    }

    public virtual bool Update(TEntity entity)
    {
        if (entity.Id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty");
        }
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
        var dto = Activator.CreateInstance<TDto>();
        dto.Id = id;
        return TryDelete(dto);
    }

    public virtual bool TryDelete(TDto dto, bool isRecursive = false)
    {
        try
        {
            var entity = Map(dto);
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

    private TEntity Map(TDto dto)
    {
        return _mapper.Map<TEntity>(dto);
    }

    private TDto Map(TEntity dto)
    {
        return _mapper.Map<TDto>(dto);
    }

    private IEnumerable<TDto> Map(IEnumerable<TEntity> dto)
    {
        return _mapper.Map<IEnumerable<TDto>>(dto);
    }

    protected IQueryable<TEntity> MapExpression(Expression<Func<TDto, bool>> predicates)
    {
        var entityPredicateExpression = _mapper.MapExpression<Expression<Func<TEntity, bool>>>(predicates);
        return _databaseContext
            .CreateQuery<TEntity>()
            .Where(entityPredicateExpression);
    }
}
