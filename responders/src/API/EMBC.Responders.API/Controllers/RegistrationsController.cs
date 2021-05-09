﻿// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handles registration related operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        /// <summary>
        /// Search evacuation files and profiles matching the search parameters
        /// </summary>
        /// <param name="searchParameters">search parameters to filter the results</param>
        /// <returns>matching files list and registrants list</returns>
        [HttpGet]
        public async Task<SearchResults> Search([FromQuery] SearchParameters searchParameters)
        {
            var address = new Address
            {
                AddressLine1 = "1 line1",
                AddressLine2 = "1 line2",
                City = "1 city",
                PostalCode = "V1V 1V1",
                CommunityCode = "6e69dfaf-9f97-ea11-b813-005056830319",
                CountryCode = "CAN",
                StateProvinceCode = "BC"
            };

            var householdMember = new EvacuationFileHouseholdMember
            {
                FirstName = "first",
                LastName = "last",
                Type = HouseholdMemberType.HouseholdMember,
                IsMatch = false
            };

            var applicant = new EvacuationFileHouseholdMember
            {
                FirstName = "first",
                LastName = "last",
                Type = HouseholdMemberType.MainApplicant,
                IsMatch = true
            };

            var file = new EvacuationFileSearchResult
            {
                Id = "1234",
                TaskId = "t1234",
                CreatedOn = new DateTime(2021, 1, 1),
                Status = EvacuationFileStatus.Active,
                EvacuatedFrom = address,
                IsRestricted = false,
                HouseholdMembers = new[] { applicant, householdMember }
            };

            var registrant = new RegistrantProfileSearchResult
            {
                Id = "12345",
                FirstName = searchParameters.firstName,
                LastName = searchParameters.lastName,
                CreatedOn = new DateTime(2021, 1, 1),
                Status = RegistrantStatus.Verified,
                PrimaryAddress = address,
                EvacuationFiles = new[] { file, file },
                IsRestricted = false
            };

            var registrants = new[] { registrant, registrant };
            var files = new[] { file, file };
            return await Task.FromResult(new SearchResults { Registrants = registrants, Files = files });
        }

        [HttpGet("profile/security")]
        public async Task<ActionResult<IEnumerable<SecurityQuestion>>> GetSecurityQuestions()
        {
            return Ok(await Task.FromResult(new[]
            {
                new SecurityQuestion { Id = 1, Question = "question1", Answer = "a***1" },
                new SecurityQuestion { Id = 2, Question = "question2", Answer = "a***2" },
                new SecurityQuestion { Id = 3, Question = "question3", Answer = "a***3" },
            }));
        }

        [HttpPost("profile/security")]
        public async Task<ActionResult<SecurityQuestionsVerificationResult>> GetSecurityQuestions(IEnumerable<SecurityQuestion> questionsToVerify)
        {
            return Ok(await Task.FromResult(new SecurityQuestionsVerificationResult
            {
                NumberOfCorrectAnswers = questionsToVerify.Where(q => q.Answer.EndsWith(q.Id.ToString())).Count()
            }));
        }
    }

    public class SearchParameters
    {
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        [Required]
        public string dateOfBirth { get; set; }
    }

    public class SearchResults
    {
        public IEnumerable<RegistrantProfileSearchResult> Registrants { get; set; }
        public IEnumerable<EvacuationFileSearchResult> Files { get; set; }
    }

    public class RegistrantProfileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public RegistrantStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Address PrimaryAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResult> EvacuationFiles { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string TaskId { get; set; }
        public Address EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; }
    }

    public class EvacuationFileHouseholdMember
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsMatch { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RegistrantStatus
    {
        [Description("Verified")]
        Verified,

        [Description("Not Verified")]
        NotVerified
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EvacuationFileStatus
    {
        [Description("In Progress")]
        InProgress,

        [Description("Active")]
        Active,

        [Description("Expired")]
        Expired,

        [Description("Completed")]
        Completed
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum HouseholdMemberType
    {
        [Description("Main Applicant")]
        MainApplicant,

        [Description("Household Member")]
        HouseholdMember
    }

    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }

    public class SecurityQuestionsVerificationResult
    {
        public int NumberOfCorrectAnswers { get; set; }
    }
}
