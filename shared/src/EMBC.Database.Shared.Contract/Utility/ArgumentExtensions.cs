namespace EMBC.Database.Shared.Contract;

public static class ArgumentExtensions
{
    public static T ThrowIfNull<T>(this T obj, string message = null)
    {
        if (obj == null)
        {
            throw new ArgumentNullException(message ?? $"Argument was null.");
        }
        return obj;
    }

    public static string ThrowIfNullOrEmpty(this string str, string message = null)
    {
        if (string.IsNullOrEmpty(str))
        {
            throw new ArgumentNullException(message ?? $"Argument was null or empty.");
        }
        return str;
    }

    public static Guid ThrowIfNullOrEmpty(this Guid id, string message = null)
    {
        if (id == null || id == Guid.Empty)
        {
            throw new ArgumentNullException(message ?? $"Argument was null or empty.");
        }
        return id;
    }

    public static Guid? ThrowIfNullOrEmpty(this Guid? id, string message = null)
    {
        if (id == null || id == Guid.Empty)
        {
            throw new ArgumentNullException(message ?? $"Argument was null or empty.");
        }
        return id;
    }

    public static async Task<HttpStatusCode> ThrowIfNotSuccessful(this Task<HttpStatusCode> statusCodeTask)
    {
        return ThrowIfNotSuccessful(await statusCodeTask);
    }

    public static HttpStatusCode ThrowIfNotSuccessful(this HttpStatusCode statusCode)
    {
        if ((int)statusCode >= 200 && (int)statusCode < 300)
            throw new HttpRequestException($"Request failed with status code: {statusCode}");
        return statusCode;
    }

    public static string ThrowIfNotMinLength(this string str, int length)
    {
        if (string.IsNullOrEmpty(str) || str.Length < length)
            throw new ArgumentException($"String length must be at least {length} characters.");
        return str;
    }
}
