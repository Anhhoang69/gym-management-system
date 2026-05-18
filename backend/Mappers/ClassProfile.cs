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
                opt => opt.MapFrom(s => s.Trainer != null && s.Trainer.User != null ? s.Trainer.User.FullName : null))
            .ForMember(d => d.RoomName,
                opt => opt.MapFrom(s => s.Room != null ? s.Room.Name : null))
            .ForMember(d => d.RoomNumber,
                opt => opt.MapFrom(s => s.Room != null ? s.Room.RoomNumber : null))
            .ForMember(d => d.BranchId,
                opt => opt.MapFrom(s => s.Room != null ? s.Room.BranchId : (Guid?)null))
            .ForMember(d => d.BranchName,
                opt => opt.MapFrom(s => s.Room != null && s.Room.Branch != null ? s.Room.Branch.Name : null))
            .ForMember(d => d.BookedCount,
                opt => opt.MapFrom(s => s.Bookings != null ? s.Bookings.Count : 0))
            .ForMember(d => d.IsFull,
                opt => opt.MapFrom(s => s.Bookings != null && s.Capacity > 0 && s.Bookings.Count >= s.Capacity));

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

        CreateMap<CreateClassDto, Class>()
            .ForMember(d => d.Trainer, opt => opt.Ignore())
            .ForMember(d => d.Room, opt => opt.Ignore())
            .ForMember(d => d.Bookings, opt => opt.Ignore());

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