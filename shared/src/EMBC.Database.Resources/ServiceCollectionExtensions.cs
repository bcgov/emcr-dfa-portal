using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Database.Resources;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddTransient<IRecoveryClaimRepository, RecoveryClaimRepository>();
        services.AddTransient<IAppealRepository, AppealRepository>();
        services.AddTransient<IProjectAmendmentRepository, ProjectAmendmentRepository>();
        services.AddTransient<IEventRepository, EventRepository>();
        services.AddTransient<IProjectAppealRepository, ProjectAppealRepository>();
        services.AddTransient<IDocumentUrlRepository, DocumentUrlRepository>();
        return services;
    }

    public static IServiceCollection AddAutoMapperMappings(this IServiceCollection services)
    {
        // NOTE global and shared mapper should be first, since it has the prefix configurations and shared mappings
        var mapperTypes = new[]
        {
            typeof(SharedMapper),
            typeof(RecoveryClaimMapper),
            typeof(AppealMapper),
            typeof(ProjectAmendmentMapper),
            typeof(EventMapper),
            typeof(ProjectAppealMapper),
            typeof(DocumentUrlMapper),
        };
        services.AddAutoMapper(cfg => cfg.ShouldUseConstructor = constructor => constructor.IsPublic, mapperTypes);
        return services;
    }
}
