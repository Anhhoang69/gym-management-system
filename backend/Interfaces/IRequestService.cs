using backend.DTOs.Request;
using backend.Enums;

namespace backend.Interfaces;

public interface IRequestService
{
    // ===== USER SIDE =====

    /// <summary>Xem danh sách request của bản thân</summary>
    Task<List<RequestListDto>> GetMyRequestsAsync(
        Guid userId,
        RequestCategory? category = null,
        RequestStatus? status = null);

    /// <summary>Xem chi tiết 1 request (owner hoặc admin)</summary>
    Task<RequestDetailDto?> GetRequestAsync(Guid requestId, Guid callerId);

    /// <summary>Người tạo tự hủy request khi status còn Pending</summary>
    Task<bool> CancelRequestAsync(Guid requestId, Guid userId);

    // ===== ADMIN / HANDLER SIDE =====

    /// <summary>
    /// List tất cả requests (GymOwner / SuperAdmin).
    /// Filter: relatedEntityType=Branch, category, status, branchId
    /// </summary>
    Task<List<RequestListDto>> GetRequestsAsync(
        string? relatedEntityType = null,
        RequestCategory? category = null,
        RequestStatus? status = null,
        Guid? branchId = null);

    /// <summary>GymOwner phê duyệt request → dispatch theo Category</summary>
    Task<bool> ApproveRequestAsync(Guid requestId, Guid approverId);

    /// <summary>GymOwner từ chối request kèm lý do</summary>
    Task<bool> RejectRequestAsync(Guid requestId, Guid approverId, string? message);
}
