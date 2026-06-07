using AutoMapper;
using backend.Models;
using backend.DTOs.Branch;
using backend.Enums;

namespace backend.Mappers;

public class BranchProfile : Profile
{
    public BranchProfile()
    {
        CreateMap<Branch, BranchDto>()
            .ForMember(d => d.TotalRooms, opt => opt.MapFrom(s => s.Rooms.Count))
            .ForMember(d => d.TotalStaff, opt => opt.MapFrom(s => s.Staffs.Count))
            .ForMember(d => d.TotalCheckinsToday, opt => opt.MapFrom(s => s.Attendances.Count(a => a.CheckinAt.Date == DateTime.UtcNow.Date)))
            .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Images.Select(i => i.ImageUrl)))
            .ForMember(d => d.Description, opt => opt.MapFrom(s => s.Description))
            .ForMember(d => d.OpeningHours, opt => opt.MapFrom(s => s.OpeningHours))
            .ForMember(d => d.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.UpdatedAt, opt => opt.MapFrom(s => s.UpdatedAt));

        CreateMap<Room, BranchRoomDto>();

        CreateMap<Branch, BranchListDto>()
            .ForMember(d => d.TotalRooms, opt => opt.MapFrom(s => s.Rooms.Count))
            .ForMember(d => d.TotalStaff, opt => opt.MapFrom(s => s.Staffs.Count))
            .ForMember(d => d.TotalCheckinsToday, opt => opt.MapFrom(s => s.Attendances.Count(a => a.CheckinAt.Date == DateTime.UtcNow.Date)))
            .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Images.Select(i => i.ImageUrl)))
            .ForMember(d => d.OpeningHours, opt => opt.MapFrom(s => s.OpeningHours));

        CreateMap<Staff, BranchStaffDto>()
            .ForMember(d => d.FullName,
                opt => opt.MapFrom(s => s.User.FullName))

            .ForMember(d => d.Email,
                opt => opt.MapFrom(s => s.User.Email));

        CreateMap<CreateBranchDto, Branch>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Rooms, opt => opt.Ignore());

        CreateMap<UpdateBranchDto, Branch>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());
    }
}