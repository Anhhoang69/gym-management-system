using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Returns a PT's own teaching schedule.
/// PT only sees their classes (enforced by ClassService.GetScheduleAsync).
/// </summary>
public class MyTeachingScheduleTool : BaseAITool
{
    private readonly IClassService _classService;

    public MyTeachingScheduleTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "get_my_teaching_schedule";
    public override string Description => "Xem lịch dạy của PT: các buổi sắp tới, tên lớp, số học viên, phòng, giờ.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "startDate": {
              "type": "string",
              "format": "date",
              "description": "Từ ngày (YYYY-MM-DD). Để trống = hôm nay."
            },
            "endDate": {
              "type": "string",
              "format": "date",
              "description": "Đến ngày (YYYY-MM-DD)"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.PT, StaffPosition.HeadPT];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var startDate = GetDate(args, "startDate") ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var endDate = GetDate(args, "endDate");

            var schedule = await _classService.GetScheduleAsync(
                startDate, endDate, null,
                null, null, null, null, null,
                context.UserId);

            if (!schedule.Any())
                return ToolResult.Ok("Không có lịch dạy nào trong khoảng thời gian này.");

            var lines = schedule.Take(10).Select(c =>
                $"- {c.Title} | {c.Date:dd/MM} {c.StartTime}-{c.EndTime} | {c.RoomName} | {c.BookedCount}/{c.Capacity} HV");
            return ToolResult.Ok($"📋 **Lịch dạy** ({schedule.Count} buổi):\n" + string.Join("\n", lines), schedule);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
