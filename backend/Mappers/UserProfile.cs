using AutoMapper;
using backend.DTOs.User;
using backend.Models;
using backend.Enums;
namespace backend.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.BranchId, opt => opt.MapFrom(s => s.Staff != null ? s.Staff.BranchId : s.InitialBranchId))
            .ForMember(d => d.InitialBranchId, opt => opt.MapFrom(s => s.InitialBranchId))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Staff != null ? s.Staff.Branch.Name : (s.InitialBranch != null ? s.InitialBranch.Name : null)))
            .ForMember(d => d.StaffPosition, opt => opt.MapFrom(s => s.Staff != null ? s.Staff.Position : (StaffPosition?)null))
            .ForMember(d => d.IsStaff, opt => opt.MapFrom(s => s.Staff != null))
            .ForMember(d => d.IsMember, opt => opt.MapFrom(s => s.Member != null))
            .ForMember(d => d.TrainerProfile, opt => opt.Ignore());

        CreateMap<User, UserListDto>()
            .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.BranchName, opt => opt.MapFrom(s => s.Staff != null ? s.Staff.Branch.Name : (s.InitialBranch != null ? s.InitialBranch.Name : null)))
            .ForMember(d => d.StaffPosition, opt => opt.MapFrom(s => s.Staff != null ? s.Staff.Position : (StaffPosition?)null));

        CreateMap<AccessCard, AccessCardSummaryDto>();
        CreateMap<Contract, ContractSummaryDto>()
            .ForMember(d => d.PackageName, opt => opt.MapFrom(s => s.Package.Name));

        CreateMap<PTProfile, PTProfileDto>();
        CreateMap<PTProfileDto, PTProfile>();

        CreateMap<UpdateUserDto, User>();
        CreateMap<CreateUserDto, User>()
            .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.Email.Trim().ToLowerInvariant()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Trim().ToLowerInvariant()))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
            .ForMember(d => d.InitialBranchId, opt => opt.MapFrom(s => s.BranchId))
            .ForMember(d => d.TwoFactorEnabled, opt => opt.MapFrom(_ => false))
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.InitialBranch, opt => opt.Ignore())
            .ForMember(d => d.Member, opt => opt.Ignore())
            .ForMember(d => d.Staff, opt => opt.Ignore())
            .ForMember(d => d.NotificationRecipients, opt => opt.Ignore())
            .ForMember(d => d.AuditLogs, opt => opt.Ignore())
            .ForMember(d => d.Requests, opt => opt.Ignore())
            .ForMember(d => d.HandledRequests, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore())
            .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
            .ForMember(d => d.LastLoginAt, opt => opt.Ignore())
            .ForMember(d => d.Status, opt => opt.Ignore())
            .ForMember(d => d.AvatarUrl, opt => opt.Ignore())
            .ForMember(d => d.PasswordHash, opt => opt.Ignore())
            .ForMember(d => d.SecurityStamp, opt => opt.Ignore())
            .ForMember(d => d.ConcurrencyStamp, opt => opt.Ignore())
            .ForMember(d => d.LockoutEnd, opt => opt.Ignore())
            .ForMember(d => d.LockoutEnabled, opt => opt.Ignore())
            .ForMember(d => d.AccessFailedCount, opt => opt.Ignore())
            .ForMember(d => d.NormalizedEmail, opt => opt.Ignore())
            .ForMember(d => d.NormalizedUserName, opt => opt.Ignore())
            .ForMember(d => d.EmailConfirmed, opt => opt.Ignore())
            .ForMember(d => d.PhoneNumberConfirmed, opt => opt.Ignore())
            .ForMember(d => d.TwoFactorEnabled, opt => opt.MapFrom(_ => false));
    }
}