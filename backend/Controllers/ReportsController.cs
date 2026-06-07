using backend.DTOs.Dashboard;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _service;

    public ReportsController(IReportsService service)
    {
        _service = service;
    }

    [HttpGet("overview")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Xem KPI tổng quan (Dashboard)",
        Description = "Lấy các chỉ số KPI nhẹ (không bao gồm biểu đồ) hiển thị trang đầu của Dashboard. SuperAdmin/GymOwner xem toàn hệ thống. Staff xem theo nhánh của mình."
    )]
    public async Task<ApiResponse<KpiOverviewDto>> GetKpiOverview([FromQuery] Guid? branchId)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _service.GetKpiOverviewAsync(callerUserId, branchId);
        return new ApiResponse<KpiOverviewDto>(result);
    }

    [HttpGet("revenue")]
    [Authorize(Roles = AuthorizationRoles.SuperAdmin + "," + AuthorizationRoles.GymOwner + "," + AuthorizationRoles.Staff)]
    [SwaggerOperation(
        Summary = "Báo cáo Doanh Thu",
        Description = "Trả về dữ liệu báo cáo doanh thu với các breakdown (theo gói, theo chi nhánh, theo tháng) dựa trên Invoices đã thanh toán. Chỉ BranchAdmin, GymOwner, SuperAdmin được phép gọi."
    )]
    public async Task<ApiResponse<RevenueReportDto>> GetRevenueReport([FromQuery] ReportQueryDto query)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _service.GetRevenueReportAsync(query, callerUserId);
        return new ApiResponse<RevenueReportDto>(result);
    }

    [HttpGet("sales-funnel")]
    [Authorize(Roles = AuthorizationRoles.SuperAdmin + "," + AuthorizationRoles.GymOwner + "," + AuthorizationRoles.Staff)]
    [SwaggerOperation(
        Summary = "Báo cáo Sales Funnel & Renewal",
        Description = "Báo cáo phễu chuyển đổi Leads, bao gồm performance của từng Sales Staff và tỷ lệ gia hạn. Sales Staff chỉ thấy lead do mình phụ trách."
    )]
    public async Task<ApiResponse<SalesFunnelReportDto>> GetSalesFunnelReport([FromQuery] ReportQueryDto query)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _service.GetSalesFunnelReportAsync(query, callerUserId);
        return new ApiResponse<SalesFunnelReportDto>(result);
    }

    [HttpGet("pt-performance")]
    [Authorize(Roles = AuthorizationRoles.SuperAdmin + "," + AuthorizationRoles.GymOwner + "," + AuthorizationRoles.Staff)]
    [SwaggerOperation(
        Summary = "Báo cáo PT Performance",
        Description = "Báo cáo hiệu suất của PT dựa trên số buổi đã dạy (ClassBookings.Attended). PT Staff chỉ thấy dữ liệu cá nhân mình."
    )]
    public async Task<ApiResponse<List<PtPerformanceReportDto>>> GetPtPerformanceReport([FromQuery] ReportQueryDto query)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _service.GetPtPerformanceReportAsync(query, callerUserId);
        return new ApiResponse<List<PtPerformanceReportDto>>(result);
    }

    [HttpGet("check-in")]
    [Authorize(Roles = AuthorizationRoles.SuperAdmin + "," + AuthorizationRoles.GymOwner + "," + AuthorizationRoles.Staff)]
    [SwaggerOperation(
        Summary = "Báo cáo Check-in & Traffic",
        Description = "Báo cáo lượt check-in theo ngày và theo giờ. Giúp xác định Peak hour của phòng tập."
    )]
    public async Task<ApiResponse<CheckInReportDto>> GetCheckInReport([FromQuery] ReportQueryDto query)
    {
        var callerUserId = User.GetRequiredUserId();
        var result = await _service.GetCheckInReportAsync(query, callerUserId);
        return new ApiResponse<CheckInReportDto>(result);
    }

    [HttpGet("export/{reportType}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Xuất dữ liệu báo cáo ra CSV",
        Description = "Tải file CSV cho reportType. Cung cấp các params lọc y hệt các API report ở trên. reportType có thể là: 'revenue', 'sales-funnel', 'pt-performance', 'check-in'."
    )]
    public async Task<IActionResult> ExportCsv(string reportType, [FromQuery] ReportQueryDto query)
    {
        var callerUserId = User.GetRequiredUserId();
        var csvContent = await _service.ExportCsvAsync(reportType, query, callerUserId);
        
        var fileName = $"{reportType}_report_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
        return File(Encoding.UTF8.GetBytes(csvContent), "text/csv", fileName);
    }
}
