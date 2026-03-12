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

    public UserService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // ================= LIST =================

    public async Task<PagedResult<UserDto>> GetUsersAsync(
    int page,
    int pageSize,
    string? search,
    string? status,
    Guid? branchId,
    string? role)
    {
        var query = _context.Users
            .AsNoTracking()
            .AsQueryable();

        // ================= SEARCH =================
        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search}%";

            query = query.Where(x =>
                EF.Functions.ILike(x.FullName ?? "", keyword) ||
                EF.Functions.ILike(x.Email ?? "", keyword));
        }

        // ================= STATUS =================
        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(x => x.Status.ToString() == status);
        }

        // ================= BRANCH =================
        if (branchId.HasValue)
        {
            query = query.Where(x =>
                x.Staff != null &&
                x.Staff.BranchId == branchId.Value);
        }

        // ================= ROLE =================
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

        // ================= PAGINATION =================

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .ToListAsync();


        // lấy roles
        var roles = await _context.UserRoles
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => new { ur.UserId, r.Name })
            .ToDictionaryAsync(x => x.UserId, x => x.Name);


        // gán role vào DTO
        foreach (var user in items)
        {
            if (roles.TryGetValue(user.UserId, out var roleName))
            {
                user.Role = roleName;
            }
        }

        return new PagedResult<UserDto>(items, total, page, pageSize);
    }

    // ================= DETAIL =================

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == id)
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    // ================= UPDATE =================

    public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto, Guid adminId)
    {
        var user = await _context.Users
            .Include(x => x.Staff)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return false;

        _mapper.Map(dto, user);

        // update staff info
        if (user.Staff != null && dto.BranchId.HasValue)
        {
            user.Staff.BranchId = dto.BranchId.Value;

            if (dto.StaffPosition.HasValue)
                user.Staff.Position = dto.StaffPosition.Value;
        }

        user.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = adminId,
            EntityType = "User",
            EntityId = id,
            Action = "UpdateUser",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DEACTIVATE =================

    public async Task<bool> DeactivateUserAsync(Guid id, Guid adminId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        user.Status = UserStatus.Inactive;
        user.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = adminId,
            EntityType = "User",
            EntityId = id,
            Action = "DeactivateUser",
            CreatedAt = DateTime.UtcNow
        });

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