using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Membership;

/// <summary>
/// Retrieves the caller's current membership info: active contract, sessions, expiry.
/// Delegates to GymDataService — no business logic duplicated here.
/// </summary>
public class GetMembershipTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public GetMembershipTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "get_membership_info";
    public override string Description => "Xem thông tin gói tập hiện tại của hội viên: tên gói, ngày hết hạn, số buổi PT còn lại, số buổi nhóm còn lại.";
    public override JsonElement InputSchema => EmptySchema();
    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var info = await _gymDataService.GetMembershipInfoAsync(context.UserId);
            return ToolResult.Ok(info);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
