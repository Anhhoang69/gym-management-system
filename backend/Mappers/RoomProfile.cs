using AutoMapper;
using backend.DTOs.Room;
using backend.Models;

namespace backend.Mappers;

public class RoomProfile : Profile
{
    public RoomProfile()
    {
        CreateMap<Room, RoomDto>()

        .ForMember(d => d.BranchName,
            opt => opt.MapFrom(s => s.Branch.Name))

        .ForMember(d => d.Images,
            opt => opt.MapFrom(s =>
                s.Images.Select(i => i.ImageUrl)))

        .ForMember(d => d.TotalClasses,
            opt => opt.MapFrom(s => s.Classes.Count));

        CreateMap<CreateRoomDto, Room>()
            .ForMember(d => d.Images, opt => opt.Ignore());

        CreateMap<UpdateRoomDto, Room>()
            .ForMember(d => d.Images, opt => opt.Ignore());
    }
}