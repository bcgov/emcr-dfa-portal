using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Events;
using Serilog.Exceptions;

namespace pdfservice.Hosting;

internal static class Logging
{
    public const string LogOutputTemplate = "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3} {SourceContext} {IsSecurityEvent}] {Message:lj}{NewLine}{Exception}";

    public static void ConfigureSerilog(HostBuilderContext hostBuilderContext, IServiceProvider services, LoggerConfiguration loggerConfiguration, string appName)
    {
        loggerConfiguration
            .ReadFrom.Configuration(hostBuilderContext.Configuration)
            .ReadFrom.Services(services)
            .Enrich.WithMachineName()
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("app", appName)
            .Enrich.WithEnvironmentName()
            .Enrich.WithEnvironmentUserName()
            .Enrich.WithCorrelationId()
            .Enrich.WithCorrelationIdHeader()
            //.Enrich.WithClientAgent()
            .Enrich.WithClientIp()
            .Enrich.WithSpan()
            .Enrich.WithProperty("version", Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "Unknown")
            .Enrich.WithProperty("UTC_Timestamp", DateTime.UtcNow.ToString("o"))
            .Enrich.When(logEvent => IsSecurityEvent(logEvent), e => e.WithProperty("IsSecurityEvent", true))
            .WriteTo.Console(outputTemplate: LogOutputTemplate);

        var splunkUrl = hostBuilderContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
        var splunkToken = hostBuilderContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
        if (string.IsNullOrWhiteSpace(splunkToken) || string.IsNullOrWhiteSpace(splunkUrl))
        {
            Log.Warning($"Logs will NOT be forwarded to Splunk: check SPLUNK_TOKEN and SPLUNK_URL env vars");
        }
        else
        {
            loggerConfiguration
                .WriteTo.EventCollector(
                    splunkHost: splunkUrl,
                    eventCollectorToken: splunkToken,
                    messageHandler: new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    },
                    renderTemplate: false);
            Log.Information($"Logs will be forwarded to Splunk");
        }
    }

    /// <summary>
    /// Detects security-relevant events based on HTTP status codes.
    /// Covers authentication, authorization, permission.
    /// </summary>
    private static bool IsSecurityEvent(LogEvent logEvent)
    {
        var securityEventStatusCodes = new HashSet<HttpStatusCode>
            {
                HttpStatusCode.Unauthorized,
                HttpStatusCode.Forbidden,
                HttpStatusCode.TooManyRequests,
                HttpStatusCode.MethodNotAllowed
            };

        if (logEvent.Properties.TryGetValue("StatusCode", out var propertyValue)
            && propertyValue is ScalarValue scalarValue
            && scalarValue.Value is int statusCode
            && securityEventStatusCodes.Contains((HttpStatusCode)statusCode))
        {
            return true;
        }

        return false;
    }
}

