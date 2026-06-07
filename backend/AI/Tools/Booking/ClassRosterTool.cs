using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Returns the class roster (list of booked members) for a specific class.
/// PT sees only their own classes; BranchAdmin and above see any class.
/// </summary>
public class ClassRosterTool : BaseAITool
{
    private readonly IClassService _classService;

    public ClassRosterTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "get_class_roster";
    public override string Description => "Xem danh sách học viên đã đặt lịch cho một lớp học cụ thể.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "classId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của lớp học"
            }
          },
          "required": ["classId"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.PT, StaffPosition.HeadPT, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var classId = GetGuid(args, "classId");
            if (classId == null)
                return ToolResult.Fail("Vui lòng cung cấp classId hợp lệ.");

            var members = await _classService.GetClassMembersAsync(classId.Value, context.UserId);

            if (!members.Any())
                return ToolResult.Ok("Chưa có học viên nào đăng ký lớp này.");

            var lines = members.Select((m, i) => $"{i + 1}. {m.MemberName} | {m.BookingStatus}");
            return ToolResult.Ok($"👥 **Danh sách lớp** ({members.Count} học viên):\n" + string.Join("\n", lines), members);
        }
        catch (UnauthorizedAccessException ex)
        {
            return ToolResult.Fail(ex.Message);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
