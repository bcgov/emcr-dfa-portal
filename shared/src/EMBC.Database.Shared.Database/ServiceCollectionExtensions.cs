namespace Database;

public static class ServiceCollectionExtensions
{
    static IConfiguration _configuration;

    // TODO pass in configuration binded model instead of IConfiguration
    public static IServiceCollection AddDatabaseService(this IServiceCollection services, IConfiguration configuration)
    {
        _configuration = configuration;
        services.AddSingleton<IOrganizationServiceAsync>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<ServiceClient>>();
            var uri = new Uri(configuration["DYNAMICS_ODATA_URI"]);
            var client = new ServiceClient(uri, TokenProviderAdfs, false, logger);
            if (!client.IsReady) throw new InvalidOperationException($"Failed to connect to Dataverse: {client.LastError}", client.LastException);
            return client;
        });

        return services;
    }

    async static Task<string> TokenProviderAdfs(string instanceUri)
    {
        // TODO add caching

        var http = new HttpClient();
        var adfsUrl = _configuration["ADFS_OAUTH2_URI"] ?? throw new ArgumentNullException("ADFS_OAUTH2_URI");
        var request = new HttpRequestMessage(HttpMethod.Post, adfsUrl);
        request.Headers.Add("Accept", "application/json");
        var content = new FormUrlEncodedContent(new Dictionary<string, string>() {
            { "grant_type", "password" },
            { "response_mode", "form_post"},
            { "client_id", _configuration["DYNAMICS_APP_GROUP_CLIENT_ID"] ?? throw new ArgumentNullException("DYNAMICS_APP_GROUP_CLIENT_ID") },
            { "client_secret", _configuration["DYNAMICS_APP_GROUP_SECRET"]},
            { "resource", _configuration["DYNAMICS_APP_GROUP_RESOURCE"] },
            { "scope", "openid" },
            { "username", _configuration["DYNAMICS_USERNAME"] ?? throw new ArgumentNullException("Username") },
            { "password", _configuration["DYNAMICS_PASSWORD"] ?? throw new ArgumentNullException("Password") },
        });

        var response = await http.PostAsync(adfsUrl, content);

        try
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            // response should be in JSON format.
            var result = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(responseContent);
            if (result?.ContainsKey("access_token") ?? false)
            {
                return result["access_token"].GetString();
            }
            else if (result?.ContainsKey("error") ?? false)
            {
                throw new Exception($"{result["error"].GetString()}: {result["error_description"].GetString()}");
            }
            else
            {
                throw new Exception(responseContent);
            }
        }
        catch (Exception e)
        {
            throw new Exception($"Failed to obtain access token from OAuth2TokenEndpoint: {e.Message}", e);
        }
    }
}
