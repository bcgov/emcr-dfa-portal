using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.ConfigurationModule.Models;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Mappers;
using EMBC.DFA.API.Services;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Org.BouncyCastle.Utilities;

namespace EMBC.DFA.API.Controllers
{
    /// <summary>
    /// Provides configuration data for clients
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ResponseCache(Duration = cacheDuration)]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly ICache cache;
        private readonly IHostEnvironment environment;
        private const int cacheDuration = 60 * 1; //1 minute
        private readonly IConfigurationHandler handler;
        private readonly AutoMapper.MapperConfiguration mapperConfig;

        public ConfigurationController(IConfiguration configuration, IMapper mapper, ICache cache, IHostEnvironment environment, IConfigurationHandler handler)
        {
            this.configuration = configuration;
            this.mapper = mapper;
            this.cache = cache;
            this.environment = environment;
            this.handler = handler;

            mapperConfig = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Mappings));
            });
        }

        /// <summary>
        /// Get configuration settings for clients
        /// </summary>
        /// <returns>Configuration settings object</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<Configuration>> GetConfiguration()
        {
            //var outageInfo = await cache.GetOrSet(
            //    "outageinfo",
            //    async () => (await client.Send(new OutageQuery { PortalType = PortalType.Registrants })).OutageInfo,
            //    TimeSpan.FromSeconds(30));

            var oidcConfig = configuration.GetSection("auth:oidc");
            var config = new Configuration
            {
                Oidc = new OidcOptions
                {
                    ClientId = oidcConfig["clientId"],
                    Issuer = oidcConfig["issuer"],
                    Scope = oidcConfig.GetValue("scope", "openid offline_access dfa-portal-api"),
                    Idp = oidcConfig.GetValue("idp", "bcsc")
                },
                //OutageInfo = mapper.Map<OutageInformation>(outageInfo),
                OutageInfo = null,
                TimeoutInfo = new TimeoutConfiguration
                {
                    SessionTimeoutInMinutes = configuration.GetValue<int>("timeout:minutes", 20),
                    WarningMessageDuration = configuration.GetValue<int>("timeout:warningDuration", 1)
                },
                Captcha = new CaptchaConfiguration
                {
                    Key = configuration.GetValue<string>("captcha:key")
                }
            };

            return Ok(await Task.FromResult(config));
        }

        /// <summary>
        /// Get code values and descriptions for lookups and enum types
        /// </summary>
        /// <param name="forEnumType">enum type name</param>
        /// <returns>list of codes and their respective descriptions</returns>
        [HttpGet("codes")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Code>> GetCodes(string forEnumType)
        {
            if (!string.IsNullOrEmpty(forEnumType))
            {
                var type = Assembly.GetExecutingAssembly().ExportedTypes.FirstOrDefault(t => t.Name.Equals(forEnumType, StringComparison.OrdinalIgnoreCase) && t.IsEnum);
                if (type == null) return NotFound(new ProblemDetails { Detail = $"enum '{forEnumType}' not found" });
                var values = EnumDescriptionHelper.GetEnumDescriptions(type);
                return Ok(values.Select(e => new Code { Type = type.Name, Value = e.Value, Description = e.Description }).ToArray());
            }
            return BadRequest(new ProblemDetails { Detail = "empty query parameter" });
        }

        [HttpGet("codes/communities")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public ActionResult<IEnumerable<CommunityCode>> GetCommunities([FromQuery] string? stateProvinceId, [FromQuery] string? countryId, [FromQuery] CommunityType?[] types)
        {
            return BadRequest();
        }

        [HttpGet("codes/stateprovinces")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public ActionResult<IEnumerable<Code>> GetStateProvinces([FromQuery] string? countryId)
        {
            return BadRequest();
        }

        [HttpGet("codes/countries")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Code>>> GetCountries()
        {
            //var items = await cache.GetOrSet(
            //    "countries",
            //    async () => (await client.Send(new CountriesQuery())).Items,
            //    TimeSpan.FromMinutes(15));
            var cntr = await handler.Handle();
            mapper.Map<IEnumerable<Contact>>(cntr);

            return Ok(null);
        }

        [HttpGet("security-questions")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API
        public ActionResult<string[]> GetSecurityQuestions()
        {
            return BadRequest();
        }

        [HttpGet("outage-info")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Obsolete("Messaging API removed")]
        // 2024-06-24 EMCRI-282 waynezen: Function obsolete due to removed Messaging API=
        public ActionResult<OutageInformation> GetOutageInfo()
        {
            return BadRequest();
        }

        /// <summary>
        /// Get the current logged in user's profile
        /// </summary>
        /// <returns>Currently logged in user's profile</returns>
        [HttpGet("areacommunities")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<AreaCommunity>>> GetAreaCommunities()
        {
            var lstCommunities = await handler.HandleGetAreaCommunities();
            return Ok(mapper.Map<IEnumerable<AreaCommunity>>(lstCommunities));
        }
    }

    public class Configuration
    {
        public OidcOptions Oidc { get; set; }
        public OutageInformation OutageInfo { get; set; }
        public TimeoutConfiguration TimeoutInfo { get; set; }
        public CaptchaConfiguration Captcha { get; set; }
    }

    public class OidcOptions
    {
        public string Issuer { get; set; }
        public string Scope { get; set; }
        public string ClientId { get; set; }
        public string Idp { get; set; }
    }

    [KnownType(typeof(CommunityCode))]
    public class Code
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public Code ParentCode { get; set; }
        public bool IsActive { get; set; }
    }

    public class CommunityCode : Code
    {
        public CommunityType CommunityType { get; set; }
        public string DistrictName { get; set; }
    }

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime? OutageStartDate { get; set; }
        public DateTime? OutageEndDate { get; set; }
    }

    public class TimeoutConfiguration
    {
        public int SessionTimeoutInMinutes { get; set; }
        public int WarningMessageDuration { get; set; }
    }

    public class CaptchaConfiguration
    {
        public string Key { get; set; }
    }

    public class AreaCommunity
    {
        public string AreaCommunityId { get; set; }
        public CommunityType CommunityType { get; set; }
        public string Name { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CommunityType
    {
        [Description("Undefined")]
        Undefined,

        [Description("City")]
        City,

        [Description("Town")]
        Town,

        [Description("Village")]
        Village,

        [Description("First Nations Community")]
        FirstNationsCommunity,

        [Description("District Municipality")]
        DistrictMunicipality,

        [Description("Indian Government District")]
        IndianGovernmentDistrict,

        [Description("Indian Reserve")]
        IndianReserve,

        [Description("Urban Community")]
        UrbanCommunity,

        [Description("Resort Municipality")]
        ResortMunicipality,

        [Description("Community")]
        Community,
    }

    public class ConfigurationMapping : AutoMapper.Profile
    {
        public ConfigurationMapping()
        {
            //CreateMap<Country, Code>()
            //    .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(Country)))
            //    .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
            //    .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
            //    .ForMember(d => d.ParentCode, opts => opts.Ignore())
            //    ;

            //CreateMap<StateProvince, Code>()
            //    .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(StateProvince)))
            //    .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
            //    .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
            //    .ForMember(d => d.ParentCode, opts => opts.MapFrom(s => new Code { Value = s.CountryCode, Type = nameof(Country) }))
            //    ;

            //CreateMap<Community, CommunityCode>()
            //    .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(Community)))
            //    .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
            //    .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
            //    .ForMember(d => d.DistrictName, opts => opts.MapFrom(s => s.DistrictName))
            //    .ForMember(d => d.CommunityType, opts => opts.MapFrom(s => s.Type))
            //    .ForMember(d => d.ParentCode, opts => opts.MapFrom(s => new Code { Value = s.StateProvinceCode, Type = nameof(StateProvince), ParentCode = new Code { Value = s.CountryCode, Type = nameof(Country) } }))
            //    ;

            CreateMap<ESS.Shared.Contracts.Metadata.OutageInformation, OutageInformation>()
                ;
        }
    }
}
