using System;
using EMBC.Database.Contract;
using EMBC.Database.Shared.Contract;
using EMBC.Utilities.Extensions;

namespace EMBC.DFA.PUBLIC.API.Services;

public class ProjectAppealService
{
    public static class PortalNote
    {
        public const string Received = "Received";
        public const string Submitted = "Submitted";
        public const string InProgress = "In Progress";
        public const string WaitingForInformation = "Waiting for Information";
    }

    public string MapStageNote(ProjectAppeal projectAppeal)
    {
        var stageName = projectAppeal.ProjectAppealEligibility.ActiveStage.Name;

        switch (stageName)
        {
            case "Submitted":
                return PortalNote.Received;
            case "Under Review":
                if (projectAppeal.WaitingOnLegal.ToBool() || projectAppeal.RequiresDecisionNote.ToBool() || projectAppeal.CaseMaterialsReviewed.ToBool())
                {
                    return PortalNote.InProgress;
                }
                else if (projectAppeal.AdditionalInfoRequested.ToBool())
                {
                    return PortalNote.WaitingForInformation;
                }
                else
                {
                    return PortalNote.InProgress;
                }
            case "Appeals Adjudicator Review":
                if (projectAppeal.AarWaitingOnLegal.ToBool() || projectAppeal.AarRequiresDecisionNote.ToBool() || projectAppeal.TimelineNoteAdded.ToBool()
                    || projectAppeal.AarCheckLgOrIgbAppealDecisionLetter.ToBool() || projectAppeal.GenerateAppealDecisionLetter.ToBool() 
                    || projectAppeal.IcrpSpeadSheetComplete.ToBool() || projectAppeal.StampAllDocuments.ToBool() || projectAppeal.PreExistingCondition.ToBool()
                    || projectAppeal.BackUpDocuments.ToBool() || projectAppeal.EligibleProjectScope.ToBool())
                {
                    return PortalNote.InProgress;
                }
                else if (projectAppeal.AarAdditionalInfoRequest.ToBool())
                {
                    return PortalNote.WaitingForInformation;
                }
                else
                {
                    return PortalNote.InProgress;
                }
            case "Appeals Compliance Check":
                if (projectAppeal.AccTimelineNoteAdded.ToBool() || projectAppeal.AccCheckLgOrIgbAppealDecisionLetter.ToBool() || projectAppeal.AccIcrpSpreadsheetComplete.ToBool()
                    || projectAppeal.AccStampAllDocuments.ToBool() || projectAppeal.AccPreExistingCondition.ToBool() || projectAppeal.AccPreExistingCondition.ToBool()
                    || projectAppeal.AccBackupDocuments.ToBool() || projectAppeal.AccEligibleProjectScope.ToBool())
                {
                    return PortalNote.InProgress;
                }
                else if (projectAppeal.AccAdditionaInfoRequested.ToBool())
                {
                    return PortalNote.WaitingForInformation;
                }
                else
                {
                    return PortalNote.InProgress;
                }
            case "Approval Pending":
                if (projectAppeal.ApWaitingOnLegal.ToBool() || projectAppeal.ApRequiresDecisionNote.ToBool())
                {
                    return PortalNote.InProgress;
                } 
                else if (projectAppeal.ApAdditionalInfoRequest.ToBool())
                {
                    return PortalNote.WaitingForInformation;
                }
                else
                {
                    return PortalNote.InProgress;
                }
            case "Appeal Decision Made":
                if (projectAppeal.AppealDecisionCommentsAdded.ToBool() || projectAppeal.AppealDecision != null)
                {
                    return projectAppeal.AppealDecision.ThrowIfNullOrEmpty();
                }
                return PortalNote.InProgress;
            case "DFA Project Update":
                return projectAppeal.AppealDecision.ThrowIfNullOrEmpty();
            case "Closed":
                return projectAppeal.StatusCode.GetDescription();
            default:
                throw new InvalidOperationException($"Unknown stage name: {stageName}");
        }
    }
}
