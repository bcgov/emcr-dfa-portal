using System.Net.Http.Headers;

namespace EMBC.DFA.API.Authentication
{
    /// <summary>
    /// Delegating handler that gets access token and adds the Authorization header to the request.
    /// </summary>
    public class OAuthHandler : DelegatingHandler
    {
        private readonly ITokenService _tokenService;
        private readonly ILogger<OAuthHandler> _logger;

        public OAuthHandler(ITokenService tokenService, ILogger<OAuthHandler> logger)
        {
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            Token? token = await _tokenService.GetTokenAsync(cancellationToken);
            if (token is not null)
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);
            }
            else
            {
                _logger.LogInformation("Token service did not return a token. Access token will not be added to request.");
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
