using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Promotion;
using backend.Helpers;
using backend.Interfaces;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/promotions")]
public class PromotionController : ControllerBase
{
    private readonly IPromotionService _service;

    public PromotionController(IPromotionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ApiResponse<List<PromotionDto>>> GetPromotions(
        string? search,
        string? status,
        string? type)
    {
        var result = await _service.GetPromotionsAsync(search, status, type);

        return new ApiResponse<List<PromotionDto>>(result);
    }

    [HttpGet("stats")]
    public async Task<ApiResponse<PromotionStatsDto>> GetStats()
    {
        var result = await _service.GetPromotionStatsAsync();

        return new ApiResponse<PromotionStatsDto>(result);
    }

    [HttpGet("{id}")]
    public async Task<ApiResponse<PromotionDto?>> GetPromotion(Guid id)
    {
        var result = await _service.GetPromotionAsync(id);

        if (result == null)
            return new ApiResponse<PromotionDto?>("Promotion not found");

        return new ApiResponse<PromotionDto?>(result);
    }

    [HttpPut("{id}")]
    public async Task<ApiResponse<bool>> UpdatePromotion(Guid id, UpdatePromotionDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePromotionAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion updated");
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<ApiResponse<bool>> DeactivatePromotion(Guid id)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.DeactivatePromotionAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion deactivated");
    }

    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> DeletePromotion(Guid id)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        try
        {
            var result = await _service.DeletePromotionAsync(id, userId);

            if (!result)
                return new ApiResponse<bool>("Promotion not found");

            return new ApiResponse<bool>(true, "Promotion deleted");
        }
        catch (Exception ex)
        {
            return new ApiResponse<bool>(ex.Message);
        }
    }
}