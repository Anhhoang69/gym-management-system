using System.Text.Json;
using backend.AI.Core;
using backend.AI.Tools;
using backend.Data;
using backend.Enums;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.AI.Tools.Analytics;

/// <summary>
/// Member lookup tool for front-desk staff — search by name, phone, or email.
/// </summary>
public class MemberLookupTool : BaseAITool
{
    private readonly ApplicationDbContext _context;

    public MemberLookupTool(ApplicationDbContext context)
    {
        _context = context;
    }

    public override string Name => "member_lookup";
    public override string Description => "Tìm kiếm hội viên theo tên, số điện thoại hoặc email. Dùng cho nhân viên lễ tân tra cứu thông tin.";

    public override JsonElement InputSchema => BuildSchema("""
        {
          "type": "object",
          "properties": {
            "search": {
              "type": "string",
              "description": "Từ khóa tìm kiếm: tên, số điện thoại, hoặc email"
            }
          },
          "required": ["search"]
        }
        """);

    public override string[] AllowedRoles => [AuthorizationRoles.Staff, AuthorizationRoles.SuperAdmin, AuthorizationRoles.GymOwner];
    public override StaffPosition[] AllowedStaffPositions => [StaffPosition.Receptionist, StaffPosition.BranchAdmin, StaffPosition.Sales];

    public override async Task<ToolResult> ExecuteAsync(
        JsonElement args, ToolExecutionContext context, CancellationToken ct = default)
    {
        try
        {
            var search = GetString(args, "search")?.Trim();
            if (string.IsNullOrWhiteSpace(search))
                return ToolResult.Fail("Vui lòng cung cấp từ khóa tìm kiếm.");

            var keyword = $"%{search}%";
            var members = await _context.Users
                .Include(u => u.Member)
                .Where(u => u.Member != null && (
                    EF.Functions.ILike(u.FullName ?? "", keyword) ||
                    EF.Functions.ILike(u.PhoneNumber ?? "", keyword) ||
                    EF.Functions.ILike(u.Email ?? "", keyword)))
                .Take(10)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.PhoneNumber,
                    u.Email
                })
                .ToListAsync(ct);

            if (!members.Any())
                return ToolResult.Ok($"Không tìm thấy hội viên nào khớp với '{search}'.");

            var lines = members.Select(m =>
                $"- {m.FullName} | 📞 {m.PhoneNumber} | ✉️ {m.Email} | ID: {m.Id}");
            return ToolResult.Ok($"🔍 **Kết quả tìm kiếm** ({members.Count}):\n" + string.Join("\n", lines), members);
        }
        catch (Exception ex)
        {
            return ToolResult.Fail(ex.Message);
        }
    }
}
