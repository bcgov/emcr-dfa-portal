// Dynamics foreign key reference for a single table
public record SingleReferenceKey(Guid Id, string SchemaName);

// Dynamics foreign keys that reference multiple tables
public record MultipleReferenceKey(Guid Id, string SchemaName);
