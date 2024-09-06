using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceReference1;

namespace EMBC.Gov.BCeID
{
    public class FakeBCeIDQuery : IBCeIDBusinessQuery
    {
        public Task<BCeIDBusiness> ProcessBusinessQuery(string guid)
        {
            BCeIDBusiness bceid = new BCeIDBusiness()
            {
                userId = guid,
                businessNumber = "12345A",
                businessTypeCode = BCeIDBusinessTypeCode.Corporation.ToString(),
                businessTypeDescription = "Deceased musicians",
                incorporationNumber = "54321B",
                jurisdictionOfIncorporation = "Prince George",
                individualFirstname = "Elvis",
                individualSurname = "Presley",
                addressLine1 = "14 Heartbreak hotel st.",
                addressCity = "Prince George",
                addressProv = "BC",
                addressCountry = "Canada",
                addressPostal = "V5B 6X6",
            };

            return Task.FromResult(bceid);
        }

        public Task<BCeIDBusiness> ProcessBusinessQuery(Guid guid)
        {
            throw new NotImplementedException();
        }

        public Task<BCeIDBusiness> ProcessBusinessQuery(Guid userGuid, string userId)
        {
            throw new NotImplementedException();
        }
    }
}
