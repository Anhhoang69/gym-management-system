using backend.AI.Core;
using backend.DTOs.AI;

namespace backend.Interfaces;

public interface IAIService
{
    /// <summary>
    /// Handle a chat message from any authenticated user (Member, Staff, Admin).
    /// Role and tools are resolved internally from userId.
    /// </summary>
    Task<ChatResponseDto> HandleChatAsync(Guid userId, ChatRequestDto request);

    /// <summary>Returns recent chat history for the calling user.</summary>
    Task<List<ChatResponseDto>> GetChatHistoryAsync(Guid userId, int limit = 20);

    /// <summary>Returns AI fitness recommendations — Member only.</summary>
    Task<List<AIPlanResultDto>> GetRecommendationsAsync(Guid memberId);

    /// <summary>
    /// Builds a ToolExecutionContext for the given userId.
    /// Exposed so AIController can pass it to AIToolRegistry for /tools discovery.
    /// </summary>
    Task<ToolExecutionContext> BuildContextAsync(Guid userId);
}
