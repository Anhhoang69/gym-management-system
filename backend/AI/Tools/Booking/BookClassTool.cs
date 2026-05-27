using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Books a class for the calling member.
/// Delegates to ClassService — quota, conflict, and capacity checks are done there.
/// </summary>
public class BookClassTool : BaseAITool
{
    private readonly IClassService _classService;

    public BookClassTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "book_class";

    public override string Description =>
        "Đặt lịch tham gia một lớp học. Cần biết classId của lớp muốn đặt.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "classId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của lớp học muốn đặt"
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

            await _classService.BookClassAsync(classId.Value, context.UserId);
            return ToolResult.Ok("✅ Đặt lịch thành công! Lớp học đã được thêm vào lịch của bạn.");
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
