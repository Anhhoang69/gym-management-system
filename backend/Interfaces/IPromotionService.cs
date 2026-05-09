using backend.DTOs.Promotion;
using backend.Enums;

namespace backend.Interfaces;


public interface IPromotionService
{
    Task<List<PromotionListDto>> GetPromotionListAsync(string? search, PromotionStatus? status, string? type);

    Task<PromotionDto?> GetPromotionAsync(Guid id);

    Task<Guid> CreatePromotionAsync(CreatePromotionDto dto, Guid userId);

    Task<ValidatePromotionResultDto> ValidatePromotionConditionsAsync(ValidatePromotionDto dto);

    Task<bool> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto, Guid userId);

    Task<bool> UpdatePromotionStatusAsync(Guid id, PromotionStatus status, Guid userId);

    Task<bool> DeletePromotionAsync(Guid id, Guid userId);

    Task<PromotionStatsDto> GetPromotionStatsAsync();
}