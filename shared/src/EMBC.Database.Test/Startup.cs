using EMBC.DFA.API;

public class Startup
{
    /// <summary>
    /// Register dependencies needed for xunit tests
    /// NOTE to register dependencies used by making calls from HttpClient, use CustomWebApplicationFactory
    /// </summary>
    public void ConfigureServices(IServiceCollection services)
    {
        var configuration = new ConfigurationBuilder()
            .AddUserSecrets<Configuration>()
            .AddEnvironmentVariables()
            .Build();

        services.AddServices();
        services.AddAutoMapperMappings();
        services.AddDatabase(configuration);
    }
}
