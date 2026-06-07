using backend.Data;
using backend.DTOs.Profile;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;

    public ProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MyProfileDto> GetMyProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Staff)
                .ThenInclude(s => s!.Branch)
            .Include(u => u.Staff)
                .ThenInclude(s => s!.PTProfile)
            .Include(u => u.Member)
                .ThenInclude(m => m!.AccessCard)
            .Include(u => u.InitialBranch)          // cần cho Member
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new Exception("User not found");

        var roles = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
            .ToListAsync();

        var roleName = user.Staff != null ? user.Staff.Position.ToString() : roles.FirstOrDefault();

        var dto = new MyProfileDto
        {
            UserId       = user.Id,
            FullName     = user.FullName,
            Email        = user.Email ?? string.Empty,
            PhoneNumber  = user.PhoneNumber,
            Gender       = user.Gender,
            Birthday     = user.Birthday,
            Address      = user.Address,
            AvatarUrl    = user.AvatarUrl,
            LanguagePreference = user.LanguagePreference,
            TwoFactorEnabled   = user.TwoFactorEnabled,
            LastLoginAt  = user.LastLoginAt,
            Role         = roleName,
            BranchName   = user.Staff?.Branch?.Name ?? user.InitialBranch?.Name
        };

        // ---- Member-specific info ----
        if (user.Member != null)
        {
            var activeContract = await _context.Contracts
                .Include(c => c.Package)
                .Where(c => c.MemberUserId == userId && c.Status == ContractStatus.Active)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            var totalContracts = await _context.Contracts
                .CountAsync(c => c.MemberUserId == userId);

            var card = user.Member.AccessCard;
            dto.MemberInfo = new MemberProfileInfo
            {
                AccessCardId  = card?.AccessCardId,
                CardCode      = card?.CardCode,
                CardStatus    = card?.Status,
                CardExpireDate = card?.ExpireDate,
                TotalContracts = totalContracts,
                ActiveContract = activeContract == null ? null : new ActiveContractInfo
                {
                    ContractId   = activeContract.ContractId,
                    PackageName  = activeContract.Package.Name,
                    Status       = activeContract.Status,
                    StartDate    = activeContract.StartDate,
                    EndDate      = activeContract.EndDate,
                    RemainingPrivateSessions = activeContract.TotalPrivateSessions - activeContract.UsedPrivateSessions,
                    RemainingGroupSessions   = activeContract.TotalGroupSessions   - activeContract.UsedGroupSessions
                }
            };
        }

        // ---- PT-specific info ----
        if (user.Staff?.Position is StaffPosition.PT or StaffPosition.HeadPT
            && user.Staff.PTProfile != null)
        {
            var p = user.Staff.PTProfile;
            dto.TrainerInfo = new PTProfileInfo
            {
                ExperienceYears = p.ExperienceYears,
                BioDescription  = p.BioDescription,
                Specialization  = p.Specialization,
                Certificate     = p.Certificate,
                BranchName      = user.Staff.Branch?.Name
            };
        }

        return dto;
    }

    public async Task UpdateMyProfileAsync(Guid userId, UpdateMyProfileDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Staff)
                .ThenInclude(s => s!.PTProfile)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new Exception("User not found");

        // ---- Basic fields (all roles) ----
        if (dto.FullName is not null)           user.FullName           = dto.FullName;
        if (dto.Gender is not null)             user.Gender             = dto.Gender;
        if (dto.Birthday is not null)           user.Birthday           = dto.Birthday;
        if (dto.Address is not null)            user.Address            = dto.Address;
        if (dto.AvatarUrl is not null)          user.AvatarUrl          = dto.AvatarUrl;
        if (dto.LanguagePreference is not null) user.LanguagePreference = dto.LanguagePreference;

        // ---- PT-specific trainer profile update ----
        if (dto.TrainerProfile != null && user.Staff != null &&
            (user.Staff.Position == StaffPosition.PT || user.Staff.Position == StaffPosition.HeadPT))
        {
            var profile = user.Staff.PTProfile;
            if (profile == null)
            {
                profile = new PTProfile { StaffUserId = user.Id };
                user.Staff.PTProfile = profile;
                _context.PTProfiles.Add(profile);
            }

            var tp = dto.TrainerProfile;
            if (tp.ExperienceYears.HasValue) profile.ExperienceYears = tp.ExperienceYears.Value;
            if (tp.BioDescription is not null)  profile.BioDescription  = tp.BioDescription;
            if (tp.Specialization is not null)  profile.Specialization  = tp.Specialization;
            if (tp.Certificate is not null)     profile.Certificate     = tp.Certificate;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task<PagedResult<LoginHistoryDto>> GetMyLoginHistoryAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.LoginHistories
            .Where(lh => lh.UserId == userId)
            .OrderByDescending(lh => lh.LoginAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(lh => new LoginHistoryDto
            {
                LoginHistoryId = lh.LoginHistoryId,
                LoginAt        = lh.LoginAt,
                IpAddress      = lh.IpAddress,
                UserAgent      = lh.UserAgent,
                DeviceName     = lh.DeviceName,
                IsRevoked      = lh.IsRevoked,
                RevokedAt      = lh.RevokedAt
            })
            .ToListAsync();

        return new PagedResult<LoginHistoryDto>(items, total, page, pageSize);
    }

    public async Task RevokeSessionAsync(Guid userId, Guid loginHistoryId)
    {
        var session = await _context.LoginHistories
            .FirstOrDefaultAsync(lh => lh.LoginHistoryId == loginHistoryId && lh.UserId == userId)
            ?? throw new Exception("Session not found");

        if (session.IsRevoked)
            throw new Exception("Session is already revoked");

        session.IsRevoked  = true;
        session.RevokedAt  = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}
