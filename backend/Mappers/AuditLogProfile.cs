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
                opt => opt.MapFrom(s => s.User.FullName));
    }
}