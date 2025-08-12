using Microsoft.Xrm.Sdk;

namespace EMBC.Database.Resources;

public class DocumentUrlMapper : Profile
{
    public DocumentUrlMapper()
    {
        CreateMap<BcGoV_DocumentUrl, DocumentUrl>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.BcGoV_DocumentUrlId))
            .ForMember(dest => dest.AppealId, opt => opt.MapFrom(src => src.DFA_AppealId.Id))
            .ForMember(
                dest => dest.CaseId,
                opt => opt.MapFrom(src => src.BcGoV_CaseId != null ? src.BcGoV_CaseId.Id : (Guid?)null)
            )
            .ForMember(
                dest => dest.AppealId,
                opt => opt.MapFrom(src => src.DFA_AppealId != null ? src.DFA_AppealId.Id : (Guid?)null)
            )
            .ForMember(
                dest => dest.ProjectId,
                opt => opt.MapFrom(src => src.DFA_Project != null ? src.DFA_Project.Id : (Guid?)null)
            )
            .ForMember(
                dest => dest.StateCode,
                opt => opt.MapFrom(src => src.StateCode.HasValue ? (StateCode)(int)src.StateCode.Value : default)
            )
            .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.BcGoV_Filename))
            .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.BcGoV_Url))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.DFA_Description))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.DFA_Category))
            .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.BcGoV_Size))
            .ForMember(dest => dest.MimeType, opt => opt.MapFrom(src => src.BcGoV_MimeType))
            .ForMember(dest => dest.UploadedDate, opt => opt.MapFrom(src => src.DFA_DateUploaded));

        CreateMap<DocumentUrl, BcGoV_DocumentUrl>()
            .ForMember(dest => dest.BcGoV_DocumentUrlId, opt => opt.MapFrom(src => src.Id))
            .ForMember(
                dest => dest.BcGoV_CaseId,
                opt =>
                    opt.MapFrom(src =>
                        src.CaseId.HasValue ? new EntityReference("bcgov_caseid", src.CaseId.Value) : null
                    )
            )
            .ForMember(
                dest => dest.DFA_AppealId,
                opt =>
                    opt.MapFrom(src =>
                        src.AppealId.HasValue ? new EntityReference("dfa_appeal", src.AppealId.Value) : null
                    )
            )
            .ForMember(
                dest => dest.DFA_Project,
                opt =>
                    opt.MapFrom(src =>
                        src.ProjectId.HasValue ? new EntityReference("dfa_project", src.ProjectId.Value) : null
                    )
            )
            .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (DFA_Appeal_StateCode)src.StateCode))
            .ForMember(dest => dest.BcGoV_Filename, opt => opt.MapFrom(src => src.FileName))
            .ForMember(dest => dest.BcGoV_Url, opt => opt.MapFrom(src => src.Url))
            .ForMember(dest => dest.DFA_Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.DFA_Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.BcGoV_Size, opt => opt.MapFrom(src => src.Size))
            .ForMember(dest => dest.BcGoV_MimeType, opt => opt.MapFrom(src => src.MimeType))
            .ForMember(dest => dest.DFA_DateUploaded, opt => opt.MapFrom(src => src.UploadedDate));
    }
}
