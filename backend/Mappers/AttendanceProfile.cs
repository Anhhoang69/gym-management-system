using AutoMapper;
using backend.DTOs.Attendance;
using backend.Models;

namespace backend.Mappers;

public class AttendanceProfile : Profile
{
    public AttendanceProfile()
    {
        CreateMap<Attendance, AttendanceDto>()
            .ForMember(dest => dest.MemberName, opt => opt.MapFrom(src => src.Member.User.FullName))
            .ForMember(dest => dest.BranchName, opt => opt.MapFrom(src => src.Branch.Name));
    }
}
