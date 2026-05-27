using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Analytics;

/// <summary>
/// PT performance report — sessions taught, attendance rate, ratings.
/// HeadPT sees all PTs in branch; BranchAdmin and above see full branch/global.
/// </summary>
public class PTPerformanceTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public PTPerformanceTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_pt_performance";
    public override string Description => "Xem báo cáo hiệu suất PT: số buổi dạy, tỷ lệ học viên tham dự, top PT trong tháng.";

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
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.HeadPT, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var query = new ReportQueryDto
            {
                BranchId = context.BranchId ?? GetGuid(args, "branchId"),
                Month = GetInt(args, "month") ?? now.Month,
                Year = GetInt(args, "year") ?? now.Year
            };

            var report = await _reportsService.GetPtPerformanceReportAsync(query, context.UserId);

            if (!report.Any())
                return ToolResult.Ok("Không có dữ liệu PT trong khoảng thời gian này.");

            var lines = report.Select(r =>
                $"- {r.PtName}: {r.TotalSessions} buổi | {r.TotalMembers} HV");
            var summary = $"🏅 **Hiệu suất PT {query.Month}/{query.Year}** ({report.Count} PT):\n" +
                          string.Join("\n", lines);

            return ToolResult.Ok(summary, report);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
