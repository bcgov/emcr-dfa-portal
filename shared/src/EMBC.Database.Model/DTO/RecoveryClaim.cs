namespace EMBC.Database.Contract;

public record RecoveryClaimQuery //: IRequest<IEnumerable<RecoveryClaim>>
{
    public Guid? Id { get; set; }
    public bool IncludeChildren { get; set; }
    public CodingBlockSubmissionStatus? CodingBlockSubmissionStatus { get; set; }
    public DateTime? AfterInvoiceDate { get; set; }
    public DateTime? AfterDateGoodsReceived { get; set; }
    public DateTime? AfterDateInvoiceReceived { get; set; }
}

public record RecoveryClaim : IDto
{
    public Guid Id { get; set; }
    public StateCode StateCode { get; set; }

    public CodingBlockSubmissionStatus? CodingBlockSubmissionStatus { get; set; }   // Dynamics Optional dfa_codingblocksubmissionstatus

    [MaxLength(4000)]
    public string? LastCodingBlockSubmissionError { get; set; } // Dynamics Optional dfa_lastcodingblocksubmissionerror

    public string? SupplierNumber { get; set; }  // Dynamics Optional dfa_suppliernumber
    [MaxLength(250)]
    public string? SupplierSiteNumber { get; set; } // Dynamics Optional dfa_site
    public DateTime? InvoiceDate { get; set; }  // Dynamics Optional dfa_invoicedate
    public string? InvoiceNumber { get; set; }  // Dynamics Optional dfa_invoicenumber
    public decimal? InvoiceAmount { get; set; } // Dynamics Optional dfa_casinvoiceamount
    public PayGroup? PayGroup { get; set; }     // Dynamics Optional dfa_paygroup
    public DateTime? DateGoodsReceived { get; set; } // Dynamics Optional dfa_dategoodsandservicesreceived
    public DateTime? DateInvoiceReceived { get; set; }  // Dynamics Optional dfa_claimreceiveddate
    public SingleReferenceKey? QualifiedReceiverKey { get; set; } // Dynamics Optional dfa_qualifiedreceiver, relationship dfa_systemuser
    public SingleReferenceKey? ResponsibilityCentreKey { get; set; } // Dynamics Optional dfa_resp
    public SingleReferenceKey? ClientCodeKey { get; set; } // Dynamics Optional dfa_clientcodeid, relationship dfa_clientcode
    public SingleReferenceKey? ExpenseProjectKey { get; set; }    // Dynamics Optional dfa_expenseproject -> dfa_projectnumber
    public SingleReferenceKey? ServiceLineKey { get; set; } // Dynamics Optional dfa_serviceline -> dfa_emcr_serviceline
    public SingleReferenceKey? StobKey { get; set; } // Dynamics Optional dfa_stob -> dfa_emcr_stob

    [MaxLength(40)]
    public string? PaymentAdviceComments { get; set; }   // Dynamics Optional dfa_paymentadvicecomments


    // Related Entities
    public User? QualifiedReceiver { get; set; }
    public ResponsibilityCentre? ResponsibilityCentre { get; set; }
    public ServiceLine? ServiceLine { get; set; }
    public Stob? Stob { get; set; }
    public ExpenseProject? ExpenseProject { get; set; }
    public ClientCode? ClientCode { get; set; }
}
