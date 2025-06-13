namespace EMBC.Database.Resources;

public class RecoveryClaimMapper : Profile
{
    public RecoveryClaimMapper()
    {
        // Keep these mappings in sync with the below
        CreateMap<DFA_ProjectClaim, RecoveryClaim>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DFA_ProjectClaimId))
            .ForMember(dest => dest.ClientCodeKey, opt => opt.MapFrom(src => src.DFA_ClientCodeId))
            .ForMember(dest => dest.ResponsibilityCentreKey, opt => opt.MapFrom(src => src.DFA_Resp))
            .ForMember(dest => dest.ServiceLineKey, opt => opt.MapFrom(src => src.DFA_ServiceLine))
            .ForMember(dest => dest.StobKey, opt => opt.MapFrom(src => src.DFA_Stob))
            .ForMember(dest => dest.ExpenseProjectKey, opt => opt.MapFrom(src => src.DFA_ProjectNumber))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => src.StateCode))
            .ForMember(dest => dest.CodingBlockSubmissionStatus, opt => opt.MapFrom(src => src.DFA_CodingBlockSubmissionStatus))
            .ForMember(dest => dest.SupplierNumber, opt => opt.MapFrom(src => src.DFA_SupplierNumber))
            .ForMember(dest => dest.SupplierSiteNumber, opt => opt.MapFrom(src => src.DFA_Site))
            .ForMember(dest => dest.InvoiceDate, opt => opt.MapFrom(src => src.DFA_InvoiceDate))
            .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.DFA_InvoiceNumber))
            .ForMember(dest => dest.InvoiceAmount, opt => opt.MapFrom(src => src.DFA_CasInvoiceAmount))
            .ForMember(dest => dest.PayGroup, opt => opt.MapFrom(src => src.DFA_PayGroupType))
            .ForMember(dest => dest.DateGoodsReceived, opt => opt.MapFrom(src => src.DFA_DateGoodsAndServicesReceived))
            .ForMember(dest => dest.DateInvoiceReceived, opt => opt.MapFrom(src => src.DFA_ClaimReceivedDate))
            .ForMember(dest => dest.QualifiedReceiverKey, opt => opt.MapFrom(src => src.DFA_QualifiedReceiver))
            .ForMember(dest => dest.PaymentAdviceComments, opt => opt.MapFrom(src => src.DFA_PaymentAdviceComments))
            .ForMember(dest => dest.LastCodingBlockSubmissionError, opt => opt.MapFrom(src => src.DFA_LastCodingBlockSubmissionError));

        // Keep these mappings in sync with the above
        CreateMap<ProjectClaimComposite, RecoveryClaim>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProjectClaim.Id))
            .ForMember(dest => dest.ClientCodeKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_ClientCodeId))
            .ForMember(dest => dest.ClientCode, opt => opt.MapFrom(src => src.ClientCode))
            .ForMember(dest => dest.ResponsibilityCentreKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_Resp))
            .ForMember(dest => dest.ResponsibilityCentre, opt => opt.MapFrom(src => src.ResponsibilityCentre))
            .ForMember(dest => dest.ServiceLineKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_ServiceLine))
            .ForMember(dest => dest.ServiceLine, opt => opt.MapFrom(src => src.ServiceLine))
            .ForMember(dest => dest.StobKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_Stob))
            .ForMember(dest => dest.Stob, opt => opt.MapFrom(src => src.Stob))
            .ForMember(dest => dest.ExpenseProjectKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_ProjectNumber))
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => src.ProjectClaim.StateCode))
            .ForMember(dest => dest.CodingBlockSubmissionStatus, opt => opt.MapFrom(src => src.ProjectClaim.DFA_CodingBlockSubmissionStatus))
            .ForMember(dest => dest.SupplierNumber, opt => opt.MapFrom(src => src.ProjectClaim.DFA_SupplierNumber))
            .ForMember(dest => dest.SupplierSiteNumber, opt => opt.MapFrom(src => src.ProjectClaim.DFA_Site))
            .ForMember(dest => dest.InvoiceDate, opt => opt.MapFrom(src => src.ProjectClaim.DFA_InvoiceDate))
            .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.ProjectClaim.DFA_InvoiceNumber))
            .ForMember(dest => dest.InvoiceAmount, opt => opt.MapFrom(src => src.ProjectClaim.DFA_CasInvoiceAmount))
            .ForMember(dest => dest.PayGroup, opt => opt.MapFrom(src => src.ProjectClaim.DFA_PayGroupType))
            .ForMember(dest => dest.DateGoodsReceived, opt => opt.MapFrom(src => src.ProjectClaim.DFA_DateGoodsAndServicesReceived))
            .ForMember(dest => dest.DateInvoiceReceived, opt => opt.MapFrom(src => src.ProjectClaim.DFA_ClaimReceivedDate))
            .ForMember(dest => dest.PaymentAdviceComments, opt => opt.MapFrom(src => src.ProjectClaim.DFA_PaymentAdviceComments))
            .ForMember(dest => dest.QualifiedReceiverKey, opt => opt.MapFrom(src => src.ProjectClaim.DFA_QualifiedReceiver))
            .ForMember(dest => dest.QualifiedReceiver, opt => opt.MapFrom(src => src.QualifiedReceiver))
            .ForMember(dest => dest.LastCodingBlockSubmissionError, opt => opt.MapFrom(src => src.ProjectClaim.DFA_LastCodingBlockSubmissionError));

        CreateMap<EMCR_ResponsibilityCentre, ResponsibilityCentre>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EMCR_ResponsibilityCentreId))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EMCR_Code));

        CreateMap<EMCR_ExpenseProject, ExpenseProject>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EMCR_ExpenseProjectId))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EMCR_Code));

        CreateMap<DFA_ClientCode, ClientCode>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.DFA_ClientCodeId))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.DFA_Code));

        CreateMap<EMCR_ServiceLine, ServiceLine>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EMCR_ServiceLineId))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EMCR_Code));

        CreateMap<EMCR_Stob, Stob>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EMCR_StobId))
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.EMCR_Code));

        CreateMap<SystemUser, User>();

        //CreateMap<RecoveryClaim, Invoice>()
        //    .ForMember(dest => dest.GLDate, opt => opt.MapFrom(src => src.InvoiceDate))
        //    .ForMember(dest => dest.QualifiedReceiver, opt => opt.MapFrom(src => src.QualifiedReceiver.FullName))
        //    // below hard-coded values are specific to EMCR DFA, if you reuse the DynamicsController with other projects, move these hard-coded values from this mapping to DFA specific code or have DFA Dynamics supply these values
        //    .ForMember(dest => dest.InvoiceBatchName, opt => opt.MapFrom(src => "EMCR DFA"))
        //    .ForMember(dest => dest.PayGroup, opt => opt.MapFrom(src => src.PayGroup == null ? "GEN CHQ" : src.PayGroup.GetDescription()))
        //    .ForMember(dest => dest.Terms, opt => opt.MapFrom(src => "20 Days"))
        //    // end of DFA hard-coded mappings
        //    .ForMember(dest => dest.InvoiceLineDetails, opt => opt.MapFrom(src => new List<InvoiceLineDetail>
        //    {
        //        new InvoiceLineDetail
        //        {
        //            InvoiceLineNumber = 1,
        //            InvoiceLineAmount = src.InvoiceAmount ?? 0,
        //            DefaultDistributionAccount = $"{src.ClientCode.Code}.{src.ResponsibilityCentre.Code}.{src.ServiceLine.Code}.{src.Stob.Code}.{src.ExpenseProject.Code}.000000.0000"
        //        }
        //    }));
    }
}
