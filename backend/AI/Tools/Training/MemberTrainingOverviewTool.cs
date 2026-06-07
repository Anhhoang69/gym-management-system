using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Training;

/// <summary>
/// Returns a member's class booking and training history.
/// PT can only access members they have trained; BranchAdmin/Admin can see all.
/// Enforcement is in ClassService.GetMemberTrainingHistoryAsync.
/// </summary>
public class MemberTrainingOverviewTool : BaseAITool
{
    private readonly IClassService _classService;

    public MemberTrainingOverviewTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "get_member_training_overview";
    public override string Description => "Xem lịch sử tập luyện của một hội viên: các buổi đã tham gia, chuyên cần, ghi chú của PT.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "memberUserId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của hội viên cần xem lịch sử"
            }
          },
          "required": ["memberUserId"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.PT, StaffPosition.HeadPT, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var memberUserId = GetGuid(args, "memberUserId");
            if (memberUserId == null)
                return ToolResult.Fail("Vui lòng cung cấp memberUserId hợp lệ.");

            var history = await _classService.GetMemberTrainingHistoryAsync(memberUserId.Value, context.UserId);

            if (!history.Any())
                return ToolResult.Ok("Hội viên này chưa có lịch sử tập luyện.");

            var attended = history.Count(h => h.BookingStatus == backend.Enums.BookingStatus.Attended);
            var lines = history.Take(10).Select(h =>
                $"- {h.ClassTitle} | {h.Date:dd/MM} | {h.BookingStatus}{(string.IsNullOrEmpty(h.SessionNote) ? "" : $" | 📝 {h.SessionNote}")}");

            var summary =
                $"🏋️ **Lịch sử tập** ({history.Count} buổi, đã tham gia: {attended}):\n" +
                string.Join("\n", lines);

            return ToolResult.Ok(summary, history);
        }
        catch (UnauthorizedAccessException ex)
        {
            return ToolResult.Fail("Bạn không có quyền xem lịch sử tập của hội viên này.");
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
