using backend.DTOs.AuditLog;
using backend.Helpers;
using backend.Models;

namespace backend.Interfaces;

public interface IAuditLogService
{
    Task<PagedResult<AuditLogDto>> GetAuditLogsAsync(
        int page,
        int pageSize,
        string? entityType,
        string? action,
        Guid? userId,
        DateTime? dateFrom,
        DateTime? dateTo,
        Guid? branchId);

    AuditLog CreateLog(Guid userId, string entityType, Guid entityId, string action, string? oldValue = null, string? newValue = null, Guid? branchId = null);
    void Add(AuditLog auditLog);
    void AddRange(IEnumerable<AuditLog> auditLogs);
}