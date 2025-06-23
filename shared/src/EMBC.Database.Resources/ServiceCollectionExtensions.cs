using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Database.Resources;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddTransient<IRecoveryClaimRepository, RecoveryClaimRepository>();
        services.AddTransient<IAppealRepository, AppealRepository>();
        return services;
    }

    public static IServiceCollection AddAutoMapperMappings(this IServiceCollection services)
    {
        // NOTE global and shared mapper should be first, since it has the prefix configurations and shared mappings
        var mapperTypes = new[] {
            typeof(SharedMapper), typeof(RecoveryClaimMapper),
        };
        services.AddAutoMapper(cfg => cfg.ShouldUseConstructor = constructor => constructor.IsPublic, mapperTypes);
        return services;
    }
}
