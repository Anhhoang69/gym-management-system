using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.User;
using backend.Enums;
using backend.Models;
using backend.Interfaces;
using backend.Helpers;

namespace backend.Services;

public class UserService : IUserService

{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;

    public UserService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    // ================= LIST =================


    public async Task<PagedResult<UserListDto>> GetUserListAsync(
            int page,
            int pageSize,
            string? search,
            UserStatus? status,
            Guid? branchId,
            string? role)
    {
        var query = _context.Users
            .Include(x => x.Staff)
                .ThenInclude(s => s.Branch)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search}%";
            query = query.Where(x =>
                EF.Functions.ILike(x.FullName ?? "", keyword) ||
                EF.Functions.ILike(x.Email ?? "", keyword));
        }

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (branchId.HasValue)
        {
            query = query.Where(x =>
                x.Staff != null &&
                x.Staff.BranchId == branchId.Value);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            if (Enum.TryParse<StaffPosition>(role, true, out var position))
            {
                query = query.Where(x =>
                    x.Staff != null &&
                    x.Staff.Position == position);
            }
            else
            {
                query = query.Where(u =>
                    _context.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _context.Roles.Any(r =>
                            r.Id == ur.RoleId &&
                            r.Name == role)));
            }
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<UserListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        // Gán role cho từng user
        var userIds = items.Select(x => x.UserId).ToList();
        var roles = await _context.UserRoles
            .Where(x => userIds.Contains(x.UserId))
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => new { ur.UserId, r.Name })
            .ToDictionaryAsync(x => x.UserId, x => x.Name);
        foreach (var user in items)
        {
            if (roles.TryGetValue(user.UserId, out var roleName))
                user.Role = roleName;
        }

        return new PagedResult<UserListDto>(items, total, page, pageSize);
    }

    // ================= DETAIL =================

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        var user = await _context.Users
            .Include(x => x.Member)
            .Include(x => x.Staff)
                .ThenInclude(s => s.Branch)
            .Include(x => x.Staff)
                .ThenInclude(s => s.PTProfile)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return null;

        var dto = _mapper.Map<UserDto>(user);

        // lấy role
        var role = await _context.UserRoles
            .Where(x => x.UserId == user.Id)
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r.Name)
            .FirstOrDefaultAsync();

        dto.Role = role;

        // trainer profile
        if (dto.StaffPosition == StaffPosition.PT ||
            dto.StaffPosition == StaffPosition.HeadPT)
        {
            if (user.Staff?.PTProfile != null)
            {
                dto.TrainerProfile = _mapper.Map<PTProfileDto>(user.Staff.PTProfile);
            }
        }

        return dto;
    }

    // ================= UPDATE =================

    public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto, Guid adminId)
    {
        var user = await _context.Users
            .Include(x => x.Staff)
                .ThenInclude(s => s.PTProfile)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return false;

        // ===== UPDATE BASIC INFO =====

        _mapper.Map(dto, user);

        // ===== UPDATE STAFF INFO =====

        if (user.Staff != null)
        {
            if (dto.BranchId.HasValue)
                user.Staff.BranchId = dto.BranchId.Value;

            if (dto.StaffPosition.HasValue)
                user.Staff.Position = dto.StaffPosition.Value;
        }

        // ===== UPDATE PT PROFILE =====

        if ((user.Staff?.Position == StaffPosition.PT ||
             user.Staff?.Position == StaffPosition.HeadPT)
            && dto.TrainerProfile != null)
        {
            var profile = user.Staff.PTProfile;

            if (profile == null)
            {
                profile = new PTProfile
                {
                    StaffUserId = user.Id
                };

                user.Staff.PTProfile = profile;
            }

            _mapper.Map(dto.TrainerProfile, profile);
        }

        user.UpdatedAt = DateTime.UtcNow;

        // ===== AUDIT LOG =====

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "User",
            id,
            "UpdateUser"));

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateUserStatusAsync(Guid id, UserStatus status, Guid adminId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        user.Status = status;
        user.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "User",
            id,
            $"UpdateUserStatus:{status}"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= STATS =================

    public async Task<UserStatsDto> GetUserStatsAsync()
    {
        return new UserStatsDto
        {
            TotalUsers = await _context.Users.CountAsync(),

            ActiveUsers = await _context.Users
                .CountAsync(x => x.Status == UserStatus.Active),

            StaffAccounts = await _context.Users
                .CountAsync(x => x.Staff != null),

            MemberAccounts = await _context.Users
                .CountAsync(x => x.Member != null)
        };
    }
}