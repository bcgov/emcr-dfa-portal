using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.DFA.API.Controllers;
using EMBC.DFA.PUBLIC.API.Services;

using EMBC.Utilities.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.DFA.PUBLIC.API.Controllers
{

    public class ApplicationResult
    {
        public required string Id { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly ILogger<AttachmentController> logger;
        private readonly IS3Provider s3Provider;
        private readonly IMapper mapper;
        private readonly ErrorParser errorParser;

#pragma warning disable CS8603 // Possible null reference return.
        private string GetCurrentBusinessId() => User.FindFirstValue("bceid_business_guid");
        private string GetCurrentBusinessName() => User.FindFirstValue("bceid_business_name");
        private string GetCurrentUserId() => User.FindFirstValue("bceid_user_guid");
        private FileTag GetDeletedFileTag() => new FileTag { Tags = new[] { new Tag { Key = "Deleted", Value = "true" } } };
        private FileTag GetReactivatedFileTag() => new FileTag { Tags = new[] { new Tag { Key = "Deleted", Value = "false" } } };
        private UserInfo GetCurrentUser()
        {
            return new UserInfo { BusinessId = GetCurrentBusinessId(), BusinessName = GetCurrentBusinessName(), UserId = GetCurrentUserId() };
        }
#pragma warning restore CS8603 // Possible null reference return.

        public FilesController(ILogger<AttachmentController> logger, IS3Provider s3Provider, IMapper mapper)
        {
            this.logger = logger;
            this.s3Provider = s3Provider;
            this.mapper = mapper;
            this.errorParser = new ErrorParser();
        }

#pragma warning disable ASP0019 // Suggest using IHeaderDictionary.Append or the indexer
        [HttpGet("{id}")]
        public async Task<FileStreamResult> DownloadFile(
            [FromRoute] string id,
            [FromHeader(Name = "file-folder")] string? folder
            )
        {
            var res = (FileQueryResult)(await s3Provider.HandleQuery(new FileQuery { Key = id, Folder = folder }));
            var content = new MemoryStream(res.File.Content);
            var contentType = !string.IsNullOrEmpty(res.File.ContentType) ? res.File.ContentType : "application/octet-stream";

            if (res.FileTag != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.HEADER_FILE_CLASSIFICATION,
                    res.FileTag.Tags.SingleOrDefault(t => t.Key == HeaderNames.HEADER_FILE_CLASSIFICATION)?.Value);

                string tagStr = GetStrFromTags(res.FileTag.Tags);
                if (!string.IsNullOrWhiteSpace(tagStr))
                    HttpContext.Response.Headers.Add(HeaderNames.HEADER_FILE_TAG, tagStr);
            }

            if (!string.IsNullOrWhiteSpace(folder))
                HttpContext.Response.Headers.Add(HeaderNames.HEADER_FILE_FOLDER, folder);

            return new FileStreamResult(content, contentType);
        }
#pragma warning restore ASP0019 // Suggest using IHeaderDictionary.Append or the indexer


        [HttpPost("{id}")]
        [RequestSizeLimit(75_000_000)] //Payload may be larger than the actualy content length - this is large enough to handle 50MB file
      
        public async Task<ActionResult<ApplicationResult>> UploadFile(
            [FromForm] UploadFileRequest request,
            [FromRoute] string id,
            [FromHeader(Name = "file-classification")] string? classification,
            [FromHeader(Name = "file-tag")] string? tags,
            [FromHeader(Name = "file-folder")] string? folder
            )
        {
            try
            {
                var bytes = await GetBytes(request.File);
                var contentSize = bytes.Length;
                if (contentSize >= (51 * 1024 * 1024))
                {
                    throw new Exception("File size exceeds 50MB limit");
                }

                var file = new S3File { FileName = request.File.FileName, Content = bytes, ContentType = request.File.ContentType };
                await s3Provider.HandleCommand(new UploadFileCommand { Folder = folder, Key = id, File = file });
                return Ok(new ApplicationResult { Id = id });
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApplicationResult>> DeleteFile(
            [FromRoute] string id,
            [FromHeader(Name = "file-folder")] string? folder
            )
        {
            await s3Provider.HandleCommand(new UpdateTagsCommand { Key = id, Folder = folder, FileTag = GetDeletedFileTag() });
            return Ok(new ApplicationResult { Id = id });
        }

        [HttpPost("{id}/reactivate")]
        public async Task<ActionResult<ApplicationResult>> ReactivateFile(
            [FromRoute] string id,
            [FromHeader(Name = "file-folder")] string? folder
            )
        {
            await s3Provider.HandleCommand(new UpdateTagsCommand { Key = id, Folder = folder, FileTag = GetReactivatedFileTag() });
            return Ok(new ApplicationResult { Id = id });
        }

        private static async Task<byte[]> GetBytes(IFormFile formFile)
        {
            await using var memoryStream = new MemoryStream();
            await formFile.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        private static string GetStrFromTags(IEnumerable<Tag> tags)
        {
            List<string> tagStrlist = new();
            foreach (Tag t in tags)
            {
                if (t.Key != HeaderNames.HEADER_FILE_CLASSIFICATION)
                    tagStrlist.Add($"{t.Key}={t.Value}");
            }
            return string.Join(",", tagStrlist);
        }
    }

    public class UploadFileRequest
    {
        [Required(ErrorMessage = "Please add a file")]
        public required IFormFile File { get; set; }
    }

    public static class HeaderNames
    {
        public static readonly string HEADER_FILE_CLASSIFICATION = "file-classification";
        public static readonly string HEADER_FILE_TAG = "file-tag";
        public static readonly string HEADER_FILE_FOLDER = "file-folder";
    }
}
