using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using HandlebarsDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using pdfservice.Models;
using pdfservice.Utils;
using Stubble.Core.Builders;
using WkHtmlToPdfDotNet;
using WkHtmlToPdfDotNet.Contracts;

namespace pdfservice.Controllers
{
    public static class LogSanitizer
    {
        // Removes CR, LF, and other control characters to prevent log forging
        public static string Sanitize(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            var builder = new StringBuilder(input.Length);
            foreach (char c in input)
            {
                if (!char.IsControl(c) || c == '\t')
                    builder.Append(c);
                else
                    builder.Append('_');
            }
            return builder.ToString();
        }
    }
    public class JSONResponse
    {
        public string type;
        public byte[] data;
    }
    [Route("api/[controller]")]
    public class PDFController : Controller
    {
        readonly IConverter _generatePdf;
        private readonly IPdfServiceWebUtility _pdfWebUtility;
        private readonly IConfiguration Configuration;
        protected ILogger _logger;

        public PDFController(IConfiguration configuration, ILoggerFactory loggerFactory, IConverter generatePdf, IPdfServiceWebUtility pdfWebUtility)
        {
            _generatePdf = generatePdf;
            _pdfWebUtility = pdfWebUtility;
            Configuration = configuration;
            _logger = loggerFactory.CreateLogger(typeof(PDFController));
        }

        [HttpPost]
        [Route("GetPDF_DFATest")]
        [Produces("text/html")]
        public IActionResult GetPDF_DFATest()
        {
            var template = "dfa_application_summary";
            var contacts = new Contact[] {
                    new Contact { FirstName = "Karim", LastName= "Hass",CellPhone="222233",BusinessPhone="44444444",Email="Karim@12332.com",JobTitle="Co-Owner",Notes="notes"},
                    new Contact { FirstName = "Karim1", LastName= "Hass1",CellPhone="2222331",BusinessPhone="444444441",Email="Karim@123321.com",JobTitle="Co-Owner1",Notes="notes1"},
                    };
            var contactText = new StringBuilder();
            contactText.Append($@"<div class='contacts-container' ><table class='contacts' style='width:95%'>");
            
            contactText.Append($@"<tr style='background-color: #415a88;color: #fff;'>
                         <th>First Name</th><th>Last Name</th><th>Business Phone</th><th>Email</th><th>Cell Phone</th><th>Job Title</th><th>Notes</th></tr>");
            foreach (var contact in contacts)
            {
                contactText.Append($@"<tr>
                        <td>{contact.FirstName}</td>
                        <td>{contact.LastName}</td>
                        <td>{contact.BusinessPhone}</td>   
                        <td>{contact.Email}</td>
                        <td>{contact.CellPhone}</td>
                        <td>{contact.JobTitle}</td>
                        <td>{contact.Notes}</td>
                        </tr>");
            }

            contactText.Append("</table></div>");

            var rawdata = new
            {
                IndigenousGoverningBody = "SmallBusinessOwner",
                DateofDamageFrom = "DateofDamageTo",
                DateofDamageTo = "DateofDamageTo",
                DisasterEvent = "DisasterEvent",
                CauseofDamage = "CauseofDamage ",
                GovernmentType = "GovernmentType",
                OtherGoverningBody = "OtherGoverningBody",
                DescribeYourOrganization = "DescribeYourOrganization",

                //////////// Second section////////////
                DoingBusinessAsDBAName= "DoingBusinessAsDBAName",
                BusinessNumber = "BusinessNumber",
                AddressLine1 = "AddressLine1",
                AddressLine2 = "AddressLine2",
                City = "City",
                Province = "Province",
                PostalCode = "PostalCode",

                //Primary Contact Details
                FirstName = "FirstName",
                LastName = "LastName",
                Department = "Department",
                BusinessPhone = "BusinessPhone",
                EmailAddress = "EmailAddress",
                CellPhone = "CellPhone",
                JobTitle = "JobTitle",
                ContactNotes = "ContactNotes",

                //Contacts
                contacts = contactText,
            };
            string filename = $"Templates/{template}.mustache";
            if (System.IO.File.Exists(filename))
            {
                string format = System.IO.File.ReadAllText(filename);
                HandlebarsTemplate<object, object> handlebar = GetHandlebarsTemplate(format);

                handlebar = Handlebars.Compile(format);
                var html = handlebar(rawdata);

                var doc = new HtmlToPdfDocument()
                {
                    GlobalSettings = {
                        PaperSize = PaperKind.Letter,
                        Orientation = Orientation.Portrait,
                        Margins = new MarginSettings(5.0,5.0,5.0,5.0)
                    },

                    Objects = {
                        new ObjectSettings()
                        {
                            HtmlContent = html
                        }
                    }
                };
                try
                {
                    var pdf = _generatePdf.Convert(doc);
                    string bitString = BitConverter.ToString(pdf);

                    return File(pdf, "application/pdf", "test.pdf");
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "ERROR rendering PDF");
                    _logger.LogError(template);
                    _logger.LogError(html);
                }
                return Content(html, "text/html", Encoding.UTF8);
            }

            return new NotFoundResult();
        }
        [HttpPost]
        [Route("GetPDF")]
        [Produces("application/pdf")]
        [ProducesResponseType(200, Type = typeof(FileContentResult))]
        public IActionResult GetPDF([FromBody] PdfReuest pdfReuest)
        {
            if (pdfReuest==null||string.IsNullOrEmpty(pdfReuest.Template)|| pdfReuest.PdfApplicationData==null)
            {
                throw new BadHttpRequestException("pdfReuest,Template or PdfApplicationData can be null");
            }
            _logger.LogInformation($"PDF-Service GetPDF: received request");

            // Validate template name to prevent path injection
            if (!IsValidTemplateName(pdfReuest.Template))
            {
                return BadRequest("Invalid template name.");
            }
            string filename = $"Templates/{pdfReuest.Template}.mustache";

            // Sanitize filename before logging to prevent log forging
            string safeFilename = LogSanitizer.Sanitize(filename);
            _logger.LogInformation($"PDF-Service GetPDF: template filename is: {safeFilename}");

            if (System.IO.File.Exists(filename))
            {
                string format = System.IO.File.ReadAllText(filename);
                HandlebarsTemplate<object, object> handlebar = GetHandlebarsTemplate(format);

                handlebar = Handlebars.Compile(format);
                var html = handlebar(pdfReuest.PdfApplicationData);

                var doc = new HtmlToPdfDocument()
                {
                    GlobalSettings = {
                        PaperSize = PaperKind.Letter,
                        Orientation = Orientation.Portrait,
                        Margins = new MarginSettings(5.0,5.0,5.0,5.0)
                    },

                    Objects = {
                        new ObjectSettings()
                        {
                            HtmlContent = html
                        }
                    }
                };
                try
                {
                    var pdf = _generatePdf.Convert(doc);
                    return File(pdf, "application/pdf",$"{pdfReuest.PdfApplicationData.LastName},{pdfReuest.PdfApplicationData.FirstName}_application_summary.pdf");
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "ERROR rendering PDF");
                    _logger.LogError(pdfReuest.Template);
                    _logger.LogError(html);
                }
                return Content(html, "text/html", Encoding.UTF8);
            }

            return new NotFoundResult();
        }


        //[HttpPost]
        //[Route("GetPDF/{template}")]
        //[Produces("application/pdf")]
        //[ProducesResponseType(200, Type = typeof(FileContentResult))]
        //public IActionResult GetPDF([FromBody] Dictionary<string, object> rawdata, string template)
        //{
        //    _logger.LogInformation($"PDF-Service GetPDF: received request");

        //    // first do a mustache merge.
        //    string filename = $"Templates/{template}.mustache";

        //    _logger.LogInformation($"PDF-Service GetPDF: template filename is: {filename}");

        //    // remove serialized "signature" entry
        //    Dictionary<string, object> parameters = new Dictionary<string, object>();
        //    parameters = rawdata
        //        .Where(x => x.Key != "signatures")
        //        .ToDictionary();

        //    // extract serialized "signature" entry - which is actually an array of SignatureGroup objects
        //    var sigparms = rawdata
        //        .Where(x => x.Key == "signatures")
        //        .Select(x => x.Value)
        //        .FirstOrDefault()
        //        .ToString();

        //    SignatureGroupViewModel[] signaturesViewModel = null;

        //    try
        //    {
        //        // deserialize "signature" entry correctly
        //        var signaturesRequest = JsonConvert.DeserializeObject<SignatureGroupRequestModel[]>(sigparms);
        //        // convert SignatureGroupRequestModel -> SignatureGroupViewModel
        //        signaturesViewModel = _pdfWebUtility.ConvertSignatureGroup(signaturesRequest);

        //    }
        //    catch (Exception ex)
        //    {
        //        Debug.WriteLine(ex.Message);
        //        _logger.LogError($"PDF-Service GetPDF: Exception: {ex.Message}");
        //    }

        //    // add signatures back into Mustache data context
        //    parameters.Add("signatures", signaturesViewModel);

        //    if (System.IO.File.Exists(filename))
        //    {
        //        string html = null;

        //        try
        //        {
        //            _logger.LogInformation($"PDF-Service GetPDF: about to read {filename} and merge Mustache content");

        //            string format = System.IO.File.ReadAllText(filename);

        //            // 2024-04-15 Register Handlebar helper (extra features)
        //            HandlebarsTemplate<object, object> handlebar = GetHandlebarsTemplate(format);
        //            html = handlebar(parameters);

        //        }
        //        catch (Exception ex)
        //        {
        //            Debug.WriteLine(ex);
        //        }

        //        var doc = new HtmlToPdfDocument()
        //        {
        //            GlobalSettings = {
        //                PaperSize = PaperKind.Letter,
        //                Orientation = Orientation.Portrait,
        //                Margins = new MarginSettings(5.0,5.0,5.0,5.0)
        //            },

        //            Objects = {
        //                new ObjectSettings()
        //                {
        //                    HtmlContent = html
        //                }
        //            }
        //        };
        //        try
        //        {
        //            var pdf = _generatePdf.Convert(doc);
        //            return File(pdf, "application/pdf");
        //        }
        //        catch (Exception e)
        //        {
        //            _logger.LogError(e, "ERROR rendering PDF");
        //            _logger.LogError(template);
        //            _logger.LogError(html);
        //        }
        //    }

        //    return new NotFoundResult();
        //}



        private static HandlebarsTemplate<object, object> GetHandlebarsTemplate(string format)
        {
            Handlebars.RegisterHelper("arraysig", (outputwriter, options, context, arguments) =>
            {
                try
                {
                    if (arguments.Length != 2)
                    {
                        throw new HandlebarsException("{{#arraysig}} helper must have exactly 2 arguments");
                    }

                    if (arguments[0] is IEnumerable<SignatureGroupViewModel>)
                    {
                        var sigList = arguments[0] as IEnumerable<SignatureGroupViewModel>;
                        var sigArray = sigList.ToArray<SignatureGroupViewModel>();
                        int.TryParse(arguments[1].ToString(), out int sigPosn);

                        if (sigPosn < sigArray.Length)
                        {
                            SignatureGroupViewModel result = sigArray[sigPosn];

                            options.Template(outputwriter, result);
                        }
                        else
                        {
                            options.Inverse(outputwriter, context);
                            //HandlebarsExtensions.WriteSafeString(outputwriter, "");
                        }
                    }
                    else
                    {
                        throw new HandlebarsException("{{arraysig}} 1st parameter must be an array of SignatureGroup");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{{arraysig unexpected exception: {ex.Message}");
                }

            });

            var handlebar = Handlebars.Compile(format);
            return handlebar;
        }


        [HttpPost]
        [Route("GetHash/{template}")]
        public IActionResult GetHash([FromBody] Dictionary<string, object> rawdata, string template)
        {
            // Validate template name to prevent path injection
            if (!IsValidTemplateName(template))
            {
                return BadRequest("Invalid template name.");
            }
            // first do a mustache merge.
            var stubble = new StubbleBuilder().Build();
            string filename = $"Templates/{template}.mustache";

            if (System.IO.File.Exists(filename))
            {
                string format = System.IO.File.ReadAllText(filename);
                var html = stubble.Render(format, rawdata);

                // compute a hash of the template to render as PDF
                var hash = HashUtility.GetSHA256(Encoding.UTF8.GetBytes(html));
                return new JsonResult(new { hash = hash });
            }

            return new NotFoundResult();
        }

        // Helper for template name validation
        private static readonly HashSet<string> AllowedTemplates = new HashSet<string>
        {
            "dfa_application_summary"
            // Add other allowed template names here
        };

        private static bool IsValidTemplateName(string template)
        {
            // Only allow alphanumeric, underscore, and dash, and must be in allowed list
            return !string.IsNullOrEmpty(template)
                && template.All(c => char.IsLetterOrDigit(c) || c == '_' || c == '-')
                && AllowedTemplates.Contains(template);
        }

    }
}
