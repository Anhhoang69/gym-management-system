using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Branch;
using backend.DTOs.Request;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using backend.Helpers;

namespace backend.Services;

public class RequestService : IRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLogService;
    private readonly INotificationService _notificationService;

    public RequestService(
        ApplicationDbContext context,
        IAuditLogService auditLogService,
        INotificationService notificationService)
    {
        _context = context;
        _auditLogService = auditLogService;
        _notificationService = notificationService;
    }

    // ===== USER SIDE =====

    public async Task<List<RequestListDto>> GetMyRequestsAsync(
        Guid userId,
        RequestCategory? category = null,
        RequestStatus? status = null)
    {
        var query = _context.Requests
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .AsNoTracking()
            .AsQueryable();

        if (category.HasValue)
            query = query.Where(r => r.Category == category.Value);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RequestListDto
            {
                RequestId = r.RequestId,
                Title = r.Title,
                Category = r.Category,
                Status = r.Status,
                RelatedEntityType = r.RelatedEntityType,
                RelatedEntityId = r.RelatedEntityId,
                RequestedByName = r.User.FullName ?? r.User.Email ?? "",
                RequestedByEmail = r.User.Email ?? "",
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<RequestDetailDto?> GetRequestAsync(Guid requestId, Guid callerId)
    {
        var request = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.HandledByUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.RequestId == requestId);

        if (request == null) return null;

        // chỉ owner hoặc admin mới được xem
        var isAdmin = await _context.UserRoles
            .AnyAsync(ur => ur.UserId == callerId &&
                _context.Roles.Any(role => role.Id == ur.RoleId &&
                    (role.Name == AuthorizationRoles.GymOwner || role.Name == AuthorizationRoles.SuperAdmin)));

        if (request.UserId != callerId && !isAdmin)
            throw new UnauthorizedAccessException("You do not have permission to view this request");

        return new RequestDetailDto
        {
            RequestId = request.RequestId,
            Title = request.Title,
            Category = request.Category,
            Status = request.Status,
            RelatedEntityType = request.RelatedEntityType,
            RelatedEntityId = request.RelatedEntityId,
            RequestedByName = request.User.FullName ?? request.User.Email ?? "",
            RequestedByEmail = request.User.Email ?? "",
            CreatedAt = request.CreatedAt,
            Description = request.Description,
            Payload = request.Payload,
            ResponseMessage = request.ResponseMessage,
            HandledByName = request.HandledByUser?.FullName ?? request.HandledByUser?.Email,
            ResolvedAt = request.ResolvedAt
        };
    }

    public async Task<bool> CancelRequestAsync(Guid requestId, Guid userId)
    {
        var request = await _context.Requests
            .FirstOrDefaultAsync(r => r.RequestId == requestId);

        if (request == null) return false;

        // Chỉ owner mới được hủy
        if (request.UserId != userId)
            throw new UnauthorizedAccessException("You can only cancel requests created by yourself");

        // Chỉ hủy được khi Pending
        if (request.Status != RequestStatus.Pending)
            throw new InvalidOperationException("Cannot cancel a request that has already been processed");

        request.Status = RequestStatus.Cancelled;
        request.ResolvedAt = DateTime.UtcNow;

        // Nếu là BranchCreate, xóa Branch đang Pending (kèm Rooms, Staffs qua cascade delete)
        if (request.Category == RequestCategory.BranchCreate && request.RelatedEntityId.HasValue)
        {
            var pendingBranch = await _context.Branches
                .FirstOrDefaultAsync(b => b.BranchId == request.RelatedEntityId.Value);

            if (pendingBranch != null && pendingBranch.Status == BranchStatus.Pending)
            {
                _context.Branches.Remove(pendingBranch);
            }
        }

        // audit log
        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Request",
            requestId,
            $"Cancel:{request.Category}"));

        await _context.SaveChangesAsync();

        return true;
    }

    // ===== ADMIN / HANDLER SIDE =====

    public async Task<List<RequestListDto>> GetRequestsAsync(
        string? relatedEntityType = null,
        RequestCategory? category = null,
        RequestStatus? status = null,
        Guid? branchId = null)
    {
        var query = _context.Requests
            .Include(r => r.User)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(relatedEntityType))
            query = query.Where(r => r.RelatedEntityType == relatedEntityType);

        if (category.HasValue)
            query = query.Where(r => r.Category == category.Value);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        if (branchId.HasValue)
            query = query.Where(r => r.RelatedEntityId == branchId.Value);

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RequestListDto
            {
                RequestId = r.RequestId,
                Title = r.Title,
                Category = r.Category,
                Status = r.Status,
                RelatedEntityType = r.RelatedEntityType,
                RelatedEntityId = r.RelatedEntityId,
                RequestedByName = r.User.FullName ?? r.User.Email ?? "",
                RequestedByEmail = r.User.Email ?? "",
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    // ===== APPROVE =====

    public async Task<bool> ApproveRequestAsync(Guid requestId, Guid approverId)
    {
        var request = await _context.Requests
            .FirstOrDefaultAsync(r => r.RequestId == requestId);

        if (request == null) return false;

        if (request.Status != RequestStatus.Pending)
            throw new InvalidOperationException("Request has already been processed");

        // ===== DISPATCH THEO CATEGORY =====

        switch (request.Category)
        {
            case RequestCategory.BranchCreate:
                await ApplyBranchCreateAsync(request);
                break;

            case RequestCategory.BranchUpdate:
                await ApplyBranchUpdateAsync(request);
                break;

            case RequestCategory.BranchDeactivate:
                await ApplyBranchDeactivateAsync(request);
                break;

            case RequestCategory.ContractChange:
            case RequestCategory.RefundRequest:
                // placeholder – xử lý ở module tương ứng sau
                break;

            default:
                throw new InvalidOperationException($"Unsupported approve category: {request.Category}");
        }

        // cập nhật request
        request.Status = RequestStatus.Approved;
        request.HandledByUserId = approverId;
        request.ResolvedAt = DateTime.UtcNow;

        // audit log
        _auditLogService.Add(_auditLogService.CreateLog(
            approverId,
            "Request",
            requestId,
            $"Approve:{request.Category}"));

        await _context.SaveChangesAsync();

        // thông báo người gửi – sau commit
        await _notificationService.SendAsync(
            title: "Yêu cầu được phê duyệt",
            message: $"Yêu cầu \"{request.Title}\" của bạn đã được phê duyệt.",
            recipientIds: new List<Guid> { request.UserId },
            senderId: approverId,
            actionUrl: $"/requests/{request.RequestId}");

        return true;
    }

    // ===== REJECT =====

    public async Task<bool> RejectRequestAsync(Guid requestId, Guid approverId, string? message)
    {
        var request = await _context.Requests
            .FirstOrDefaultAsync(r => r.RequestId == requestId);

        if (request == null) return false;

        if (request.Status != RequestStatus.Pending)
            throw new InvalidOperationException("Request has already been processed");

        request.Status = RequestStatus.Rejected;
        request.ResponseMessage = message;
        request.HandledByUserId = approverId;
        request.ResolvedAt = DateTime.UtcNow;

        // audit log
        _auditLogService.Add(_auditLogService.CreateLog(
            approverId,
            "Request",
            requestId,
            $"Reject:{request.Category}"));

        await _context.SaveChangesAsync();

        // thông báo người gửi – sau commit
        await _notificationService.SendAsync(
            title: "Yêu cầu bị từ chối",
            message: message ?? $"Yêu cầu \"{request.Title}\" của bạn đã bị từ chối.",
            recipientIds: new List<Guid> { request.UserId },
            senderId: approverId,
            actionUrl: $"/requests/{request.RequestId}");

        return true;
    }

    // ===== PRIVATE HELPERS =====

    private async Task ApplyBranchCreateAsync(Request request)
    {
        if (!request.RelatedEntityId.HasValue) return;

        var branch = await _context.Branches
            .FirstOrDefaultAsync(b => b.BranchId == request.RelatedEntityId.Value)
            ?? throw new InvalidOperationException("Branch does not exist");

        branch.Status = BranchStatus.Active;
        branch.UpdatedAt = DateTime.UtcNow;
    }

    private async Task ApplyBranchUpdateAsync(Request request)
    {
        if (!request.RelatedEntityId.HasValue || string.IsNullOrEmpty(request.Payload)) return;

        var branch = await _context.Branches
            .Include(b => b.Images)
            .FirstOrDefaultAsync(b => b.BranchId == request.RelatedEntityId.Value)
            ?? throw new InvalidOperationException("Branch does not exist");

        var update = JsonSerializer.Deserialize<UpdateBranchDto>(request.Payload,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (update == null) return;

        branch.Name = update.Name;
        branch.Address = update.Address;
        branch.Email = update.Email;
        branch.Hotline = update.Hotline;
        branch.Description = update.Description;
        branch.OpeningHours = update.OpeningHours;
        branch.UpdatedAt = DateTime.UtcNow;

        if (update.Images != null)
        {
            var oldImages = await _context.BranchImages
                .Where(x => x.BranchId == branch.BranchId)
                .ToListAsync();

            _context.BranchImages.RemoveRange(oldImages);

            foreach (var url in update.Images)
            {
                _context.BranchImages.Add(new BranchImage
                {
                    BranchImageId = Guid.NewGuid(),
                    BranchId = branch.BranchId,
                    ImageUrl = url
                });
            }
        }
    }

    private async Task ApplyBranchDeactivateAsync(Request request)
    {
        if (!request.RelatedEntityId.HasValue) return;

        var branch = await _context.Branches
            .FirstOrDefaultAsync(b => b.BranchId == request.RelatedEntityId.Value)
            ?? throw new InvalidOperationException("Branch does not exist");

        branch.Status = BranchStatus.Inactive;
        branch.UpdatedAt = DateTime.UtcNow;
    }
}
