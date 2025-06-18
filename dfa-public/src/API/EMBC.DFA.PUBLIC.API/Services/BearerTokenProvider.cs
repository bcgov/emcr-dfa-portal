using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using EMBC.Database.Shared.Contract;
using EMBC.DFA.API.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace EMBC.DFA.PUBLIC.API.Services;

public class BearerTokenProvider(HttpClient httpClient, IOptions<PdfServiceConfigs> options, ILogger<BearerTokenProvider> logger)
{
    private string _bearerToken;
    private readonly PdfServiceConfigs options = options.Value;

    public async Task<string> GetAccessTokenAsync()
    {
        if (_bearerToken == null)
            await RefreshTokenAsync();
        return _bearerToken;
    }

    public async Task RefreshTokenAsync()
    {
        options?.ClientId.ThrowIfNullOrEmpty();
        options.ClientSecret.ThrowIfNullOrEmpty();
        options.TokenUrl.ThrowIfNullOrEmpty();

        try
        {
            var base64 = Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(string.Format("{0}:{1}", options.ClientId, options.ClientSecret)));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64);
            var request = new HttpRequestMessage(HttpMethod.Post, options.TokenUrl);
            var formData = new List<KeyValuePair<string, string>>();
            formData.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            request.Content = new FormUrlEncodedContent(formData);
            var response = await httpClient.SendAsync(request);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            if (!response.IsSuccessStatusCode)
            {
                logger.LogError($"Error getting token: {response.StatusCode} - {response.Content}");
                throw new Exception("Unable to refresh token.");
            }
            string responseBody = await response.Content.ReadAsStringAsync();
            var jo = JObject.Parse(responseBody);
            _bearerToken = jo["access_token"].ToString();
        }
        catch (Exception ex)
        {
            logger.LogError($"TokenProvider.RefreshTokenAsync failed: {ex.ToString()}");
            throw;
        }
    }
}
