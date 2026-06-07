using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Revenue;

/// <summary>
/// Branch-scoped revenue report. BranchAdmin is automatically scoped to their branch.
/// </summary>
public class BranchRevenueTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public BranchRevenueTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_branch_revenue";
    public override string Description => "Xem báo cáo doanh thu chi nhánh: tổng doanh thu, so sánh tháng trước, doanh thu theo gói tập.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var query = new ReportQueryDto
            {
                BranchId = context.BranchId,   // BranchAdmin always scoped to own branch
                Month = GetInt(args, "month") ?? now.Month,
                Year = GetInt(args, "year") ?? now.Year
            };

            var report = await _reportsService.GetRevenueReportAsync(query, context.UserId);

            var summary =
                $"💰 **Doanh thu {query.Month}/{query.Year}**\n" +
                $"- Tổng doanh thu: {report.TotalRevenue:N0} VNĐ\n" +
                $"- Số hóa đơn: {report.TotalInvoices}\n" +
                $"- Doanh thu trung bình/HN: {report.AverageRevenuePerInvoice:N0} VNĐ";

            return ToolResult.Ok(summary, report);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
