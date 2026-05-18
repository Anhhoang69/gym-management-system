using backend.DTOs.Contract;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using backend.DTOs.Common;

namespace backend.Controllers;

[ApiController]
[Route("api/contracts")]
[Authorize]
public class ContractController : ControllerBase
{
    private readonly IContractService _service;

    public ContractController(IContractService service)
    {
        _service = service;
    }

    private Guid GetStaffId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Unauthorized");
        return Guid.Parse(claim);
    }

    [HttpPost("draft")]
    [SwaggerOperation(
        Summary = "Cấu hình gói hội viên (Tạo bản nháp)",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. Dành cho khách hàng hiện tại (Member) muốn mua thêm gói tập. Lưu thông tin cấu hình vào draft để kiểm tra và tính toán (UC-25)"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<ContractDraftPreviewDto>> CreateDraft([FromBody] CreateContractDraftDto dto)
    {
        var result = await _service.CreateDraftAsync(dto, GetStaffId());
        return new ApiResponse<ContractDraftPreviewDto>(result, "Draft created successfully");
    }

    [HttpGet("draft/{id}")]
    [SwaggerOperation(
        Summary = "Xem bản nháp",
        Description = "Xem thông tin một bản nháp hợp đồng"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<ContractDraftPreviewDto>> GetDraft(Guid id)
    {
        var result = await _service.GetDraftAsync(id, GetStaffId());
        return new ApiResponse<ContractDraftPreviewDto>(result, "Draft retrieved");
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Tạo hợp đồng",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. Tạo hợp đồng từ bản nháp. Hợp đồng sẽ ở trạng thái Pending (chưa thanh toán) (UC-26)"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<ContractDto>> GenerateContract([FromBody] GenerateContractDto dto)
    {
        var result = await _service.GenerateContractAsync(dto, GetStaffId());
        return new ApiResponse<ContractDto>(result, "Contract generated successfully");
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Xem chi tiết hợp đồng"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<ContractDto>> GetContract(Guid id)
    {
        var result = await _service.GetContractAsync(id, GetStaffId());
        return new ApiResponse<ContractDto>(result, "Contract retrieved");
    }

    [HttpPost("{id}/activate")]
    [SwaggerOperation(
        Summary = "Kích hoạt hội viên",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. Kích hoạt hợp đồng sau khi đã thanh toán hóa đơn. Tự động chuyển đổi trạng thái AccessCard và ghi nhận hoa hồng trạng thái Approved (UC-29)"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<string>> ActivateMembership(Guid id)
    {
        var accessCardCode = await _service.ActivateMembershipAsync(id, GetStaffId());
        return new ApiResponse<string>(accessCardCode, "Membership activated successfully");
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Lấy danh sách hợp đồng", Description = "Lọc theo branchId, memberId, status, dateRange")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<PagedResult<ContractDto>>> GetContracts([FromQuery] ContractQueryDto query)
    {
        var result = await _service.GetContractsAsync(query, GetStaffId());
        return new ApiResponse<PagedResult<ContractDto>>(result);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Cập nhật hợp đồng", Description = "Chỉ cho phép sửa StartDate khi hợp đồng Pending. Notes có thể sửa bất kỳ lúc nào.")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<ContractDto>> UpdateContract(Guid id, [FromBody] UpdateContractDto dto)
    {
        var result = await _service.UpdateContractAsync(id, dto, GetStaffId());
        return new ApiResponse<ContractDto>(result, "Contract updated successfully");
    }

    [HttpPatch("{id}/cancel")]
    [SwaggerOperation(Summary = "Hủy hợp đồng", Description = "Chuyển trạng thái sang Cancelled, vô hiệu hóa thẻ, ghi AuditLog.")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<bool>> CancelContract(Guid id)
    {
        var result = await _service.CancelContractAsync(id, GetStaffId());
        if (!result) return new ApiResponse<bool>("Contract not found");
        return new ApiResponse<bool>(true, "Contract cancelled successfully");
    }

    [HttpGet("drafts")]
    [SwaggerOperation(Summary = "Lấy danh sách bản nháp", Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin.")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<PagedResult<ContractDraftPreviewDto>>> GetDrafts([FromQuery] ContractDraftQueryDto query)
    {
        var result = await _service.GetDraftsAsync(query, GetStaffId());
        return new ApiResponse<PagedResult<ContractDraftPreviewDto>>(result);
    }

    [HttpPut("drafts/{id}")]
    [SwaggerOperation(Summary = "Cập nhật bản nháp", Description = "Chỉ cho sửa ngày bắt đầu và ghi chú.")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<ContractDraftPreviewDto>> UpdateDraft(Guid id, [FromBody] UpdateContractDraftDto dto)
    {
        var result = await _service.UpdateDraftAsync(id, dto, GetStaffId());
        return new ApiResponse<ContractDraftPreviewDto>(result, "Draft updated successfully");
    }

    [HttpDelete("drafts/{id}")]
    [SwaggerOperation(Summary = "Xóa bản nháp", Description = "Chỉ xóa khi bản nháp chưa được sử dụng.")]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    public async Task<ApiResponse<bool>> DeleteDraft(Guid id)
    {
        var result = await _service.DeleteDraftAsync(id, GetStaffId());
        if (!result) return new ApiResponse<bool>("Draft not found or already used");
        return new ApiResponse<bool>(true, "Draft deleted successfully");
    }
}
