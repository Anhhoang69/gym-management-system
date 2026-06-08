using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Payroll;
using backend.Enums;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/payroll")]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly IPayrollService _service;

    public PayrollController(IPayrollService service)
    {
        _service = service;
    }

    [HttpGet("formula")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(Summary = "Xem các công thức tính lương")]
    public async Task<ApiResponse<List<PayrollFormulaDto>>> GetFormulas()
    {
        var result = await _service.GetFormulasAsync();
        return new ApiResponse<List<PayrollFormulaDto>>(result);
    }

    [HttpPost("formula")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(Summary = "Tạo công thức tính lương mới", Description = "Công thức mới sẽ tự động thành Active.")]
    public async Task<ApiResponse<Guid>> CreateFormula(CreatePayrollFormulaDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.CreateFormulaAsync(dto, userId);
        return new ApiResponse<Guid>(result);
    }

    [HttpPatch("formula/{id}/active")]
    [Authorize(Roles = AuthorizationRoles.SuperAdminOnly)]
    [SwaggerOperation(Summary = "Kích hoạt công thức lương", Description = "Chuyển công thức sang trạng thái Active, các công thức khác tự động thành Inactive.")]
    public async Task<ApiResponse<bool>> SetActiveFormula(Guid id)
    {
        var result = await _service.SetActiveFormulaAsync(id);
        return new ApiResponse<bool>(result);
    }

    [HttpPost("calculate")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)] // BranchAdmin, SuperAdmin
    [SwaggerOperation(Summary = "Tính lương cho kỳ (Batch)", Description = "Xóa draft cũ (nếu có) và tính lại toàn bộ lương cho Staff dựa trên Formula.")]
    public async Task<ApiResponse<int>> CalculatePayroll(CalculatePayrollDto dto)
    {
        var result = await _service.CalculatePayrollAsync(dto);
        return new ApiResponse<int>(result, $"Calculated payroll for {result} staffs.");
    }

    [HttpGet("report")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)] // BranchAdmin, SuperAdmin
    [SwaggerOperation(Summary = "Xem báo cáo lương")]
    public async Task<IActionResult> GetReport(
        [FromQuery] int? month, 
        [FromQuery] int? year, 
        [FromQuery] Guid? branchId, 
        [FromQuery] Guid? staffId, 
        [FromQuery] string? position,
        [FromQuery] PayrollStatus? status,
        [FromQuery] int? page,
        [FromQuery] int? pageSize)
    {
        if (page.HasValue && pageSize.HasValue)
        {
            var result = await _service.GetPagedPayrollReportAsync(month, year, branchId, staffId, position, status, page.Value, pageSize.Value);
            return Ok(new ApiResponse<object>(result));
        }
        else
        {
            var result = await _service.GetPayrollReportAsync(month, year, branchId, staffId, position, status);
            return Ok(new ApiResponse<object>(result));
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(Summary = "Xem lương cá nhân (Staff)")]
    public async Task<ApiResponse<List<PayrollRecordDto>>> GetMyPayroll([FromQuery] int? month, [FromQuery] int? year)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.GetMyPayrollAsync(userId, month, year);
        return new ApiResponse<List<PayrollRecordDto>>(result);
    }

    [HttpPost("approve-period")]
    [Authorize(Roles = AuthorizationRoles.GymOwnerOnly)]
    [SwaggerOperation(Summary = "Duyệt lương theo kỳ (Batch)", Description = "GymOwner duyệt toàn bộ Draft của tháng/năm. Gửi notification cho Staff.")]
    public async Task<ApiResponse<int>> ApprovePeriod(ApprovePayrollPeriodDto dto)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.ApprovePeriodAsync(dto, userId);
        return new ApiResponse<int>(result, $"Approved {result} payroll records.");
    }

    [HttpGet("export")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(Summary = "Xuất CSV lương")]
    public async Task<IActionResult> ExportCsv([FromQuery] int month, [FromQuery] int year, [FromQuery] Guid? branchId)
    {
        var csv = await _service.ExportPayrollCsvAsync(month, year, branchId);
        return File(Encoding.UTF8.GetBytes(csv), "text/csv", $"payroll_export_{month}_{year}.csv");
    }
}
