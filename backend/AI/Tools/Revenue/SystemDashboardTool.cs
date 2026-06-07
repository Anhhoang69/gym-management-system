using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Revenue;

/// <summary>
/// System-wide KPI dashboard for SuperAdmin and GymOwner.
/// </summary>
public class SystemDashboardTool : BaseAITool
{
    private readonly IReportsService _reportsService;

    public SystemDashboardTool(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    public override string Name => "get_system_dashboard";
    public override string Description => "Xem dashboard KPI tổng quan: tổng hội viên, hợp đồng active, doanh thu tháng, leads mới, tỷ lệ chuyển đổi.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "branchId": {
              "type": "string",
              "format": "uuid",
              "description": "Lọc theo chi nhánh (tùy chọn, để trống = toàn hệ thống)"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var branchId = GetGuid(args, "branchId");
            var kpi = await _reportsService.GetKpiOverviewAsync(context.UserId, branchId);

            var summary =
                $"📈 **KPI Tổng quan**\n" +
                $"- Hội viên active: {kpi.ActiveMembersTotal}\n" +
                $"- Hội viên mới tháng này: {kpi.NewMembersMtd}\n" +
                $"- Doanh thu tháng này: {kpi.TotalRevenueMtd:N0} VNĐ\n" +
                $"- Tỷ lệ chuyển đổi leads: {kpi.LeadConversionRateMtd}%\n" +
                $"- Check-in hôm nay: {kpi.CheckInsTodayTotal}";

            return ToolResult.Ok(summary, kpi);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
