namespace EMBC.Database.Shared.Database;

public class SharedMapper : Profile
{
    public SharedMapper()
    {
        // TODO move to GlobalMapper
        RecognizeDestinationPrefixes(["DFA_", "dfa_", "EMCR_", "emcr_"]);
        RecognizePrefixes(["DFA_", "dfa_", "EMCR_", "emcr"]);


        RecognizeDestinationPostfixes("Id");
        RecognizePostfixes("Id");
        
        CreateMap<Money, decimal>()
            .ConvertUsing(src => src.Value);
        CreateMap<Money, decimal?>()
            .ConvertUsing(src => src != null ? src.Value : null);

        CreateMap<EntityReference, Guid>()
            .ConvertUsing(src => src.Id);
        CreateMap<EntityReference, Guid?>()
            .ConvertUsing(src => src.Id);

        CreateMap<MultipleReferenceKey, EntityReference>()
            .ConvertUsing(src => new EntityReference(src.SchemaName, src.Id));
        CreateMap<MultipleReferenceKey?, EntityReference>()
            .ConvertUsing(src => src != null ? new EntityReference(src.SchemaName, src.Id) : null);
        CreateMap<EntityReference, MultipleReferenceKey>()
            .ConvertUsing(src => new MultipleReferenceKey(src.Id, src.LogicalName));
        CreateMap<SingleReferenceKey, EntityReference>()
            .ConvertUsing(src => new EntityReference(src.SchemaName, src.Id));
        CreateMap<EntityReference, SingleReferenceKey>()
            .ConvertUsing(src => new SingleReferenceKey(src.Id, src.LogicalName));
        CreateMap<SingleReferenceKey?, EntityReference>()
            .ConvertUsing(src => src != null ? new EntityReference(src.SchemaName, src.Id) : null);
        CreateMap<EntityReference, SingleReferenceKey?>()
            .ConvertUsing(src => src != null ? new SingleReferenceKey(src.Id, src.LogicalName) : null);
    }
}
