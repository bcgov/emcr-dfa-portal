using System;
using System.Collections.Generic;
using System.ComponentModel;

// 2024-07-12 EMCRI-440 waynezen: created
namespace EMBC.DFA.API.ConfigurationModule.Models.AuthModels
{
    /// <summary>
    /// Use reflection to populate this class with values from JWT access_token.
    /// Property names should be exactly the same as the corresponding Principal Claim -
    /// except in the case where a [Description] attribute is used.
    /// </summary>
    public class BceidUserData
    {
        public string sid { get; set; }
        public Guid bceid_business_guid { get; set; }
        public string bceid_business_name { get; set; }
        public Guid bceid_user_guid { get; set; }
        public string bceid_username { get; set; }
        public bool email_verified { get; set; }
        public string name { get; set; }
        public string preferred_username { get; set; }
        public string given_name { get; set; }
        public string display_name { get; set; }
        public string family_name { get; set; }
        [Description("emailaddress: use special logic to get ClaimTypes.Email")]
        public string emailaddress { get; set; }
    }
}
