using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Promotion;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using System.Security.Claims;
using Swashbuckle.AspNetCore.Annotations;

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
    public async Task<ApiResponse<List<PromotionListDto>>> GetPromotions(
        string? search,
        PromotionStatus? status,
        string? type)
    {
        var result = await _service.GetPromotionListAsync(search, status, type);
        return new ApiResponse<List<PromotionListDto>>(result);
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
    [SwaggerOperation(
        Summary = "Cập nhật thông tin khuyến mãi",
        Description = "Cập nhật thông tin khuyến mãi theo ID. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePromotion(Guid id, UpdatePromotionDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePromotionAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion updated");
    }

    [HttpPatch("{id}/status")]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái khuyến mãi",
        Description = "Thay đổi trạng thái của khuyến mãi (Active, Inactive). Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePromotionStatus(
    Guid id,
    UpdatePromotionStatusDto dto)
    {
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");

        var result = await _service.UpdatePromotionStatusAsync(
            id,
            dto.Status,
            userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion status updated");
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