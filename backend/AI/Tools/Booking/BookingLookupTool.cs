using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Looks up bookings for a specific member. Used by Receptionist for front-desk queries.
/// </summary>
public class BookingLookupTool : BaseAITool
{
    private readonly IClassService _classService;

    public BookingLookupTool(IClassService classService)
    {
        _classService = classService;
    }

    public override string Name => "booking_lookup";
    public override string Description => "Tra cứu danh sách các lớp học đã đặt của một hội viên cụ thể.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "memberUserId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của hội viên cần tra cứu"
            }
          },
          "required": ["memberUserId"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Receptionist, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var memberUserId = GetGuid(args, "memberUserId");
            if (memberUserId == null)
                return ToolResult.Fail("Vui lòng cung cấp memberUserId hợp lệ.");

            var bookings = await _classService.GetMyBookingsAsync(memberUserId.Value);

            if (!bookings.Any())
                return ToolResult.Ok("Hội viên này chưa có đặt lịch nào.");

            var lines = bookings.Take(10).Select(b =>
                $"- {b.Title} | {b.Date:dd/MM} {b.StartTime} | {b.BookingStatus}");
            return ToolResult.Ok($"📅 **Bookings** ({bookings.Count} tổng):\n" + string.Join("\n", lines), bookings);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
