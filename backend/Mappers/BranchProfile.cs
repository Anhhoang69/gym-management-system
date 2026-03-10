using AutoMapper;
using backend.Models;
using backend.DTOs.Branch;

namespace backend.Mappers;

public class BranchProfile : Profile
{
    public BranchProfile()
    {
        CreateMap<Branch, BranchListDto>()
            .ForMember(d => d.TotalRooms,
                o => o.MapFrom(s => s.Rooms.Count))
            .ForMember(d => d.TotalStaff,
                o => o.MapFrom(s => s.Staffs.Count))
            .ForMember(d => d.TotalCheckinsToday,
                o => o.MapFrom(s =>
                    s.Attendances.Count(a =>
                        a.CheckinAt.Date == DateTime.UtcNow.Date)))
            .ForMember(d => d.Images,
                o => o.MapFrom(s =>
                    s.Images.Select(i => i.ImageUrl)));

        CreateMap<CreateBranchDto, Branch>();

        CreateMap<UpdateBranchDto, Branch>();
    }
}