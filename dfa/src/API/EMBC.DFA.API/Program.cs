using System;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using EMBC.Utilities.Hosting;

// Set culture to ensure datetime parsing is consistent across different environments.
// Set to "en-US" to align with the format used in the dynamics responses, and hardcoded throughout the api/app.
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("en-US");

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

var appName = Environment.GetEnvironmentVariable("APP_NAME") ?? "EMBC.DFA.API";

var host = new Host(appName);
return await host.Run(assembliesPrefix: "EMBC");
