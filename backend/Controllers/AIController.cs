using backend.AI;
using backend.DTOs.AI;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using static backend.Helpers.AuthorizationRoles;

namespace backend.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly AIToolRegistry _toolRegistry;

    public AIController(IAIService aiService, AIToolRegistry toolRegistry)
    {
        _aiService = aiService;
        _toolRegistry = toolRegistry;
    }

    [HttpPost("chat")]
    [SwaggerOperation(
        Summary = "Chat với AI Assistant",
        Description = "Gửi tin nhắn đến AI Assistant. Hỗ trợ mọi role: Member, Staff, GymOwner, SuperAdmin. " +
                      "Tools được lọc theo role của người dùng — LLM tự quyết định dùng tool nào."
    )]
    public async Task<ApiResponse<ChatResponseDto>> Chat([FromBody] ChatRequestDto request)
    {
        var userId = User.GetRequiredUserId();
        var result = await _aiService.HandleChatAsync(userId, request);
        return new ApiResponse<ChatResponseDto>(result, "Chat response generated");
    }

    [HttpGet("history")]
    [SwaggerOperation(
        Summary = "Lấy lịch sử chat",
        Description = "Lấy lịch sử chat của người dùng hiện tại. Mặc định 20 tin nhắn gần nhất."
    )]
    public async Task<ApiResponse<List<ChatResponseDto>>> GetHistory([FromQuery] int limit = 20)
    {
        var userId = User.GetRequiredUserId();
        var result = await _aiService.GetChatHistoryAsync(userId, limit);
        return new ApiResponse<List<ChatResponseDto>>(result, "Chat history retrieved");
    }

    [HttpGet("recommendations")]
    [Authorize(Roles = AuthorizationRoles.Member)]
    [SwaggerOperation(
        Summary = "Lấy các gợi ý AI đã lưu (Member only)",
        Description = "Lấy danh sách workout plan và nutrition advice đã được AI tạo và lưu. Chỉ dành cho hội viên."
    )]
    public async Task<ApiResponse<List<AIPlanResultDto>>> GetRecommendations()
    {
        var memberId = User.GetRequiredUserId();
        var result = await _aiService.GetRecommendationsAsync(memberId);
        return new ApiResponse<List<AIPlanResultDto>>(result, "Recommendations retrieved");
    }

    [HttpGet("tools")]
    [SwaggerOperation(
        Summary = "Khám phá tools khả dụng",
        Description = "Trả về danh sách AI tools mà người dùng hiện tại được phép sử dụng, " +
                      "dựa trên role và StaffPosition. Member sẽ không thấy admin tools."
    )]
    public async Task<IActionResult> GetAvailableTools()
    {
        var userId = User.GetRequiredUserId();
        var ctx    = await _aiService.BuildContextAsync(userId);

        // SECURITY: filtered by caller's role + staffPosition — Member never sees PayrollOverviewTool
        var tools = _toolRegistry.GetAvailableTools(ctx);

        var defs = tools.Select(t => new ToolDiscoveryDto
        {
            Name        = t.Name,
            Description = t.Description,
            Schema      = t.InputSchema
            // AllowedRoles/AllowedStaffPositions intentionally NOT exposed to callers
        });

        return Ok(defs);
    }

    [HttpGet("usage")]
    [Authorize(Roles = $"{SuperAdmin},{GymOwner}")]
    [SwaggerOperation(
        Summary = "Thống kê token AI (SuperAdmin/GymOwner)",
        Description = "Tổng token đã tiêu thụ, breakdown theo role người dùng, và chi phí ước tính (USD). " +
                      "Dùng gpt-4o-mini pricing: $0.15/1M prompt tokens + $0.60/1M completion tokens."
    )]
    public async Task<IActionResult> GetTokenUsage([FromQuery] int days = 30)
    {
        var stats = await _aiService.GetTokenStatsAsync(days);
        return Ok(stats);
    }
}
