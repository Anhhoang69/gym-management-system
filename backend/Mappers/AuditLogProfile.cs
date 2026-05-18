using AutoMapper;
using backend.DTOs.AuditLog;
using backend.Models;

namespace backend.Mappers;

public class AuditLogProfile : Profile
{
    public AuditLogProfile()
    {
        CreateMap<AuditLog, AuditLogDto>()
            .ForMember(d => d.UserName,
                opt => opt.MapFrom(s => s.User.FullName))
            .ForMember(d => d.BranchId,
                opt => opt.MapFrom(s => s.BranchId))
            .ForMember(d => d.BranchName,
                opt => opt.MapFrom(s => s.Branch != null ? s.Branch.Name : null));
    }
}