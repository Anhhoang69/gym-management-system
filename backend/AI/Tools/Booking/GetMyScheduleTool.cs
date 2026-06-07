using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Booking;

/// <summary>
/// Returns the member's upcoming booked class schedule.
/// </summary>
public class GetMyScheduleTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public GetMyScheduleTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "get_my_schedule";
    public override string Description => "Xem lịch tập đã đặt của hội viên: các buổi sắp tới, tên lớp, HLV, phòng, giờ.";
    public override JsonElement InputSchema => EmptySchema();
    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var info = await _gymDataService.GetScheduleInfoAsync(context.UserId);
            return ToolResult.Ok(info);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
