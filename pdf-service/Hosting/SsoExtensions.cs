using System;
using System.Threading.Tasks;
using IdentityModel.AspNetCore.OAuth2Introspection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace pdfservice;

/* 
 * SSO Pathfinder Knowledge Base
 * https://mvp.developer.gov.bc.ca/docs/default/component/css-docs/
 * 
 * SSO Pathfinder Docs
 * https://bcgov.github.io/sso-docs/
 * 
 * Common Hosted Single Sign-on (CSS)
 * https://bcgov.github.io/sso-requests/
 */

public static class SsoExtensions
{
    public static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication()
            .AddJwtBearer("jwt", options =>
            {
                // WARNING only uncomment for testing purposes
                //options.BackchannelHttpHandler = new HttpClientHandler
                //{
                //    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                //};
                configuration.GetSection("auth:jwt").Bind(options);
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                };
                // if token does not contain a dot, it is a reference token, forward to introspection auth scheme
                options.ForwardDefaultSelector = ctx =>
                {
                    var authHeader = (string)ctx.Request.Headers["Authorization"];
                    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ")) return null;
                    return authHeader.Substring("Bearer ".Length).Trim().Contains('.') ? null : "introspection";
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async ctx =>
                    {
                        await Task.CompletedTask;
                        var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                        var userId = ctx.Principal.FindFirst("preferred_username").Value;
                        //using (logger.PushProperty("Security", "True"))
                        //{
                            logger.LogInformation($"JWT token validated. UserId: {userId}");
                        //}
                    },
                    OnAuthenticationFailed = async ctx =>
                    {
                        await Task.CompletedTask;
                        var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                        //using (logger.PushProperty("Security", "True"))
                        //{
                            logger.LogWarning("JWT authentication failed: {0}", $"jwt:authority={options.Authority}");
                        //}
                    }
                };
            })
         //reference tokens handling
         .AddOAuth2Introspection("introspection", options =>
         {
             options.EnableCaching = true;
             options.CacheDuration = TimeSpan.FromMinutes(20);
             configuration.GetSection("auth:introspection").Bind(options);
             options.Events = new OAuth2IntrospectionEvents
             {
                 OnTokenValidated = async ctx =>
                 {
                     await Task.CompletedTask;
                     var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger>();
                     var userId = ctx.Principal.FindFirst("preferred_username").Value;
                     var test = ctx.HttpContext.User.Identity.IsAuthenticated;
                     //using (logger.PushProperty("Security", "True"))
                     //{
                         logger.LogInformation($"Introspection token validated. UserId: {userId}");
                     //}
                 },
                 OnAuthenticationFailed = async ctx =>
                 {
                     await Task.CompletedTask;
                     var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                     //using (logger.PushProperty("Security", "True"))
                     //{
                         logger.LogWarning("Introspection authentication failed: {0}", $"jwt:authority={options.Authority}");
                     //}
                 }
             };
         });

        return services;
    }

    public static IServiceCollection AddAuthorization(this IServiceCollection services/*, AppSettings appSettings*/)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
            {
                policy
                .RequireAuthenticatedUser()
                .AddAuthenticationSchemes("jwt");
                //.RequireClaim("scope", appSettings.Auth.Jwt.Scope);
            });

            options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme) ?? null!;
        });

        return services;
    }
}
