using backend.DTOs.AuditLog;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

[ApiController]
[Route("api/audit-logs")]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogService _service;

    public AuditLogController(IAuditLogService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách audit logs",
        Description = "Trả về danh sách audit logs với bộ lọc theo entityType, action, userId. Hỗ trợ phân trang."
    )]
    public async Task<ApiResponse<PagedResult<AuditLogDto>>> GetAuditLogs(
        int page = 1,
        int pageSize = 20,
        string? entityType = null,
        string? action = null,
        Guid? userId = null)
    {
        var result = await _service.GetAuditLogsAsync(
            page,
            pageSize,
            entityType,
            action,
            userId);

        return new ApiResponse<PagedResult<AuditLogDto>>(result);
    }
}