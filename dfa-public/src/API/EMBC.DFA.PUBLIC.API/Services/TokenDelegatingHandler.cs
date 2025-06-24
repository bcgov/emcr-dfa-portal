using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Polly;
using Polly.Retry;

namespace EMBC.DFA.PUBLIC.API.Services;

public class TokenDelegatingHandler(BearerTokenProvider tokenProvider) : DelegatingHandler
{
    private readonly AsyncRetryPolicy<HttpResponseMessage> _policy = Policy
        .HandleResult<HttpResponseMessage>(r => r.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        .RetryAsync((_, _) => tokenProvider.RefreshTokenAsync());

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        => await _policy.ExecuteAsync(async () =>
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await tokenProvider.GetAccessTokenAsync());
            return await base.SendAsync(request, cancellationToken);
        });
}
