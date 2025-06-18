using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using EMBC.DFA.API.Services;
using EMBC.DFA.PUBLIC.API.Services;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace EMBC.DFA.API.ConfigurationModule.Models.PDF.PDFService
{
    public class PDFServiceHandler
    {
        private PdfServiceConfigs options;

        public PDFServiceHandler(IOptions<PdfServiceConfigs> options, BearerTokenProvider bearerTokenProvider)
        {
            this.options = options.Value;
        }

        public async Task<byte[]> GetFileDataAsync(PdfReuest pdfReuest)
        {
            byte[] fileBytes = null;
            var url = options.GeneratePDFFile;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var bearerToken = await new BearerTokenProvider(client, Options.Create(options), null).GetAccessTokenAsync();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
                    var content = new StringContent(JsonConvert.SerializeObject(pdfReuest), Encoding.UTF8, "application/json");
                    var response = await client.PostAsync(options.GeneratePDFFile, content);
                    response.EnsureSuccessStatusCode();
                    fileBytes = await response.Content.ReadAsByteArrayAsync();
                    //await File.WriteAllBytesAsync(downloadPath, fileBytes);
                    Console.WriteLine("File downloaded successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                }
            }
            return fileBytes;
        }
    }
}
