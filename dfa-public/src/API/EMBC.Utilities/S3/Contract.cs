using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace EMBC.Utilities.S3
{
    public interface IS3Provider
    {
        Task<string> HandleCommand(StorageCommand cmd);
        Task<StorageQueryResults> HandleQuery(StorageQuery query);
    }

    public class UserInfo
    {
        public string? UserId { get; set; }
        public  string? BusinessName { get; set; }
        public  string? BusinessId { get; set; }
    }

    public abstract class StorageCommand
    {
        public string? Key { get; set; }
        public string? Folder { get; set; }
    }

    public class UploadFileCommand : StorageCommand
    {
        public S3File? File { get; set; }
        public FileTag? FileTag { get; set; }
    }

    public class UploadFileStreamCommand : StorageCommand
    {
        public  S3FileStream? FileStream { get; set; }
        public FileTag? FileTag { get; set; }
    }

    public class DeleteFileCommand : StorageCommand { }

    public class UpdateTagsCommand : StorageCommand
    {
        public FileTag? FileTag { get; set; }
    }

    public abstract class StorageQuery
    {
        public string Key { get; set; } = null!;
        public string? Folder { get; set; }
    }

    public class FileQuery : StorageQuery { }

    public abstract class StorageQueryResults
    {
        public string? Key { get; set; }
        public string? Folder { get; set; }
    }

    public class FileQueryResult : StorageQueryResults
    {
        public S3File? File { get; set; }
        public FileTag? FileTag { get; set; }
    }

    public class S3File
    {
        public byte[]? Content { get; set; }
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public IEnumerable<FileMetadata> Metadata { get; set; } = Array.Empty<FileMetadata>();
    }

    public class S3FileStream
    {
        public Stream? FileContentStream { get; set; }
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public IEnumerable<FileMetadata> Metadata { get; set; } = Array.Empty<FileMetadata>();
    }

    public class FileMetadata
    {
        public string? Key { get; set; }
        public string? Value { get; set; }
    }

    public class FileTag
    {
        public IEnumerable<Tag> Tags { get; set; } = Array.Empty<Tag>();
    }

    public class Tag
    {
        public string? Key { get; set; }
        public string? Value { get; set; }
    }
}
