using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Promotion;
using backend.Enums;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/promotions")]
[Authorize]
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
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin khuyến mãi",
        Description = "Cập nhật thông tin khuyến mãi theo ID. Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePromotion(Guid id, UpdatePromotionDto dto)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.UpdatePromotionAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion updated");
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái khuyến mãi",
        Description = "Thay đổi trạng thái của khuyến mãi (Active, Inactive). Ghi audit log. Chỉ dành cho admin/staff."
    )]
    public async Task<ApiResponse<bool>> UpdatePromotionStatus(
    Guid id,
    UpdatePromotionStatusDto dto)
    {
        var userId = User.GetRequiredUserId();

        var result = await _service.UpdatePromotionStatusAsync(
            id,
            dto.Status,
            userId);

        if (!result)
            return new ApiResponse<bool>("Promotion not found");

        return new ApiResponse<bool>(true, "Promotion status updated");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<bool>> DeletePromotion(Guid id)
    {
        var userId = User.GetRequiredUserId();

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