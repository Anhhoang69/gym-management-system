using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Lead;

/// <summary>
/// Lead statistics summary — available to Sales staff and BranchAdmin.
/// </summary>
public class GetLeadSummaryTool : BaseAITool
{
    private readonly ILeadService _leadService;

    public GetLeadSummaryTool(ILeadService leadService)
    {
        _leadService = leadService;
    }

    public override string Name => "get_lead_summary";
    public override string Description => "Xem thống kê tổng quan về leads: số lượng mới, đã liên hệ, qualified, converted, lost, tỷ lệ chuyển đổi.";
    public override JsonElement InputSchema => EmptySchema();
    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Sales, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var stats = await _leadService.GetLeadStatsAsync();
            var summary =
                $"📊 **Thống kê Leads**\n" +
                $"- Tổng: {stats.TotalLeads}\n" +
                $"- Mới: {stats.NewLeads}\n" +
                $"- Đã liên hệ: {stats.ContactedLeads}\n" +
                $"- Qualified: {stats.QualifiedLeads}\n" +
                $"- Converted: {stats.ConvertedLeads}\n" +
                $"- Lost: {stats.LostLeads}\n" +
                $"- Hôm nay: {stats.LeadsCreatedToday}\n" +
                $"- Tháng này: {stats.LeadsCreatedThisMonth}\n" +
                $"- Tỷ lệ chuyển đổi: {stats.ConversionRate}%\n" +
                $"- Tỷ lệ liên hệ: {stats.ContactRate}%";

            return ToolResult.Ok(summary, stats);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
