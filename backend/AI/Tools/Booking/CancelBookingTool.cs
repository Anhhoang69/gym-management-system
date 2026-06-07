using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Cancels a class booking for the calling member.
/// </summary>
public class CancelBookingTool : BaseAITool
{
    private readonly IClassService _classService;

    public CancelBookingTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "cancel_booking";

    public override string Description =>
        "Hủy đặt lịch một lớp học. Cần biết classId của lớp muốn hủy.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "classId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của lớp học muốn hủy"
            },
            "cancelReason": {
              "type": "string",
              "description": "Lý do hủy (tùy chọn)"
            }
          },
          "required": ["classId"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var classId = GetGuid(args, "classId");
            if (classId == null)
                return ToolResult.Fail("Vui lòng cung cấp classId hợp lệ.");

            var reason = GetString(args, "cancelReason") ?? "Hủy qua AI Assistant";
            await _classService.CancelBookingAsync(classId.Value, context.UserId, reason);
            return ToolResult.Ok("✅ Đã hủy đặt lịch thành công.");
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
