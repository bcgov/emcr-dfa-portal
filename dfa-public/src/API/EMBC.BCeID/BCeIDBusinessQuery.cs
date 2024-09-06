using System;
using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Threading.Tasks;
using EMBC.Gov.BCeID.Models;
using Microsoft.Extensions.Options;
using ServiceReference1;

namespace EMBC.Gov.BCeID
{
    public interface IBCeIDBusinessQuery
    {
        Task<BCeIDBusiness> ProcessBusinessQuery(Guid guid);
        Task<BCeIDBusiness> ProcessBusinessQuery(Guid userGuid, string userId);
    }

    public class BCeIDBusinessQuery : IBCeIDBusinessQuery
    {
        private readonly BCeIDWebSvcOptions webSvcOptions;

        //private static readonly HttpClient client = new HttpClient();

        public BCeIDBusinessQuery(IOptions<BCeIDWebSvcOptions> options)
        {
            webSvcOptions = options.Value ?? throw new ArgumentNullException(nameof(options));
            Debug.WriteLine($"{webSvcOptions.svcEndPoint}");
        }

        public string NormalizeGuid(string guid)
        {
            return guid.ToUpper().Replace("-", "");
        }

        // 2024-09-01 EMCRI-434 waynezen; lookup self information from BCeID web service using user's own Guid
        public async Task<BCeIDBusiness> ProcessBusinessQuery(Guid userGuid)
        {
            if (String.IsNullOrEmpty(webSvcOptions.svcEndPoint))
            {
                return null;
            }

            // create the SOAP client
            var client = CreateSoapClient();

            var n_guid = NormalizeGuid(userGuid.ToString());

            // SOAP request and parameters
            var myparams = new AccountDetailRequest();
            myparams.userGuid = n_guid;
            myparams.accountTypeCode = BCeIDAccountTypeCode.Business;
            myparams.onlineServiceId = webSvcOptions.serviceId;
            myparams.requesterAccountTypeCode = BCeIDAccountTypeCode.Business;
            myparams.requesterUserGuid = n_guid;

            var response = await client.getAccountDetailAsync(myparams);

            if (response.code == ResponseCode.Success)
            {
                return GetEntityFromSoapResponse(response);
            }

            return null;
        }

        // 2024-09-01 EMCRI-434 waynezen; lookup another user from BCeID web service using user Id
        public async Task<BCeIDBusiness> ProcessBusinessQuery(Guid userGuid, string userId)
        {
            if (String.IsNullOrEmpty(webSvcOptions.svcEndPoint))
            {
                return null;
            }

            // create the SOAP client
            var client = CreateSoapClient();

            var n_guid = NormalizeGuid(userGuid.ToString());

            // SOAP request and parameters
            var myparams = new AccountDetailRequest();
            myparams.userId = userId;
            myparams.accountTypeCode = BCeIDAccountTypeCode.Business;
            myparams.onlineServiceId = webSvcOptions.serviceId;
            myparams.requesterAccountTypeCode = BCeIDAccountTypeCode.Business;
            myparams.requesterUserGuid = n_guid;


            var response = await client.getAccountDetailAsync(myparams);

            if (response.code == ResponseCode.Success)
            {
                return GetEntityFromSoapResponse(response);
            }

            return null;
        }

        private static BCeIDBusiness GetEntityFromSoapResponse(AccountDetailResponse response)
        {
            var business = new BCeIDBusiness();
            BCeIDAccount account = response.account;

            business.contactEmail = account.contact.email.value;
            business.contactPhone = account.contact.telephone.value;

            business.individualFirstname = account.individualIdentity.name.firstname.value;
            business.individualMiddlename = account.individualIdentity.name.middleName.value;
            business.individualOtherMiddlename = account.individualIdentity.name.otherMiddleName.value;
            business.individualSurname = account.individualIdentity.name.surname.value;

            business.businessTypeName = account.business.type.name;
            business.businessTypeDescription = account.business.type.description;
            business.businessTypeCode = account.business.type.code.ToString();
            business.businessTypeOther = account.business.businessTypeOther.value;
            business.legalName = account.business.legalName.value;
            business.businessNumber = account.business.businessNumber.value;
            business.incorporationNumber = account.business.incorporationNumber.value;
            business.jurisdictionOfIncorporation = account.business.jurisdictionOfIncorporation.value;
            business.addressLine1 = account.business.address.addressLine1.value;
            business.addressLine2 = account.business.address.addressLine2.value;
            business.addressCity = account.business.address.city.value;
            business.addressProv = account.business.address.province.value;
            business.addressPostal = account.business.address.postal.value;
            business.addressCountry = account.business.address.country.value;
            business.userId = account.userId.value;

            return business;
        }

        private BCeIDServiceSoapClient CreateSoapClient()
        {
            BasicHttpsBinding binding = new BasicHttpsBinding { MaxReceivedMessageSize = int.MaxValue };
            binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.Basic;
            binding.CloseTimeout = new TimeSpan(0, 10, 0);
            EndpointAddress address = new EndpointAddress(webSvcOptions.svcEndPoint);
            var client = new BCeIDServiceSoapClient(binding, address);

            client.ClientCredentials.UserName.UserName = webSvcOptions.serviceAccountName;
            client.ClientCredentials.UserName.Password = webSvcOptions.serviceAccountPassword;

            return client;
        }
    }
}
