using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Attendance;

/// <summary>
/// Looks up check-in records at a branch for a given date.
/// Used by Receptionist for daily attendance verification.
/// </summary>
public class CheckinLookupTool : BaseAITool
{
    private readonly IAttendanceService _attendanceService;

    public CheckinLookupTool(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    public override string Name => "checkin_lookup";
    public override string Description => "Tra cứu danh sách check-in tại chi nhánh theo ngày. Hỗ trợ xem hội viên nào đang có mặt hôm nay.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "branchId": {
              "type": "string",
              "format": "uuid",
              "description": "ID chi nhánh cần tra cứu"
            },
            "date": {
              "type": "string",
              "format": "date",
              "description": "Ngày cần tra cứu (YYYY-MM-DD). Để trống = hôm nay."
            }
          },
          "required": ["branchId"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Receptionist, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            // BranchAdmin scoped to own branch automatically
            var branchId = context.StaffPosition == StaffPosition.BranchAdmin && context.BranchId.HasValue
                ? context.BranchId.Value
                : GetGuid(args, "branchId") ?? context.BranchId ?? Guid.Empty;

            var date = GetDate(args, "date") ?? DateOnly.FromDateTime(DateTime.UtcNow);

            var records = await _attendanceService.GetBranchAttendanceAsync(branchId, date);

            if (!records.Any())
                return ToolResult.Ok($"Không có check-in nào vào ngày {date:dd/MM/yyyy}.");

            var checkedIn = records.Where(r => r.CheckoutAt == null).ToList();
            var checkedOut = records.Where(r => r.CheckoutAt != null).ToList();

            var summary =
                $"📍 **Check-in ngày {date:dd/MM/yyyy}** — {records.Count} lượt\n" +
                $"- Đang ở phòng gym: {checkedIn.Count}\n" +
                $"- Đã ra về: {checkedOut.Count}\n\n" +
                string.Join("\n", records.Take(15).Select(r =>
                    $"- {r.MemberName} | {r.CheckinAt:HH:mm}{(r.CheckoutAt.HasValue ? $" → {r.CheckoutAt:HH:mm}" : " (còn trong gym)")}"));

            return ToolResult.Ok(summary, records);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
