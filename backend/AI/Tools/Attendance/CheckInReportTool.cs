using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Attendance;

/// <summary>
/// Check-in statistical report — trend over a period for BranchAdmin.
/// </summary>
public class CheckInReportTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public CheckInReportTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_checkin_report";
    public override string Description => "Xem báo cáo thống kê check-in: tổng lượt, trung bình ngày, giờ cao điểm, theo tháng/năm.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" },
            "branchId": { "type": "string", "format": "uuid" }
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
            var branchId = context.BranchId ?? GetGuid(args, "branchId");
            var now = DateTime.UtcNow;
            var query = new ReportQueryDto
            {
                BranchId = branchId,
                Month = GetInt(args, "month") ?? now.Month,
                Year = GetInt(args, "year") ?? now.Year
            };

            var report = await _reportsService.GetCheckInReportAsync(query, context.UserId);

            var summary =
                $"📊 **Báo cáo Check-in {query.Month}/{query.Year}**\n" +
                $"- Tổng lượt check-in: {report.TotalCheckIns}\n" +
                $"- Hội viên độc nhất: {report.UniqueMembers}\n" +
                $"- Ngày cao nhất: {report.PeakDay?.ToString("dd/MM") ?? "N/A"}\n" +
                $"- Giờ cao điểm: {(report.PeakHour.HasValue ? $"{report.PeakHour}h" : "N/A")}";

            return ToolResult.Ok(summary, report);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
