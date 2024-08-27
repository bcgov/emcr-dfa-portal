using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Microsoft.Extensions.DependencyInjection;

public static class AuthenticationExtensions
{
    public static void AddJwtBearerAuthentication(this WebApplicationBuilder builder)
    {
        // https://github.com/dotnet/aspnetcore/blob/v6.0.2/src/Security/Authentication/JwtBearer/samples/JwtBearerSample/Startup.cs
        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = builder.Configuration["Jwt:Authority"];
                options.Audience = builder.Configuration["Jwt:Audience"];
            });
    }
}
