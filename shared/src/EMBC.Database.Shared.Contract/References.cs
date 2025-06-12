// TODO rename these

// Dynamics foreign key reference for a single table
public record StaticReference(Guid Id, string SchemaName);

// Dynamics foreign keys that reference multiple tables
public record DynamicReference(Guid Id, string SchemaName);
