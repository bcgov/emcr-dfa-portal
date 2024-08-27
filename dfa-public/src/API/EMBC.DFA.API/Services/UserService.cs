using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.DFA.API.ConfigurationModule.Models.AuthModels;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Caching;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.DFA.API.Services
{
    // 2024-07-02 EMCRI-440 waynezen: created
    public interface IUserService
    {
        /// <summary>
        /// Gets the BCeID Guid from the current user.
        /// </summary>
        /// <returns>The user's BCeID Guid or <see cref="Guid.Empty"/> if not set.</returns>
        string GetBCeIDUserId();
        string GetBCeIDBusinessId();
        BceidUserData GetJWTokenData();
    }

    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ILogger<UserService> logger;

        public UserService(IHttpContextAccessor httpContextAccessor, ILogger<UserService> logger)
        {
            this.httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public string GetBCeIDBusinessId()
        {
            var principal = GetPrincipal();

            if (principal != null)
            {
                var userid = GetClaim(principal, "bceid_business_guid");

                if (Guid.TryParse(userid, out Guid id))
                {
                    return id.ToString("d"); // format with dashes : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                }
                logger.LogInformation($"Current user's bceid_business_guid cannot be parsed as a valid guid: {userid}");
            }
            return string.Empty;
        }

        public string GetBCeIDUserId()
        {
            var principal = GetPrincipal();

            if (principal != null)
            {
                var userid = GetClaim(principal, "bceid_user_guid");

                if (Guid.TryParse(userid, out Guid id))
                {
                    return id.ToString("d"); // format with dashes : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                }

                logger.LogInformation($"Current user's bceid_user_guid cannot be parsed as a valid guid: {userid}");
            }
            return string.Empty;
        }

        public BceidUserData GetJWTokenData()
        {
            BceidUserData userData = new BceidUserData();
            var principal = GetPrincipal();
            if (principal != null)
            {
                // convert BceidUserData class to an array of properties
                var bindingFlags = BindingFlags.Public | BindingFlags.Instance;
                var userDataProperties = userData.GetType().GetProperties(bindingFlags);
                foreach (var property in userDataProperties)
                {
                    var jwtValue = GetClaim(principal, property);
                    // ensure we have a value from Keycloak for this property
                    // ensure that property isn't readonly
                    // ensure that property isn't private
                    if (jwtValue != null &&
                        property.SetMethod != null &&
                        !property.SetMethod.IsPrivate)
                    {
                        // set the property value
                        Debug.WriteLine($"property: {property.Name}, type: {property.PropertyType.Name}, value: {jwtValue}");

                        switch (property.PropertyType.Name)
                        {
                            case "String":
                                property.SetValue(userData, jwtValue);
                                break;
                            case "Guid":
                                if (Guid.TryParse(jwtValue, out Guid guidVal))
                                {
                                    property.SetValue(userData, guidVal);
                                }
                                break;
                        }
                    }
                }
            }

            return userData;
        }

        private ClaimsPrincipal GetPrincipal()
        {
            ClaimsPrincipal result = null;

            var context = httpContextAccessor.HttpContext;
            if (context is null)
            {
                logger.LogInformation("HttpContext is null. Service may be been called outside of a api request");
                return result;
            }

            result = context.User;
            return result;
        }

        private string GetClaim(ClaimsPrincipal principal, PropertyInfo property)
        {
            string result = null;

            if (principal != null)
            {
                Debug.WriteLine($"GetClaim: checking {property.Name} for DescriptionAttribute");

                // check if property has a [Description] custom attribute
                var descriptionAttributes = property.GetCustomAttributes(typeof(DescriptionAttribute), inherit: false);
                if (descriptionAttributes.Any())
                {
                    var descriptionAttribute = descriptionAttributes[0] as DescriptionAttribute;
                    // get special claim using [Description] type
                    if (descriptionAttribute.Description.Contains("emailaddress"))
                    {
                        var emailAddr = principal.FindFirstValue(ClaimTypes.Email);
                        if (emailAddr != null)
                        {
                            result = emailAddr;
                        }
                    }
                    else
                    {
                        // no [Description] attribute - just get Claim value
                        result = GetClaim(principal, property.Name);
                    }
                }
                else
                {
                    // no [Description] attribute - just get Claim value
                    result = GetClaim(principal, property.Name);
                }
            }

            return result;
        }

        private string GetClaim(ClaimsPrincipal principal, string claimName)
        {
            string result = null;

            if (principal != null)
            {
                Claim? claim = principal.FindFirst(_ => _.Type == claimName);
                if (claim is null)
                {
                    logger.LogInformation($"Current user does not have a {claimName} claim");
                    return result;
                }
                else
                {
                    result = claim.Value;
                }
            }

            return result;
        }
    }
}
