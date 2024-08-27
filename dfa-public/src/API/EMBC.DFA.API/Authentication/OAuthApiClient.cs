using Csrs.Api.Configuration;
using System.Net;

namespace EMBC.DFA.API.Authentication
{
    /// <summary>
    /// The OAuthApiClient interact with OAuth endpoing to manage refresh tokens.
    /// </summary>
    public class OAuthApiClient : IOAuthApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly OAuthConfiguration _configuration;
        private readonly ILogger<OAuthApiClient> _logger;

        public OAuthApiClient(HttpClient httpClient, OAuthConfiguration configuration, ILogger<OAuthApiClient> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Token?> GetRefreshToken(CancellationToken cancellationToken)
        {
            Dictionary<string, string> data = new()
            {
                {"resource", _configuration.ResourceUrl ?? string.Empty},
                {"client_id", _configuration.ClientId ?? string.Empty },
                {"client_secret", _configuration.Secret ?? string.Empty },
                {"username", _configuration.Username ?? string.Empty },
                {"password", _configuration.Password ?? string.Empty },
                {"scope", "openid"},
                {"response_mode", "form_post"},
                {"grant_type", "password"}
            };

            var content = new FormUrlEncodedContent(data);

            using var request = new HttpRequestMessage(HttpMethod.Post, _configuration.AuthorizationUrl) { Content = content };
            request.Headers.Add("client-request-id", Guid.NewGuid().ToString());
            request.Headers.Add("return-client-request-id", "true");
            request.Headers.Add("Accept", "application/json");

            HttpResponseMessage? response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                await ProcessTokenErrorAsync(response, cancellationToken);
                return null; // wont get, here ProcessTokenErrorAsync will throw OAuthAuthorizationException
            }

            if (response.Content is not null)
            {
                Token? token = await response.Content.ReadFromJsonAsync<Token>(cancellationToken: cancellationToken);
                if (token is null)
                {
                    _logger.LogWarning("OAuth authentication failed, response did not contained expected token format");
                }
                return token;
            }

            return null; // will this happen?
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <exception cref="OAuthAuthorizationException"></exception>
        private async Task ProcessTokenErrorAsync(HttpResponseMessage response, CancellationToken cancellationToken)
        {
            // common errors:
            //  - 400 client id wrong            : {"error":"invalid_client","error_description":"MSIS9607: The \u0027client_id\u0027 parameter in the request is invalid. No registered client is found with this identifier."}
            //  - 400 client secret wrong        : {"error":"invalid_client","error_description":"MSIS9622: Client authentication failed. Please verify the credential provided for client authentication is valid."}
            //  - 400 username or password wrong : {"error":"invalid_grant","error_description":"MSIS9659: Invalid \u0027username\u0027 or \u0027password\u0027."}
            //  - 400 resource url is wrong      : {"error":"invalid_resource","error_description":"MSIS9602: The received \u0027resource\u0027 parameter is invalid. The authorization server can not find a registered resource with the specified identifier."}
            //  - 404 : empty

            // ensure the http status code is logged on any of the messages below
            using var statusCodeScope = _logger.Add(response.StatusCode);

            if (response.StatusCode is HttpStatusCode.BadRequest)
            {
                var error = await response.Content.ReadFromJsonAsync<OAuthError>(cancellationToken: cancellationToken);
                if (error is null)
                {
                    // this really shouldn't happen, but better than having to deal will null error lower down
                    _logger.LogError("OAuth authentication failed, response did not contained expected error format");
                }
                else
                {
                    string message = error.Code switch
                    {
                        "invalid_client" => "OAuth authentication failed, invalid client credentials",
                        "invalid_grant" => "OAuth authentication failed, invalid username or password",
                        "invalid_resource" => "OAuth authentication failed, invalid resource url",
                        _ => $"OAuth authentication failed, other error code: {error.Code}"
                    };

                    if (error.Description is not null)
                    {
                        using var _ = _logger.BeginScope(new Dictionary<string, object> { { "ErrorMessage", error.Description } });
                        _logger.LogError(message);
                    }
                    else
                    {
                        _logger.LogError(message);
                    }

                    throw new OAuthAuthorizationException(message, response.StatusCode);
                }
            }
            else if (response.StatusCode is HttpStatusCode.NotFound)
            {
                using var _ = _logger.BeginScope(new Dictionary<string, object> { { "AuthorizationUrl", _configuration.AuthorizationUrl ?? string.Empty} });
                _logger.LogError("OAuth authentication failed, error with authorization url");
                throw new OAuthAuthorizationException("OAuth authentication failed, error with authorization url", response.StatusCode);
            }
            else
            {
                // 500?
                _logger.LogError("OAuth authentication failed, other status code");
                throw new OAuthAuthorizationException("OAuth authentication failed, other status code", response.StatusCode);
            }
        }
    }
}
