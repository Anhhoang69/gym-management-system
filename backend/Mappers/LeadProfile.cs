using AutoMapper;
using backend.DTOs.Lead;
using backend.Models;

namespace backend.Mappers;

public class LeadProfile : Profile
{
    public LeadProfile()
    {
        CreateMap<CreateLeadDto, Lead>()
            .ForMember(d => d.LeadId, opt => opt.Ignore())
            .ForMember(d => d.Status, opt => opt.Ignore())
            .ForMember(d => d.Score, opt => opt.Ignore())
            .ForMember(d => d.CreatedByUserId, opt => opt.Ignore())
            .ForMember(d => d.CreatedByUser, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore())
            .ForMember(d => d.AssignedToStaff, opt => opt.Ignore())
            .ForMember(d => d.ConvertedMember, opt => opt.Ignore());

        CreateMap<UpdateLeadDto, Lead>()
            .ForMember(d => d.LeadId, opt => opt.Ignore())
            .ForMember(d => d.Source, opt => opt.Ignore())
            .ForMember(d => d.Status, opt => opt.Ignore())
            .ForMember(d => d.LostReason, opt => opt.Ignore())
            .ForMember(d => d.LastContactedAt, opt => opt.Ignore())
            .ForMember(d => d.ContactCount, opt => opt.Ignore())
            .ForMember(d => d.Score, opt => opt.Ignore())
            .ForMember(d => d.CreatedByUserId, opt => opt.Ignore())
            .ForMember(d => d.CreatedByUser, opt => opt.Ignore())
            .ForMember(d => d.ConvertedMemberUserId, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore())
            .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
            .ForMember(d => d.AssignedToStaff, opt => opt.Ignore())
            .ForMember(d => d.ConvertedMember, opt => opt.Ignore());

        CreateMap<Lead, LeadDto>()
            .ForMember(d => d.CreatedByUserId, opt => opt.MapFrom(s => s.CreatedByUserId))
            .ForMember(d => d.CreatedByUserName, opt => opt.MapFrom(s => s.CreatedByUser != null ? s.CreatedByUser.FullName : null))
            .ForMember(d => d.AssignedToStaffName, opt => opt.MapFrom(s => s.AssignedToStaff.User.FullName))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.AssignedToStaff.Branch.Name))
            .ForMember(d => d.ConvertedMemberName, opt => opt.MapFrom(s => s.ConvertedMember != null ? s.ConvertedMember.User.FullName : null))
            .ForMember(d => d.SourceId, opt => opt.MapFrom(s => s.SourceId))
            .ForMember(d => d.SourceName, opt => opt.MapFrom(s => s.Source != null ? s.Source.Name : null));

        CreateMap<Lead, LeadListDto>()
            .ForMember(d => d.AssignedToStaffName, opt => opt.MapFrom(s => s.AssignedToStaff.User.FullName))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.AssignedToStaff.Branch.Name))
            .ForMember(d => d.SourceId, opt => opt.MapFrom(s => s.SourceId))
            .ForMember(d => d.SourceName, opt => opt.MapFrom(s => s.Source != null ? s.Source.Name : null));

        CreateMap<LeadSource, LeadSourceDto>();
        CreateMap<LeadSourceDto, LeadSource>();
        CreateMap<LeadSourceUpsertDto, LeadSource>();
        CreateMap<LeadSource, LeadSourceUpsertDto>();
    }
}