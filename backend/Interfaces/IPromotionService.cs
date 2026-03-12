using backend.DTOs.Promotion;

namespace backend.Interfaces;

public interface IPromotionService
{
    Task<List<PromotionDto>> GetPromotionsAsync(string? search, string? status, string? type);

    Task<PromotionDto?> GetPromotionAsync(Guid id);

    Task<bool> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto, Guid userId);

    Task<bool> DeactivatePromotionAsync(Guid id, Guid userId);

    Task<bool> DeletePromotionAsync(Guid id, Guid userId);

    Task<PromotionStatsDto> GetPromotionStatsAsync();
}