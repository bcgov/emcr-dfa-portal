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
        private readonly HttpClient _httpClient;

        public PDFServiceHandler(HttpClient httpClient, IOptions<PdfServiceConfigs> options, BearerTokenProvider bearerTokenProvider)
        {
            this.options = options.Value;

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient = httpClient;
        }

        public async Task<byte[]> GetFileDataAsync(PdfReuest pdfRequest)
        {
            byte[] fileBytes = null;
            var url = options.GeneratePDFFile;

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(pdfRequest), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(options.GeneratePDFFile, content);
                response.EnsureSuccessStatusCode();
                fileBytes = await response.Content.ReadAsByteArrayAsync();
                //await File.WriteAllBytesAsync(downloadPath, fileBytes);
                Console.WriteLine("File downloaded successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
            
            return fileBytes;
        }
    }
}
