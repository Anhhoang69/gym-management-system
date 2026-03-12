using AutoMapper;
using backend.DTOs.User;
using backend.Models;

namespace backend.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.BranchId, opt => opt.MapFrom(s => s.Staff!.BranchId))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Staff!.Branch.Name))
            .ForMember(d => d.StaffPosition, opt => opt.MapFrom(s => s.Staff!.Position))
            .ForMember(d => d.IsStaff, opt => opt.MapFrom(s => s.Staff != null))
            .ForMember(d => d.IsMember, opt => opt.MapFrom(s => s.Member != null));

        CreateMap<UpdateUserDto, User>();
    }
}