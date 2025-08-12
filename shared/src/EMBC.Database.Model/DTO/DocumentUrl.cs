namespace EMBC.Database.Contract;

/// <summary>
/// DTO for the BcGoV_DocumentUrl entity.
/// </summary>
public record DocumentUrl : IDto
{
    /// <summary>
    /// BcGoV_DocumentUrlId
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// BcGoV_CaseId
    /// </summary>
    public Guid? CaseId { get; set; }

    /// <summary>
    /// DFA_AppealId
    /// </summary>
    public Guid? AppealId { get; set; }

    /// <summary>
    /// DFA_ProjectId
    /// </summary>
    public Guid? ProjectId { get; set; }

    /// <summary>
    /// StateCode
    /// </summary>
    public StateCode StateCode { get; set; }

    /// <summary>
    /// BcGoV_Filename
    /// </summary>
    public string? FileName { get; set; }

    /// <summary>
    /// BcGoV_Url
    /// </summary>
    public string? Url { get; set; }

    /// <summary>
    /// DFA_Description
    /// </summary>
    [MaxLength(300)]
    public string? Description { get; set; }

    /// <summary>
    /// DFA_Category
    /// </summary>
    public string? Category { get; set; }

    /// <summary>
    /// BcGoV_Size
    /// </summary>

    public decimal? Size { get; set; }

    /// <summary>
    /// BcGoV_MimeType
    /// </summary>
    /// <value></value>
    public string? MimeType { get; set; }

    /// <summary>
    /// DFA_DateUploaded
    /// </summary>
    /// <value></value>
    public string? UploadedDate { get; set; }
}
