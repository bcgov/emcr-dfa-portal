using System.Net;

namespace EMBC.DFA.API.Authentication
{
    [Serializable]
    public class OAuthAuthorizationException : Exception
    {
        public OAuthAuthorizationException(string message, HttpStatusCode statusCode)
            : base(message)
        {
            StatusCode = statusCode;
        }

        public HttpStatusCode StatusCode { get; }
    }
}
