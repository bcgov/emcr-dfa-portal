namespace Database;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDatabaseService(configuration);
        services.AddScoped(sp =>
        {
            var client = sp.GetRequiredService<IOrganizationServiceAsync>();
            return new DatabaseContext(client);
        });
        return services;
    }
}
