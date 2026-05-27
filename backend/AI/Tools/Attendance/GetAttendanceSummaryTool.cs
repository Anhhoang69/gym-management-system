using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Attendance;

/// <summary>
/// Returns the calling member's attendance summary and history.
/// </summary>
public class GetAttendanceSummaryTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public GetAttendanceSummaryTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "get_attendance_summary";
    public override string Description => "Xem lịch sử điểm danh, tần suất tập luyện, và thống kê check-in của hội viên.";
    public override JsonElement InputSchema => EmptySchema();
    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var info = await _gymDataService.GetAttendanceInfoAsync(context.UserId);
            return ToolResult.Ok(info);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
