namespace Shared.Contract;

public static class QueryableExtensions
{
    public static IQueryable<TSource> WhereIf<TSource>(this IQueryable<TSource> source, bool condition, Expression<Func<TSource, bool>> predicate)
    {
        return condition ? source.Where(predicate) : source;
    }

    public static IQueryable<TSource> WhereIfNotIn<TSource, TValue>(this IQueryable<TSource> source, bool condition, Expression<Func<TSource, TValue>> valueSelector, IEnumerable<TValue> values)
    {
        return condition ? source.WhereNotIn(valueSelector, values): source;
    }

    // Filters a sequence for elements with a property matching a predefined list of values (`in` filter)
    public static IQueryable<TSource> WhereIn<TSource, TValue>(this IQueryable<TSource> source, Expression<Func<TSource, TValue>> valueSelector, IEnumerable<TValue> values)
    {
        ArgumentNullException.ThrowIfNull(valueSelector);
        ArgumentNullException.ThrowIfNull(values);

        var element = valueSelector.Parameters.Single();
        var body = values.Select(v => Expression.Equal(valueSelector.Body, Expression.Constant(v))).Aggregate(Expression.OrElse);
        var lambda = Expression.Lambda<Func<TSource, bool>>(body, element);
        return source.Where(lambda);
    }

    // Filters a sequence for elements with a property not matching a predefined list of values (`not in` filter)
    public static IQueryable<TSource> WhereNotIn<TSource, TValue>(this IQueryable<TSource> source, Expression<Func<TSource, TValue>> valueSelector, IEnumerable<TValue> values)
    {
        ArgumentNullException.ThrowIfNull(valueSelector);
        ArgumentNullException.ThrowIfNull(values);

        var element = valueSelector.Parameters.Single();
        var body = values.Select(v => Expression.NotEqual(valueSelector.Body, Expression.Constant(v))).Aggregate(Expression.AndAlso);
        var lambda = Expression.Lambda<Func<TSource, bool>>(body, element);
        return source.Where(lambda);
    }
}