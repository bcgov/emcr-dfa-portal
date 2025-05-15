using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Unchase.Swashbuckle.AspNetCore.Extensions.Extensions;
using System;
using HealthChecks.UI.Client;
using WkHtmlToPdfDotNet;
using WkHtmlToPdfDotNet.Contracts;
using pdfservice.Utils;

namespace pdfservice
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            if (!Debugger.IsAttached)
                builder.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);
            builder.AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(config =>
            {
                config.EnableEndpointRouting = false;
                var policy = SsoExtensions.GetPolicy();
                config.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddSwaggerGen(c =>
            {            
                c.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["controller"]}_{e.HttpMethod}");
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "JAG LCRB PDF Service", Version = "v1" });
                c.ParameterFilter<AutoRestParameterFilter>();
                // This is only required because Swashbuckle does not present enums correctly
                c.AddEnumsWithValuesFixFilters();
                string baseUri = Configuration["BASE_URI"];
                if (baseUri != null)
                {
                    // ensure baseUri is in the right format.
                    baseUri = baseUri.TrimEnd('/') + @"/";
                    c.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.OAuth2,
                        Flows = new OpenApiOAuthFlows
                        {
                            Implicit = new OpenApiOAuthFlow
                            {
                                AuthorizationUrl = new Uri(baseUri + "api/authentication/redirect/" + Configuration["JWT_TOKEN_KEY"]),
                                Scopes = new Dictionary<string, string>
                                {
                                    {"openid", "oidc standard"}
                                }
                            }
                        }
                    });
                }

                c.OperationFilter<AuthenticationRequirementsOperationFilter>();
            });

            services.AddIdentity<IdentityUser, IdentityRole>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(Configuration);
            services.AddAuthorization();

            // health checks.
            services.AddHealthChecks();


            if (!string.IsNullOrEmpty(Configuration["WKHTMLTOPDF_LOCATION"]))
            {
                string wkhtmltopdfLocation = Configuration["WKHTMLTOPDF_LOCATION"];
                services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            }
            else
            {
                services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            }

            services.AddTransient<IPdfServiceWebUtility, PdfServiceWebUtility>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            var _logger = loggerFactory.CreateLogger(typeof(Startup));
            _logger.LogInformation($"PDF-Service startup");

            if (env.IsDevelopment())
            {
                _logger.LogInformation($"PDF-Service startup: environment is Development; enabling Swagger page");

                app.UseDeveloperExceptionPage();
                app.UseSwagger(c =>
                {
                    c.SerializeAsV2 = true;
                });
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "JAG LCRB PDF Service");
                });
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseMvc();
            
            app.UseHealthChecks("/hc", new HealthCheckOptions
            {
                Predicate = _ => true,
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
        }

        public class AuthenticationRequirementsOperationFilter : IOperationFilter
        {
            public void Apply(OpenApiOperation operation, OperationFilterContext context)
            {
                if (operation.Security == null)
                    operation.Security = new List<OpenApiSecurityRequirement>();


                var scheme = new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearer" } };
                operation.Security.Add(new OpenApiSecurityRequirement
                {
                    [scheme] = new List<string>()
                });
            }
        }
    }
}

