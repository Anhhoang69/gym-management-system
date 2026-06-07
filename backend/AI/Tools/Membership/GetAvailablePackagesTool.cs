using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Services;

namespace backend.AI.Tools.Membership;

/// <summary>
/// Returns the gym's active membership packages.
/// Used when a member asks "what packages are available?" or wants to upgrade.
/// </summary>
public class GetAvailablePackagesTool : BaseAITool
{
    private readonly GymDataService _gymDataService;

    public GetAvailablePackagesTool(GymDataService gymDataService)
    {
        _gymDataService = gymDataService;
    }

    public override string Name => "get_available_packages";
    public override string Description => "Xem danh sách các gói tập đang có hiệu lực, bao gồm tên, giá, thời hạn, số buổi PT và nhóm.";
    public override JsonElement InputSchema => EmptySchema();
    public override string[] AllowedRoles => [AuthorizationRoles.Member];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var info = await _gymDataService.GetPackageInfoAsync();
            return ToolResult.Ok(info);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
