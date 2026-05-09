using AutoMapper;
using backend.DTOs.Class;
using backend.Models;

namespace backend.Mappers;

public class ClassProfile : Profile
{
    public ClassProfile()
    {
        CreateMap<Class, ClassDto>()
            .ForMember(d => d.TrainerName,
                opt => opt.MapFrom(s => s.Trainer.User.FullName))
            .ForMember(d => d.RoomName,
                opt => opt.MapFrom(s => s.Room.Name))
            .ForMember(d => d.RoomNumber,
                opt => opt.MapFrom(s => s.Room.RoomNumber))
            .ForMember(d => d.BranchId,
                opt => opt.MapFrom(s => s.Room.BranchId))
            .ForMember(d => d.BranchName,
                opt => opt.MapFrom(s => s.Room.Branch.Name))
            .ForMember(d => d.BookedCount,
                opt => opt.MapFrom(s => s.Bookings.Count))
            .ForMember(d => d.IsFull,
                opt => opt.MapFrom(s => s.Bookings.Count >= s.Capacity));

        CreateMap<ClassBooking, ClassBookingDto>()
            .ForMember(d => d.Title, opt => opt.MapFrom(s => s.Class.Title))
            .ForMember(d => d.Date, opt => opt.MapFrom(s => s.Class.Date))
            .ForMember(d => d.StartTime, opt => opt.MapFrom(s => s.Class.StartTime))
            .ForMember(d => d.EndTime, opt => opt.MapFrom(s => s.Class.EndTime))
            .ForMember(d => d.ClassType, opt => opt.MapFrom(s => s.Class.ClassType))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Class.Status))
            .ForMember(d => d.TrainerName, opt => opt.MapFrom(s => s.Class.Trainer.User.FullName))
            .ForMember(d => d.RoomName, opt => opt.MapFrom(s => s.Class.Room.Name))
            .ForMember(d => d.BookingStatus, opt => opt.MapFrom(s => s.Status));

        CreateMap<CreateClassDto, Class>();

        CreateMap<UpdateClassDto, Class>();

        CreateMap<ClassBooking, ClassMemberDto>()
            .ForMember(d => d.MemberName, opt => opt.MapFrom(s => s.Member.User.FullName))
            .ForMember(d => d.AvatarUrl, opt => opt.MapFrom(s => s.Member.User.AvatarUrl))
            .ForMember(d => d.BookingStatus, opt => opt.MapFrom(s => s.Status));

        CreateMap<ClassBooking, ClassBookingHistoryDto>()
            .ForMember(d => d.ClassTitle, opt => opt.MapFrom(s => s.Class.Title))
            .ForMember(d => d.Date, opt => opt.MapFrom(s => s.Class.Date))
            .ForMember(d => d.StartTime, opt => opt.MapFrom(s => s.Class.StartTime))
            .ForMember(d => d.EndTime, opt => opt.MapFrom(s => s.Class.EndTime))
            .ForMember(d => d.ClassType, opt => opt.MapFrom(s => s.Class.ClassType))
            .ForMember(d => d.TrainerName, opt => opt.MapFrom(s => s.Class.Trainer.User.FullName))
            .ForMember(d => d.RoomName, opt => opt.MapFrom(s => s.Class.Room.Name))
            .ForMember(d => d.BookingStatus, opt => opt.MapFrom(s => s.Status));
    }
}