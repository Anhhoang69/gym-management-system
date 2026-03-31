using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Lead;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/lead-sources")]
public class LeadSourceController : ControllerBase
{
    private readonly ILeadSourceService _service;

    public LeadSourceController(ILeadSourceService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Lấy danh sách nguồn lead", Description = "Lấy danh sách các LeadSource đang có")]
    public async Task<ApiResponse<List<LeadSourceDto>>> GetSources()
    {
        var result = await _service.GetSourcesAsync();
        return new ApiResponse<List<LeadSourceDto>>(result);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Tạo nguồn lead", Description = "Tạo mới LeadSource (admin)")]
    public async Task<ApiResponse<LeadSourceDto>> CreateSource(LeadSourceUpsertDto dto)
    {
        var result = await _service.CreateSourceAsync(dto);
        return new ApiResponse<LeadSourceDto>(result, "Lead source created successfully");
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Cập nhật nguồn lead", Description = "Cập nhật thông tin LeadSource (admin)")]
    public async Task<ApiResponse<LeadSourceDto?>> UpdateSource(Guid id, LeadSourceUpsertDto dto)
    {
        var result = await _service.UpdateSourceAsync(id, dto);

        if (result == null)
            return new ApiResponse<LeadSourceDto?>("Lead source not found");

        return new ApiResponse<LeadSourceDto?>(result, "Lead source updated successfully");
    }
}
