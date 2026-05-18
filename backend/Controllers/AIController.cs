using backend.DTOs.AI;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("chat")]
    [SwaggerOperation(
        Summary = "Chat với AI Assistant",
        Description = "Gửi tin nhắn đến AI fitness assistant. AI sẽ tự động phân loại intent (membership, schedule, fitness, ...) và trả lời phù hợp."
    )]
    public async Task<ApiResponse<ChatResponseDto>> Chat([FromBody] ChatRequestDto request)
    {
        var memberId = User.GetRequiredUserId();
        var result = await _aiService.HandleChatAsync(memberId, request);
        return new ApiResponse<ChatResponseDto>(result, "Chat response generated");
    }

    [HttpGet("history")]
    [SwaggerOperation(
        Summary = "Lấy lịch sử chat",
        Description = "Lấy lịch sử chat với AI. Mặc định 20 tin nhắn gần nhất."
    )]
    public async Task<ApiResponse<List<ChatResponseDto>>> GetHistory([FromQuery] int limit = 20)
    {
        var memberId = User.GetRequiredUserId();
        var result = await _aiService.GetChatHistoryAsync(memberId, limit);
        return new ApiResponse<List<ChatResponseDto>>(result, "Chat history retrieved");
    }

    [HttpGet("recommendations")]
    [SwaggerOperation(
        Summary = "Lấy các gợi ý AI đã lưu",
        Description = "Lấy danh sách workout plan và nutrition advice đã được AI tạo và lưu lại."
    )]
    public async Task<ApiResponse<List<AIPlanResultDto>>> GetRecommendations()
    {
        var memberId = User.GetRequiredUserId();
        var result = await _aiService.GetRecommendationsAsync(memberId);
        return new ApiResponse<List<AIPlanResultDto>>(result, "Recommendations retrieved");
    }
}
