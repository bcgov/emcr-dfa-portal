namespace Shared.Contract;

public record PayloadCommand<TPayload, TResponse>(TPayload Payload) : IRequest<TResponse>
{
    public TPayload Payload { get; set; } = Payload;
}

public record class IdCommand(Guid Id) : IRequest<Guid>
{
    public Guid Id { get; set; } = Id;
}

public record class IdCommand<TResponse>(Guid Id) : IRequest<TResponse>
{
    public Guid Id { get; set; } = Id;
}