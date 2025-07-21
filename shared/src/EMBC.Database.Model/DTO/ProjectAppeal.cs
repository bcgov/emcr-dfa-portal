namespace EMBC.Database.Contract;

public enum ProjectAppealStatusCode
{
    [Description("Closed")]
    Closed = 2,

    [Description("Open")]
    Open = 1,

    [Description("Withdrawn")]
    Withdrawn = 222710000,
}

public record ProjectAppealQuery
{
    public Guid? ProjectId { get; set; }
}

public record ProjectAppeal : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    public ProjectAppealStatusCode? StatusCode { get; set; } // Dynamics Optional

    [MaxLength(200)]
    public required string Name { get; set; }            // Dynamics Application Required

    public Guid ProjectId { get; set; }                 // Dynamics Optional
    
    public bool? AssignedToAdjudicator { get; set; }    // Dynamics Optional
    public bool? AssignedToEvaluator { get; set; }      // Dynamics Optional
    public bool? AdditionalInfoRequested { get; set; }  // Dynamics Optional
    public bool? CaseMaterialsReviewed { get; set; }    // Dynamics Optional
    public bool? RequiresDecisionNote { get; set; }     // Dynamics Optional
    public bool? WaitingOnLegal { get; set; }           // Dynamics Optional
    public bool? EligibleProjectScope { get; set; }      // Dynamics Optional
    public bool? BackUpDocuments { get; set; }          // Dynamics Optional
    public bool? PreExistingCondition { get; set; }      // Dynamics Optional
    public bool? StampAllDocuments { get; set; }            // Dynamics Optional
    public bool? IcrpSpeadSheetComplete { get; set; } // Dynamics Optional
    public bool? GenerateAppealDecisionLetter { get; set; } // Dynamics Optional
    public bool? CheckLgOrIgbAppealDecisionLetter { get; set; } // Dynamics Optional
    public bool? TimelineNoteAdded { get; set; } // Dynamics Optional
    public bool? SubmittedForDirectorReview { get; set; } // Dynamics Optional
    public bool? InEApprovals { get; set; } // Dynamics Optional

    public bool? AarAdditionalInfoRequest { get; set; } // Dynamics Optional
    public bool? AarCheckLgOrIgbAppealDecisionLetter { get; set; } // Dynamics Optional
    public bool? AarRequiresDecisionNote { get; set; } // Dynamics Optional
    public bool? AarWaitingOnLegal { get; set; } // Dynamics Optional

    public bool? AccAdditionaInfoRequested { get; set; } // Dynamics Optional
    public bool? AccBackupDocuments { get; set; } // Dynamics Optional
    public bool? AccIcrpSpreadsheetComplete { get; set; } // Dynamics Optional
    public bool? AccCheckLgOrIgbAppealDecisionLetter { get; set; } // Dynamics Optional
    public bool? AccEligibleProjectScope { get; set; } // Dynamics Optional
    public bool? AccPreExistingCondition { get; set; } // Dynamics Optional
    public bool? AccTimelineNoteAdded { get; set; } // Dynamics Optional
    public bool? AccStampAllDocuments { get; set; } // Dynamics Optional

    public bool? ApAdditionalInfoRequest { get; set; } // Dynamics Optional
    public bool? ApRequiresDecisionNote { get; set; } // Dynamics Optional
    public bool? ApWaitingOnLegal { get; set; } // Dynamics Optional

    public string? AppealDecision { get; set; } // Dynamics Optional
    public bool? AppealDecisionCommentsAdded { get; set; } // Dynamics Optional
    public bool? ReviewAppealDecisionLetter { get; set; } // Dynamics Optional
    public bool? UpdateProjectDecision { get; set; } // Dynamics Optional
    public bool? UpdateProjectApprovedCosts { get; set; } // Dynamics Optional

    // Related Entities
    public ProjectEligibilityAppeal? ProjectAppealEligibility { get; set; }
}
