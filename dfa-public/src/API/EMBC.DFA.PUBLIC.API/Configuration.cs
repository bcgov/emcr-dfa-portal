using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Amazon.S3;
using EMBC.Database;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.ConfigurationModule.Models.PDF.PDFService;
using EMBC.DFA.API.Services;
//using EMBC.DFA.PUBLIC.API.Services.S3;
using EMBC.Gov.BCeID;
using EMBC.Gov.BCeID.Models;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Telemetry;
using EMBC.Database.Resources;
using IdentityModel.AspNetCore.OAuth2Introspection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;
using ITokenProvider = EMBC.DFA.API.Services.ITokenProvider;
using EMBC.DFA.PUBLIC.API.Services;

namespace EMBC.DFA.API
{
    public class Configuration : IConfigureComponentServices, IConfigureComponentPipeline
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });
            // 2024-06-25 EMCRI-217 waynezen: imported from CSRS.Api
            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //.AddJwtBearer(options =>
            //{
            //    options.Authority = configuration["Jwt:Authority"];
            //    options.Audience = configuration["Jwt:Audience"];
            //});

            authJwtSection authJwt = new authJwtSection();
            configuration.GetSection("auth:jwt").Bind(authJwt);

            // 2024-08-14 EMCRI-216 waynezen: add extra diagnostics
            var oidcConfig = configuration.GetSection("auth:oidc");


            var defaultScheme = "Bearer_OR_SSO";

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = defaultScheme;
                options.DefaultChallengeScheme = defaultScheme;
            })
            // JWT for Service Account    
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.MetadataAddress = configuration.GetValue<string>("jwt:metadataAddress");
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    RequireSignedTokens = true,
                    RequireAudience = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(60),
                    NameClaimType = ClaimTypes.Upn,
                    RoleClaimType = ClaimTypes.Role,
                    ValidateActor = true,
                    ValidateIssuerSigningKey = true,
                };

                configuration.GetSection("jwt").Bind(options);


#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                
                options.Validate();

            })
            //JWT token handling - SSO for BCeID login
            .AddJwtBearer("SSO", options =>
             {
                 options.BackchannelHttpHandler = new HttpClientHandler
                 {
                     ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                 };

                 configuration.GetSection("auth:jwt").Bind(options);

                 Debug.WriteLine($"JWT Authentication; Audience: {options.Audience}");

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
                         var logger1 = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         var logger2 = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Configuration>>();
                         var claims = ctx.Principal.Claims;
                         foreach (var claim in claims)
                         {
                             logger2.LogInformation($"JWT token validated. Claim: {claim.Type}: {claim.Value}");
                             Debug.WriteLine($"JWT token validated. Claim: {claim.Type}: {claim.Value}");
                         }
                     },
                     OnAuthenticationFailed = async ctx =>
                     {
                         await Task.CompletedTask;

                         var clientId = oidcConfig["clientId"];
                         var issuer = oidcConfig["issuer"];

                         var logger1 = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         var logger2 = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Configuration>>();
                         logger2.LogError(ctx.Exception, $"JWT authentication failed: clientId={clientId}, issuer={issuer}, jwt:authority={options.Authority}");
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
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<OAuth2IntrospectionEvents>();
                         var userInfo = ctx.Principal?.FindFirst("userInfo");
                         logger.LogDebug("{0}", userInfo);
                     },
                     OnAuthenticationFailed = async ctx =>
                     {
                         await Task.CompletedTask;
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         logger.LogError(ctx?.Result?.Failure, "Introspection authentication failed");
                     }
                 };
             })

             .AddPolicyScheme(defaultScheme, defaultScheme, options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    string? authorization = context.Request.Headers[HeaderNames.Authorization];

                    if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                    {
                        var token = authorization["Bearer ".Length..].Trim();
                        var jwtHandler = new JwtSecurityTokenHandler();

                        if (jwtHandler.CanReadToken(token))
                        {
                            JwtSecurityToken jwtToken = jwtHandler.ReadJwtToken(token);
                            var identityProviderClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "aud");
                            if (identityProviderClaim != null && identityProviderClaim.Value.Equals(configuration.GetValue<string>("SSO:jwt:audience"), StringComparison.InvariantCultureIgnoreCase))
                            {
                                return "SSO";
                            }
                            else
                                return JwtBearerDefaults.AuthenticationScheme;
                        }
                        return JwtBearerDefaults.AuthenticationScheme;
                    }
                    return JwtBearerDefaults.AuthenticationScheme;
                };
                options.Validate();
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                {
                    policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser()
                        .RequireClaim("user_info");
                });
                var ssoPolicyBuilder = new AuthorizationPolicyBuilder("SSO");
                options.AddPolicy("OnlySSO", ssoPolicyBuilder.RequireAuthenticatedUser().Build());
            });
            /*
            services.AddAuthorization(options =>
            {
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                {
                    policy
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("jwt")
                    .RequireClaim("scope", authJwt.scope);
                });

                options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme) ?? null!;
            });
            */
            services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
            {
                options.Path = "/api/openapi/{documentName}/openapi.json";
                options.DocumentName = "DFA Portal API";
                options.PostProcess = (document, req) =>
                {
                    document.Info.Title = "DFA Portal API";
                };
            });

            services.Configure<SwaggerUiSettings>(options =>
            {
                options.Path = "/api/openapi";
                options.DocumentTitle = "DFA Portal API Documentation";
                options.DocumentPath = "/api/openapi/{documentName}/openapi.json";
            });

            services.AddOpenApiDocument(document =>
            {
                document.AddSecurity("bearer token", Array.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "paste token here",
                    In = OpenApiSecurityApiKeyLocation.Header
                });
                document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer token"));

                //document.AddSecurity("oauth2", new OpenApiSecurityScheme
                //{
                //    Type = OpenApiSecuritySchemeType.OAuth2,
                //    Flows = new OpenApiOAuthFlows
                //    {
                //        AuthorizationCode = new OpenApiOAuthFlow
                //        {
                //            AuthorizationUrl = "https://localhost:5000/connect/authorize",
                //            TokenUrl = "https://localhost:5000/connect/token",
                //            Scopes = new Dictionary<string, string> { { "api1", "Demo API - full access" } }
                //        }
                //    }
                //});

                //document.GenerateAbstractProperties = true;
            });

            services.AddTransient<IEvacuationSearchService, EvacuationSearchService>();
            services.AddTransient<IProfileInviteService, ProfileInviteService>();
            services.AddTransient<IConfigurationHandler, Handler>();
            services.AddTransient<IDynamicsGateway, DynamicsGateway>();

            services.Configure<PdfServiceConfigs>(configuration.GetSection("pdfService"));
            services.AddTransient<TokenDelegatingHandler>();
            services.AddHttpClient<PDFServiceHandler>()
                .AddHttpMessageHandler<TokenDelegatingHandler>();
            services.AddTransient<BearerTokenProvider>();

            // 2024-07-02 EMCRI-363 waynezen: added
            services.AddTransient<IUserService, UserService>();

            services.Configure<ADFSTokenProviderOptions>(configuration.GetSection("Dynamics:ADFS"));
            services.AddADFSTokenProvider();

            services.AddHttpClient("captcha");
            services.AddScoped(sp =>
            {
                var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:ADFS:ApiEndpoint");
                var tokenProvider = sp.GetRequiredService<ITokenProvider>();
                return new CRMWebAPI(new CRMWebAPIConfig
                {
                    APIUrl = dynamicsApiEndpoint,
                    GetAccessToken = async (s) => await tokenProvider.AcquireToken()
                });
            });
            services.AddCors(opts => opts.AddDefaultPolicy(policy =>
            {
                // 2024-08-11 EMCRI-216 waynezen; Very important to AllowAnyHeader - otherwise CORS problems
                policy.AllowAnyHeader();

                // 2024-08-20 EMCRI-434 waynezen; Instead of AllowAnyMethod - only allow select Http methods
                //policy.AllowAnyMethod();
                policy.WithMethods("GET", "POST", "PUT");

                //policy.WithOrigins("https://portal.dev.dfa.gov.bc.ca",
                //                "https://dev.dfa.gov.bc.ca");

                //try to get array of origins from section array
                var corsOrigins = configuration.GetSection("cors:origins").GetChildren().Select(c => c.Value).ToArray();
                // try to get array of origins from value
                if (!corsOrigins.Any()) corsOrigins = configuration.GetValue("cors:origins", string.Empty).Split(',');
                corsOrigins = corsOrigins.Where(o => !string.IsNullOrWhiteSpace(o)).ToArray();
                if (corsOrigins.Any())
                {
                    policy.WithOrigins(corsOrigins);
                }
            }));

            // 2024-08-19 EMCRI-434 waynezen; configure BCeID Web Services
            var bceidSection = configuration.GetSection("BCeIDWebServices");
            BCeIDWebSvcOptions bceidWebSvcOptions = new BCeIDWebSvcOptions();
            bceidSection.Bind(bceidWebSvcOptions);

            services.Configure<BCeIDWebSvcOptions>(bceidSection);
            services.AddScoped<IBCeIDBusinessQuery, BCeIDBusinessQuery>();

            // Dataverse
            services.AddServices();
            services.AddAutoMapperMappings();
            services.AddDatabase(configuration);

            //sp => new BCeIDBusinessQuery(options: sp.GetRequiredService<IOptions<BCeIDWebSvcOptions>>())
        }

        public void ConfigurePipeline(PipelineServices services)
        {
            var app = services.Application;
            var env = services.Environment;

            if (!env.IsProduction())
            {
                IdentityModelEventSource.ShowPII = true;
            }
            if (!env.IsProduction())
            {
                app.UseOpenApi();
                app.UseSwaggerUi();
            }
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
        }
    }

    public class authJwtSection
    {
        public string authority { get; set; }
        public string scope { get; set; }
    }
}
