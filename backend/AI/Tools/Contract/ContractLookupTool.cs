using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.DTOs.Contract;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;

namespace backend.AI.Tools.Contract;

/// <summary>
/// Contract lookup tool for Sales/Receptionist/BranchAdmin to find contracts by member.
/// </summary>
public class ContractLookupTool : BaseAITool
{
    private readonly IContractService _contractService;

    public ContractLookupTool(IContractService contractService)
    {
        _contractService = contractService;
    }

    public override string Name => "contract_lookup";
    public override string Description => "Tra cứu hợp đồng của hội viên: trạng thái, gói tập, ngày hiệu lực, số tiền.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "memberId": {
              "type": "string",
              "format": "uuid",
              "description": "ID của hội viên cần tra cứu hợp đồng"
            },
            "status": {
              "type": "string",
              "enum": ["Pending", "Active", "Cancelled", "Expired"],
              "description": "Lọc theo trạng thái hợp đồng"
            }
          }
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Sales, StaffPosition.Receptionist, StaffPosition.BranchAdmin];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var memberId = GetGuid(args, "memberId");
            var statusStr = GetString(args, "status");
            ContractStatus? status = statusStr != null && Enum.TryParse<ContractStatus>(statusStr, out var s) ? s : null;

            var query = new ContractQueryDto
            {
                MemberId = memberId,
                Status = status,
                Page = 1,
                PageSize = 10
            };

            var result = await _contractService.GetContractsAsync(query, context.UserId);

            if (!result.Items.Any())
                return ToolResult.Ok("Không tìm thấy hợp đồng phù hợp.");

            var lines = result.Items.Select(c =>
                $"- [{c.Status}] {c.PackageName} | {c.StartDate:dd/MM/yyyy} → {c.EndDate:dd/MM/yyyy} | {c.DealPrice:N0} VNĐ");

            var summary =
                $"📄 **Hợp đồng** ({result.TotalItems} tổng):\n" +
                string.Join("\n", lines);

            return ToolResult.Ok(summary, result);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
