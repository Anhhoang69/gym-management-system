using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.AuditLog;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class AuditLogService : IAuditLogService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AuditLogService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedResult<AuditLogDto>> GetAuditLogsAsync(
        int page,
        int pageSize,
        string? entityType,
        string? action,
        Guid? userId)
    {
        var query = _context.AuditLogs
            .Include(x => x.User)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(x => EF.Functions.ILike(x.EntityType, $"%{entityType}%"));

        if (!string.IsNullOrEmpty(action))
            query = query.Where(x => EF.Functions.ILike(x.Action, $"%{action}%"));
        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<AuditLogDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return new PagedResult<AuditLogDto>(items, total, page, pageSize);
    }

    public AuditLog CreateLog(Guid userId, string entityType, Guid entityId, string action, string? oldValue = null, string? newValue = null)
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