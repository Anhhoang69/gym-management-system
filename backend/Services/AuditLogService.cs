using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.AuditLog;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.Extensions;
using System.Security.Claims;

namespace backend.Services;

public class AuditLogService : IAuditLogService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditLogService(ApplicationDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedResult<AuditLogDto>> GetAuditLogsAsync(
        int page,
        int pageSize,
        string? entityType,
        string? action,
        Guid? userId,
        DateTime? dateFrom,
        DateTime? dateTo,
        Guid? branchId)
    {
        var query = _context.AuditLogs
            .Include(x => x.User)
            .Include(x => x.Branch)
            .AsNoTracking()
            .AsQueryable();

        // Scope by caller
        var rawUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(rawUserId) && Guid.TryParse(rawUserId, out var callerId))
        {
            var callerStaff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == callerId);
            var isGymOwner = _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.GymOwner) ?? false;
            var isSuperAdmin = _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.SuperAdmin) ?? false;

            if (!isGymOwner && !isSuperAdmin && callerStaff != null && callerStaff.Position == Enums.StaffPosition.BranchAdmin)
            {
                branchId = callerStaff.BranchId; // Override for BranchAdmin
            }
        }

        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(x => EF.Functions.ILike(x.EntityType, $"%{entityType}%"));

        if (!string.IsNullOrEmpty(action))
            query = query.Where(x => EF.Functions.ILike(x.Action, $"%{action}%"));
        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId);
        
        if (dateFrom.HasValue)
            query = query.Where(x => x.CreatedAt >= dateFrom.Value);
            
        if (dateTo.HasValue)
            query = query.Where(x => x.CreatedAt <= dateTo.Value);
            
        if (branchId.HasValue)
            query = query.Where(x => x.BranchId == branchId.Value);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<AuditLogDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return new PagedResult<AuditLogDto>(items, total, page, pageSize);
    }

    public AuditLog CreateLog(Guid userId, string entityType, Guid entityId, string action, string? oldValue = null, string? newValue = null, Guid? branchId = null)
    {
        return new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = entityType,
            EntityId = entityId,
            Action = action,
            OldValue = oldValue,
            NewValue = newValue,
            BranchId = branchId,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Add(AuditLog auditLog)
    {
        _context.AuditLogs.Add(auditLog);
    }

    public void AddRange(IEnumerable<AuditLog> auditLogs)
    {
        _context.AuditLogs.AddRange(auditLogs);
    }
}