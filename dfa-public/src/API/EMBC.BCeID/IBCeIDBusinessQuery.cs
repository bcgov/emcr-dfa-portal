using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Gov.BCeID
{
    internal interface IBCeIDBusinessQuery
    {
        Task<BCeIDBusiness> ProcessBusinessQuery(string guid);
    }
}
