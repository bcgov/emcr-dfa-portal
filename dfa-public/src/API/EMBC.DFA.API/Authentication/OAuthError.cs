using System.Text.Json.Serialization;

namespace EMBC.DFA.API.Authentication
{
    public class OAuthError
    {
        public string? Code { get; set; }
        [JsonPropertyName("error_description")]
        public string? Description { get; set; }
    }
}
