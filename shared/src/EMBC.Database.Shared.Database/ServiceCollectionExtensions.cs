namespace EMBC.Database;

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
            var uri = new Uri(configuration["Dynamics:ADFS:ResourceName"]);
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
        var adfsUrl = _configuration["Dynamics:ADFS:OAuth2TokenEndpoint"] ?? throw new ArgumentNullException("Dynamics:ADFS:OAuth2TokenEndpoint");
        var request = new HttpRequestMessage(HttpMethod.Post, adfsUrl);
        request.Headers.Add("Accept", "application/json");
        var content = new FormUrlEncodedContent(new Dictionary<string, string>() {
            { "grant_type", "password" },
            { "response_mode", "form_post"},
            { "client_id", _configuration["Dynamics:ADFS:ClientId"] ?? throw new ArgumentNullException("Dynamics:ADFS:ClientId") },
            { "client_secret", _configuration["Dynamics:ADFS:ClientSecret"]},
            { "resource", _configuration["Dynamics:ADFS:ResourceName"] },
            { "scope", "openid" },
            { "username", $"{_configuration["Dynamics:ADFS:serviceAccountDomain"]}\\{_configuration["Dynamics:ADFS:serviceAccountName"]}" ?? throw new ArgumentNullException("Dynamics:ADFS:serviceAccountName") },
            { "password", _configuration["Dynamics:ADFS:serviceAccountPassword"] ?? throw new ArgumentNullException("Dynamics:ADFS:serviceAccountPassword") },
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
