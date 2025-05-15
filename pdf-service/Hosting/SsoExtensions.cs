using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
                configuration.GetSection("auth:jwt").Bind(options);
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
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
            });

        return services;
    }

    public static AuthorizationPolicy GetPolicy() 
    {
        return new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes("jwt")
            .Build();  
    }

    public static IServiceCollection AddAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, GetPolicy());
            options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme);
        });

        return services;
    }
}
