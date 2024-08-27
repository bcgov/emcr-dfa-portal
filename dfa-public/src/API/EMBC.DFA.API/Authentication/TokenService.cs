using Microsoft.Extensions.Caching.Memory;

namespace EMBC.DFA.API.Authentication
{
    /// <summary>
    /// The TokenService expose services to get OAuth Tokens. It will fetch from 
    /// memory cache if exists, otherwise, will fetch a new access token and cache it.
    /// </summary>
    public class TokenService : ITokenService
    {
        /// <summary>
        /// Number of seconds before the token expires to expire it from the cache.
        /// We expire it early to avoid the chance we use an expired token.
        /// </summary>
        private const int Buffer = 60;

        private const string token_key = "oauth-token";

        private readonly IOAuthApiClient _oAuthApiClient;
        private readonly IMemoryCache _cache;

        public TokenService(IOAuthApiClient oAuthApiClient, IMemoryCache cache)
        {
            _oAuthApiClient = oAuthApiClient ?? throw new ArgumentNullException(nameof(oAuthApiClient));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        /// <summary>
        /// Gets a token, from the cache or the authority provider.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<Token?> GetTokenAsync(CancellationToken cancellationToken)
        {
            Token? token = _cache.Get<Token>(token_key);
            if (token is null)
            {
                token = await RefreshTokenAsync(cancellationToken);
            }

            return token;
        }

        private async Task<Token?> RefreshTokenAsync(CancellationToken cancellationToken)
        {
            Token? token = await _oAuthApiClient.GetRefreshToken(cancellationToken);
            if (token is not null)
            {
                var options = new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(token.ExpiresIn - Buffer) };
                _cache.Set(token_key, token, options);
            }

            return token;
        }
    }
}
