using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
//using MailKit;
using Microsoft.Extensions.Configuration;

namespace EMBC.Utilities.S3
{
    public class S3Provider : IS3Provider
    {
        protected readonly IAmazonS3 _amazonS3Client;
        private string? bucketName;

        public S3Provider(IAmazonS3 amazonS3Client, IConfiguration configuration)
        {
            _amazonS3Client = amazonS3Client;
            bucketName = configuration.GetValue<string>("S3:BucketName");
        }

        public async Task<string> HandleCommand(StorageCommand cmd)
        {
            var ct = new CancellationTokenSource().Token;
            return cmd switch
            {
                UploadFileCommand c => await UploadStorageItem(c, ct),
                UploadFileStreamCommand c => await UploadStorageItemStream(c, ct),
                UpdateTagsCommand c => await UpdateTags(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<StorageQueryResults> HandleQuery(StorageQuery query)
        {
            var ct = new CancellationTokenSource().Token;
            return query switch
            {
                FileQuery q => await DownloadStorageItem(q.Key, q.Folder, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<string> UploadStorageItem(UploadFileCommand cmd, CancellationToken cancellationToken)
        {
            S3File? file = cmd.File;
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";
            if (cmd.File != null && file != null)
            {
                var request = new PutObjectRequest
                {
                    Key = key,
                    ContentType = !string.IsNullOrEmpty(cmd.File.ContentType) ? cmd.File.ContentType : null,
                    InputStream = new MemoryStream(file.Content),
                    BucketName = bucketName,
                    //TagSet = GetTagSet(cmd.FileTag?.Tags ?? new List<Tag>()),
                };
                request.Metadata.Add("contenttype", file.ContentType);
                request.Metadata.Add("filename", HttpUtility.HtmlEncode(file.FileName));
                if (file.Metadata != null)
                {
                    foreach (FileMetadata md in file.Metadata)
                        request.Metadata.Add(md.Key, md.Value);
                }

                
                var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
                response.EnsureSuccess();
                

                

                if (cmd?.Key != null)
                {
                    return cmd.Key;
                }

            }

            return "";
        }

        private async Task<string> UploadStorageItemStream(UploadFileStreamCommand cmd, CancellationToken cancellationToken)
        {
            S3FileStream? file = cmd.FileStream;
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            if (cmd.FileStream != null && cmd.Key != null && file != null)
            {
                var request = new PutObjectRequest
                {
                    Key = key,
                    ContentType = cmd.FileStream.ContentType,
                    InputStream = file.FileContentStream,
                    BucketName = bucketName,
                    TagSet = GetTagSet(cmd.FileTag?.Tags ?? new List<Tag>()),
                };
                request.Metadata.Add("contenttype", file.ContentType);
                request.Metadata.Add("filename", HttpUtility.HtmlEncode(file.FileName));
                if (file.Metadata != null)
                {
                    foreach (FileMetadata md in file.Metadata)
                        request.Metadata.Add(md.Key, md.Value);
                }

                var response = await _amazonS3Client.PutObjectAsync(request, cancellationToken);
                response.EnsureSuccess();

                return cmd.Key;
            }

            return "";

        }

        private async Task<FileQueryResult> DownloadStorageItem(string key, string? folder, CancellationToken ct)
        {
            var dir = folder == null ? "" : $"{folder}/";
            var requestKey = $"{dir}{key}";

            //get object
            var request = new GetObjectRequest
            {
                BucketName = bucketName,
                Key = requestKey,
            };
            var response = await _amazonS3Client.GetObjectAsync(request, ct);
            response.EnsureSuccess();
            using var contentStream = response.ResponseStream;
            using var ms = new MemoryStream();
            await contentStream.CopyToAsync(ms, ct);
            await contentStream.FlushAsync(ct);

            //get tagging
            var tagResponse = await _amazonS3Client.GetObjectTaggingAsync(
                new GetObjectTaggingRequest
                {
                    BucketName = bucketName,
                    Key = requestKey,
                }, ct);
            tagResponse.EnsureSuccess();

            return new FileQueryResult
            {
                Key = key,
                Folder = folder,
                File = new S3File
                {
                    ContentType = response.Metadata["contenttype"],
                    FileName = response.Metadata["filename"],
                    Content = ms.ToArray(),
                    Metadata = GetMetadata(response.Metadata).AsEnumerable(),
                },
                FileTag = new FileTag
                {
                    Tags = GetTags(tagResponse.Tagging).AsEnumerable()
                }
            };
        }

        private async Task<string> UpdateTags(UpdateTagsCommand cmd, CancellationToken cancellationToken)
        {
            var folder = cmd.Folder == null ? "" : $"{cmd.Folder}/";
            var key = $"{folder}{cmd.Key}";

            var request = new PutObjectTaggingRequest
            {
                Key = key,
                BucketName = bucketName,
                Tagging = new Tagging { TagSet = GetTagSet(cmd.FileTag?.Tags ?? new List<Tag>()) }
            };

            var response = await _amazonS3Client.PutObjectTaggingAsync(request, cancellationToken);
            response.EnsureSuccess();
            if (cmd.Key != null)
            {
                return cmd.Key;
            }

            return "";
        }

        private static List<Amazon.S3.Model.Tag> GetTagSet(IEnumerable<Tag> tags)
            =>
            tags.Select(tag => new Amazon.S3.Model.Tag()
            {
                Key = tag.Key,
                Value = tag.Value
            }).ToList();

        private static List<FileMetadata> GetMetadata(MetadataCollection mc) =>
            mc.Keys.Where(key => key != "contenttype" && key != "fileName")
                .Select(key => new FileMetadata { Key = key, Value = mc[key] })
                .ToList();

        private static List<Tag> GetTags(List<Amazon.S3.Model.Tag> tags) =>
            tags.ConvertAll(tag => new Tag { Key = tag.Key, Value = tag.Value });
    }

    internal static class S3ClientEx
    {
        public static void EnsureSuccess(this AmazonWebServiceResponse response)
        {
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                throw new InvalidOperationException($"Operation failed with status {response.HttpStatusCode}");
        }

        public static void EnsureNoContent(this AmazonWebServiceResponse response)
        {
            if (response.HttpStatusCode != System.Net.HttpStatusCode.NoContent)
                throw new InvalidOperationException($"Delete Operation failed with status {response.HttpStatusCode}");
        }
    }
}
