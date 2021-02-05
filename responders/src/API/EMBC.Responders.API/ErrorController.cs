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
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.Responders.API
{
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [Route("/error-details")]
        public IActionResult ErrorLocalDevelopment([FromServices] IHostEnvironment hostEnvironment)
        {
            if (hostEnvironment.IsProduction()) throw new InvalidOperationException("This shouldn't be invoked in production environments.");

            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            return Problem(detail: context.Error.ToString(), title: context.Error.Message);
        }

        [Route("/error")]
        public IActionResult Error() => Problem();
    }
}
