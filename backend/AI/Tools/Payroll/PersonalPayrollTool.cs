using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Payroll;

/// <summary>
/// Personal payroll and commission inquiry tool for staff members.
/// </summary>
public class PersonalPayrollTool : BaseAITool
{
    private readonly IPayrollService _payrollService;

    public PersonalPayrollTool(IPayrollService payrollService)
    {
        _payrollService = payrollService;
    }

    public override string Name => "get_personal_payroll";
    public override string Description => "Xem thông tin lương và hoa hồng cá nhân của bạn theo tháng/năm.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "month": { "type": "integer", "minimum": 1, "maximum": 12 },
            "year":  { "type": "integer" }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => []; // Empty means allowed for all positions

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var month = GetInt(args, "month") ?? now.Month;
            var year = GetInt(args, "year") ?? now.Year;

            var records = await _payrollService.GetMyPayrollAsync(context.UserId, month, year);

            if (!records.Any())
                return ToolResult.Ok($"Bạn chưa có thông tin bảng lương nào cho kỳ tháng {month}/{year}.");

            var r = records.First();
            var summary = $"📋 **Thông tin lương & hoa hồng cá nhân {month}/{year}**:\n" +
                          $"- Lương cơ bản: {r.BaseSalary:N0} VNĐ\n";

            if (r.SessionCount > 0)
            {
                summary += $"- Số buổi đã dạy: {r.SessionCount} buổi\n" +
                           $"- Hoa hồng dạy học: {r.SessionCommission:N0} VNĐ\n";
            }

            if (r.KpiBonus > 0)
            {
                summary += $"- Thưởng KPI dạy học: {r.KpiBonus:N0} VNĐ\n";
            }

            if (r.SalesCommission > 0)
            {
                summary += $"- Hoa hồng bán hàng: {r.SalesCommission:N0} VNĐ\n";
            }

            summary += $"- Tổng lương thực nhận (NET): {r.TotalSalary:N0} VNĐ\n" +
                       $"- Trạng thái: {r.Status}";

            return ToolResult.Ok(summary, r);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
