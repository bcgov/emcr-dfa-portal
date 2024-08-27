namespace EMBC.DFA.API.Authentication
{
    public interface ITokenService
    {
        Task<Token?> GetTokenAsync(CancellationToken cancellationToken);
    }
}
