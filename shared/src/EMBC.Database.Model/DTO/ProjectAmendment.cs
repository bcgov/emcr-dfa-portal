using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Database.Contract
{
    public record ProjectAmendmentQuery //: IRequest<IEnumerable<RecoveryClaim>>
    {
        public Guid? Id { get; set; }
    }

    public record ProjectAmendment : IDto
    {
        public Guid Id { get; set; }
        public StateCode StateCode { get; set; }
        public string? AdditionalProjectCostDecision { get; set; }
        public string? Amended18MonthDeadline { get; set; }
        public string? AmendedProjectDeadlineDate { get; set; }
        public string? AmendmentApprovedDate { get; set; }
        public string? AmendmentDecision { get; set; }
        public string? AmendmentId { get; set; }
        public int? AmendmentNumber { get; set; }
        public string? AmendmentReason { get; set; }
        public string? AmendmentReceivedDate { get; set; }
        public decimal? ApprovedAdditionalProjectCost { get; set; }
        public string? CreatedDate { get; set; }
        public string? DeadlineExtensionApproved { get; set; }
        public string? EmcrDecisionComments { get; set; }
        public decimal? EstimatedAdditionalProjectCost { get; set; }
        public string? Requested18MonthDate { get; set; }
        public string? RequestforAdditionalProjectCost { get; set; }
        public string? RequestforProjectDeadlineExtention { get; set; }
        public string? ProjectId { get; set; }
        public string? Stage { get; set; }
        public string? Status { get; set; }
    }
};
