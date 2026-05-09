using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Request;
using backend.Enums;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/requests")]
[Authorize]
public class RequestController : ControllerBase
{
    private readonly IRequestService _service;

    public RequestController(IRequestService service)
    {
        _service = service;
    }

    // ===== USER SIDE =====

    [HttpGet("my")]
    [SwaggerOperation(
        Summary = "Xem danh sách request của tôi",
        Description = "Trả về danh sách requests do user hiện tại tạo. Lọc theo category và status."
    )]
    public async Task<ApiResponse<List<RequestListDto>>> GetMyRequests(
        RequestCategory? category,
        RequestStatus? status)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.GetMyRequestsAsync(userId, category, status);
        return new ApiResponse<List<RequestListDto>>(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Xem chi tiết request",
        Description = "Xem chi tiết request (owner hoặc GymOwner/SuperAdmin). Bao gồm payload JSON snapshot."
    )]
    public async Task<ApiResponse<RequestDetailDto?>> GetRequest(Guid id)
    {
        var callerId = User.GetRequiredUserId();
        var result = await _service.GetRequestAsync(id, callerId);

        if (result == null)
            return new ApiResponse<RequestDetailDto?>("Request not found");

        return new ApiResponse<RequestDetailDto?>(result);
    }

    [HttpPost("{id}/cancel")]
    [SwaggerOperation(
        Summary = "Người tạo tự hủy request",
        Description = "Chỉ hủy được khi request đang ở trạng thái Pending. Nếu là BranchCreate, sẽ dọn dẹp các dữ liệu pending liên quan."
    )]
    public async Task<ApiResponse<bool>> CancelRequest(Guid id)
    {
        var userId = User.GetRequiredUserId();
        var result = await _service.CancelRequestAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request cancelled successfully");
    }

    // ===== ADMIN / HANDLER SIDE =====

    [HttpGet]
    [Authorize(Roles = AuthorizationRoles.GymOwner + "," + AuthorizationRoles.SuperAdmin)]
    [SwaggerOperation(
        Summary = "Danh sách tất cả requests (Admin)",
        Description = "GymOwner/SuperAdmin xem tất cả requests. " +
                      "Filter: relatedEntityType=Branch, category=BranchCreate, status=Pending"
    )]
    public async Task<ApiResponse<List<RequestListDto>>> GetRequests(
        string? relatedEntityType,
        RequestCategory? category,
        RequestStatus? status,
        Guid? branchId)
    {
        var result = await _service.GetRequestsAsync(relatedEntityType, category, status, branchId);
        return new ApiResponse<List<RequestListDto>>(result);
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = AuthorizationRoles.GymOwnerOnly)]
    [SwaggerOperation(
        Summary = "Phê duyệt request (GymOwner)",
        Description = "GymOwner phê duyệt request. Hệ thống tự dispatch theo Category: " +
                      "BranchCreate→Active, BranchUpdate→apply changes, BranchDeactivate→Inactive."
    )]
    public async Task<ApiResponse<bool>> ApproveRequest(Guid id)
    {
        var approverId = User.GetRequiredUserId();
        var result = await _service.ApproveRequestAsync(id, approverId);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request approved");
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = AuthorizationRoles.GymOwnerOnly)]
    [SwaggerOperation(
        Summary = "Từ chối request (GymOwner)",
        Description = "GymOwner từ chối request kèm lý do. " +
                      "Admin sẽ nhận notification với ResponseMessage."
    )]
    public async Task<ApiResponse<bool>> RejectRequest(Guid id, [FromBody] RejectRequestDto dto)
    {
        var approverId = User.GetRequiredUserId();
        var result = await _service.RejectRequestAsync(id, approverId, dto.Message);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request rejected");
    }
}
