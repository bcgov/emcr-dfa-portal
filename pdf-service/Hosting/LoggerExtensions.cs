using System.Collections.Generic;
using System;
using Microsoft.Extensions.Logging;

namespace pdfservice;

public static class LoggerExtensions
{

    public static IDisposable? PushProperty(this ILogger logger, string propertyName, object value)
    {
        return logger.BeginScope(WrapProperty(propertyName, value));
    }

    private static IEnumerable<KeyValuePair<string, object>> WrapProperty(string propertyName, object value)
    {
        yield return new KeyValuePair<string, object>(propertyName, value);
    }
}
