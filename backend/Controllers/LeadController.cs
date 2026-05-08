using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Lead;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/leads")]
[Authorize(Roles = AuthorizationRoles.LeadManagementRoles)]
public class LeadController : ControllerBase
{
    private readonly ILeadService _service;

    public LeadController(ILeadService service)
    {
        _service = service;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Lấy danh sách lead",
        Description = "Lấy danh sách lead theo phân trang. Hỗ trợ lọc theo từ khóa (tên, sđt, email), trạng thái, nguồn lead, chi nhánh, sales phụ trách, khoảng điểm và khoảng ngày tạo."
    )]
    public async Task<ApiResponse<PagedResult<LeadListDto>>> GetLeads([FromQuery] LeadListQueryDto query)
    {
        var result = await _service.GetLeadListAsync(query);
        return new ApiResponse<PagedResult<LeadListDto>>(result);
    }

    [HttpGet("stats")]
    [SwaggerOperation(
        Summary = "Lấy thống kê dashboard lead",
        Description = "Trả về số liệu tổng quan cho dashboard lead, bao gồm tổng số lead, breakdown theo trạng thái, KPI theo thời gian và top nguồn lead."
    )]
    public async Task<ApiResponse<LeadStatsDto>> GetStats()
    {
        var result = await _service.GetLeadStatsAsync();
        return new ApiResponse<LeadStatsDto>(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Lấy chi tiết lead", Description = "Lấy chi tiết lead theo id")]
    public async Task<ApiResponse<LeadDto?>> GetLead(Guid id)
    {
        var result = await _service.GetLeadAsync(id);
        if (result == null) return new ApiResponse<LeadDto?>("Lead not found");
        return new ApiResponse<LeadDto?>(result);
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Tạo mới khách hàng tiềm năng",
        Description = "Actors: Sales, Super Admin, Branch Admin. Cho phép tạo mới Lead với thông tin cơ bản. Lead sẽ được tự động gán cho nhân viên Sales hiện tại hoặc theo quy tắc phân phối."
    )]
    public async Task<ApiResponse<LeadDto>> CreateLead(CreateLeadDto dto)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.CreateLeadAsync(dto, currentUserId);
        return new ApiResponse<LeadDto>(result, "Lead created successfully");
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Cập nhật thông tin lead",
        Description = "Actors: Sales, Super Admin, Branch Admin. Cập nhật các thông tin cơ bản của lead."
    )]
    public async Task<ApiResponse<LeadDto>> UpdateLead(Guid id, UpdateLeadDto dto)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.UpdateLeadAsync(id, dto, currentUserId);
        return new ApiResponse<LeadDto>(result, "Lead updated successfully");
    }

    [HttpPatch("{id}/status")]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái lead",
        Description = "Actors: Sales, Super Admin, Branch Admin. Cập nhật trạng thái lead. Nếu status là Lost thì bắt buộc có lý do mất lead. Nếu status là Contacted thì hệ thống tự động cập nhật thời điểm liên hệ gần nhất và tăng số lần liên hệ."
    )]
    public async Task<ApiResponse<LeadDto>> UpdateLeadStatus(Guid id, UpdateLeadStatusDto dto)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.UpdateLeadStatusAsync(id, dto, currentUserId);
        return new ApiResponse<LeadDto>(result, "Lead status updated successfully");
    }

    [HttpPost("{id}/contact")]
    [SwaggerOperation(
        Summary = "Đánh dấu lead đã được liên hệ/ Cộng số lần liên hệ",
        Description = "Actors: Sales, Super Admin, Branch Admin. Đây là action dành cho button thao tác nhanh. Khi gọi API, hệ thống tự động tăng số lần liên hệ, cập nhật thời điểm liên hệ gần nhất và chuyển trạng thái lead sang Contacted."
    )]
    public async Task<ApiResponse<LeadDto>> ContactLead(Guid id)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.ContactLeadAsync(id, currentUserId);
        return new ApiResponse<LeadDto>(result, "Lead marked as contacted successfully");
    }

    [HttpPost("import")]
    [SwaggerOperation(
        Summary = "Nhập danh sách lead từ file CSV",
        Description = "Actors: Sales, Super Admin, Branch Admin. Tải lên file CSV để import lead. Hệ thống kiểm tra trùng theo số điện thoại hoặc email: DuplicateStrategy = Skip sẽ bỏ qua dòng bị trùng, DuplicateStrategy = Update sẽ cập nhật lead hiện có bằng dữ liệu từ file CSV."
    )]
    public async Task<ApiResponse<ImportLeadsResultDto>> ImportLeads([FromForm] ImportLeadsRequestDto request)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.ImportLeadsAsync(request, currentUserId);
        return new ApiResponse<ImportLeadsResultDto>(result, "Leads imported successfully");
    }

    [HttpPost("{id}/merge")]
    [SwaggerOperation(
        Summary = "Gộp lead bị trùng",
        Description = "Actors: Sales, Super Admin, Branch Admin. Cho phép người dùng gộp thủ công 2 lead được xác định là trùng nhau nhưng chưa được hệ thống phát hiện tự động. Hệ thống giữ lại dữ liệu mới hơn hoặc dữ liệu không rỗng, sau đó xóa lead trùng."
    )]
    public async Task<ApiResponse<LeadDto>> MergeLead(Guid id, MergeLeadDto request)
    {
        var currentUserId = User.GetRequiredUserId();

        var result = await _service.MergeLeadAsync(id, request, currentUserId);
        return new ApiResponse<LeadDto>(result, "Leads merged successfully");
    }

    [HttpPost("{id}/convert-to-member")]
    [SwaggerOperation(
        Summary = "Chuyển đổi lead thành hội viên",
        Description = "Actors: Sales, Super Admin, Branch Admin. Chuyển lead thành Member, tạo hợp đồng + hóa đơn + kích hoạt AccessCard trong 1 thao tác."
    )]
    public async Task<ApiResponse<ConvertLeadResultDto>> ConvertLeadToMember(Guid id, [FromBody] ConvertLeadToMemberDto dto)
    {
        var currentUserId = User.GetRequiredUserId();
        var result = await _service.ConvertLeadToMemberAsync(id, dto, currentUserId);
        return new ApiResponse<ConvertLeadResultDto>(result, result.Message);
    }
}