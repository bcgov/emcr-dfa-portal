namespace Shared.Contract;

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

    public static async Task ThrowIfNotSuccessful(this Task<HttpStatusCode> statusCode)
    {
        if (await statusCode != HttpStatusCode.OK)
            throw new HttpRequestException($"Request failed with status code: {statusCode}");
    }

    public static string ThrowIfNotMinLength(this string str, int length)
    {
        if (string.IsNullOrEmpty(str) || str.Length < length)
            throw new ArgumentException($"String length must be at least {length} characters.");
        return str;
    }
}
