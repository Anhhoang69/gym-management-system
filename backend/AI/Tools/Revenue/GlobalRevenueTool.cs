using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Revenue;

/// <summary>
/// Global revenue report across all branches — SuperAdmin and GymOwner only.
/// </summary>
public class GlobalRevenueTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public GlobalRevenueTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_global_revenue";
    public override string Description => "Xem doanh thu toàn hệ thống: tổng doanh thu tất cả chi nhánh, so sánh theo tháng, top chi nhánh doanh thu cao nhất.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" },
            "branchId": {
              "type": "string",
              "format": "uuid",
              "description": "Lọc theo chi nhánh cụ thể (tùy chọn)"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [];  // no position restriction — these are not Staff

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var query = new ReportQueryDto
            {
                BranchId = GetGuid(args, "branchId"),   // null = global
                Month = GetInt(args, "month") ?? now.Month,
                Year = GetInt(args, "year") ?? now.Year
            };

            var report = await _reportsService.GetRevenueReportAsync(query, context.UserId);

            var summary =
                $"🌐 **Doanh thu toàn hệ thống {query.Month}/{query.Year}**\n" +
                $"- Tổng doanh thu: {report.TotalRevenue:N0} VNĐ\n" +
                $"- Số hóa đơn: {report.TotalInvoices}\n" +
                $"- Doanh thu TB/Hóa đơn: {report.AverageRevenuePerInvoice:N0} VNĐ";

            return ToolResult.Ok(summary, report);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
