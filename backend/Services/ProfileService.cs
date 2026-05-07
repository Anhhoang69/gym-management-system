using AutoMapper;
using backend.Data;
using backend.DTOs.Profile;
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
            .Include(u => u.Staff).ThenInclude(s => s!.Branch)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new Exception("User not found");

        var roles = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
            .ToListAsync();

        return new MyProfileDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            Gender = user.Gender,
            Birthday = user.Birthday,
            Address = user.Address,
            AvatarUrl = user.AvatarUrl,
            LanguagePreference = user.LanguagePreference,
            TwoFactorEnabled = user.TwoFactorEnabled,
            LastLoginAt = user.LastLoginAt,
            Role = roles.FirstOrDefault(),
            BranchName = user.Staff?.Branch?.Name
        };
    }

    public async Task UpdateMyProfileAsync(Guid userId, UpdateMyProfileDto dto)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        if (dto.FullName is not null) user.FullName = dto.FullName;
        if (dto.Gender is not null) user.Gender = dto.Gender;
        if (dto.Birthday is not null) user.Birthday = dto.Birthday;
        if (dto.Address is not null) user.Address = dto.Address;
        if (dto.AvatarUrl is not null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.LanguagePreference is not null) user.LanguagePreference = dto.LanguagePreference;

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
                LoginAt = lh.LoginAt,
                IpAddress = lh.IpAddress,
                UserAgent = lh.UserAgent,
                DeviceName = lh.DeviceName,
                IsRevoked = lh.IsRevoked,
                RevokedAt = lh.RevokedAt
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

        session.IsRevoked = true;
        session.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
}
