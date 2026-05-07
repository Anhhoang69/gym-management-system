using backend.DTOs.AI;

namespace backend.Interfaces;

public interface IAIService
{
    Task<ChatResponseDto> HandleChatAsync(Guid memberId, ChatRequestDto request);
    Task<List<ChatResponseDto>> GetChatHistoryAsync(Guid memberId, int limit = 20);
    Task<List<AIPlanResultDto>> GetRecommendationsAsync(Guid memberId);
}
