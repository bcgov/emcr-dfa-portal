namespace EMBC.DFA.API.Authentication
{
    public interface IOAuthApiClient
    {
        Task<Token?> GetRefreshToken(CancellationToken cancellationToken);
    }
}
