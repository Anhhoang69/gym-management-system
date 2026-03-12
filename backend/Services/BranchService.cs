using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Branch;
using backend.Interfaces;
using backend.Models;
using backend.Enums;

namespace backend.Services;

public class BranchService : IBranchService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public BranchService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BranchListDto>> GetBranchesAsync(string? search, string? status)
    {
        var query = _context.Branches
            .Include(b => b.Images)
            .Include(b => b.Rooms)
            .Include(b => b.Staffs)
            .Include(b => b.Attendances)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(x => x.Name.Contains(search));

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status.ToString() == status);

        return await query
            .ProjectTo<BranchListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<BranchListDto?> GetBranchAsync(Guid id)
    {
        var branch = await _context.Branches
            .Include(b => b.Images)
            .Include(b => b.Rooms)
            .Include(b => b.Staffs)
            .Include(b => b.Attendances)
            .FirstOrDefaultAsync(x => x.BranchId == id);

        if (branch == null) return null;

        return _mapper.Map<BranchListDto>(branch);
    }

    // ================= UPDATE REQUEST =================

    public async Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null) return false;

        var payload = JsonSerializer.Serialize(dto);

        var request = new Request
        {
            RequestId = Guid.NewGuid(),
            UserId = userId,
            Type = RequestType.Approval,
            Category = RequestCategory.BranchUpdate,
            Description = "Branch update request",
            RelatedEntityType = "Branch",
            RelatedEntityId = id,
            Payload = payload
        };

        _context.Requests.Add(request);

        // audit log
        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Branch",
            EntityId = id,
            Action = "RequestUpdateBranch"
        });

        // notify gym owner
        var owners = await _context.Users
            .Where(u => _context.UserRoles
                .Any(r => r.UserId == u.Id &&
                    _context.Roles.Any(role => role.Id == r.RoleId && role.Name == "GymOwner")))
            .ToListAsync();

        foreach (var owner in owners)
        {
            _context.Notifications.Add(new Notification
            {
                NotificationId = Guid.NewGuid(),
                UserId = owner.Id,
                Title = "Branch Update Request",
                Message = "A branch update request needs approval"
            });
        }

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= DEACTIVATE REQUEST =================

    public async Task<bool> DeactivateBranchAsync(Guid id, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null) return false;

        var request = new Request
        {
            RequestId = Guid.NewGuid(),
            UserId = userId,
            Type = RequestType.Approval,
            Category = RequestCategory.BranchDeactivate,
            Description = "Deactivate branch request",
            RelatedEntityType = "Branch",
            RelatedEntityId = id
        };

        _context.Requests.Add(request);

        // ===== AUDIT =====

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = userId,
            EntityType = "Branch",
            EntityId = id,
            Action = "RequestDeactivateBranch"
        });

        // ===== FIND GYM OWNER =====

        var owners = await _context.Users
            .Where(u => _context.UserRoles
                .Any(r => r.UserId == u.Id &&
                    _context.Roles.Any(role =>
                        role.Id == r.RoleId &&
                        role.Name == "GymOwner")))
            .ToListAsync();

        // ===== NOTIFICATION =====

        foreach (var owner in owners)
        {
            _context.Notifications.Add(new Notification
            {
                NotificationId = Guid.NewGuid(),
                UserId = owner.Id,
                Title = "Branch Deactivation Request",
                Message = $"Branch '{branch.Name}' requires approval for deactivation"
            });
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ApproveBranchRequestAsync(Guid requestId, Guid approverId)
    {
        var request = await _context.Requests
            .FirstOrDefaultAsync(x => x.RequestId == requestId);

        if (request == null) return false;

        if (request.Status != RequestStatus.Pending)
            throw new Exception("Request already processed");

        // ===== APPLY CHANGE =====

        if (request.Category == RequestCategory.BranchUpdate)
        {
            var branch = await _context.Branches
                .Include(x => x.Images)
                .FirstAsync(x => x.BranchId == request.RelatedEntityId);

            var update = JsonSerializer.Deserialize<UpdateBranchDto>(request.Payload!);

            _mapper.Map(update, branch);

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

        if (request.Category == RequestCategory.BranchDeactivate)
        {
            var branch = await _context.Branches
                .FirstAsync(x => x.BranchId == request.RelatedEntityId);

            branch.Status = BranchStatus.Deactivated;
        }

        request.Status = RequestStatus.Approved;
        request.HandledByUserId = approverId;
        request.ResolvedAt = DateTime.UtcNow;

        // ===== AUDIT =====

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = approverId,
            EntityType = "Request",
            EntityId = requestId,
            Action = "ApproveBranchRequest"
        });

        // ===== NOTIFICATION =====

        _context.Notifications.Add(new Notification
        {
            NotificationId = Guid.NewGuid(),
            UserId = request.UserId,
            Title = "Branch Request Approved",
            Message = "Your branch request has been approved"
        });

        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<bool> RejectBranchRequestAsync(
        Guid requestId,
        Guid approverId,
        string? message)
    {
        var request = await _context.Requests
            .FirstOrDefaultAsync(x => x.RequestId == requestId);

        if (request == null) return false;

        if (request.Status != RequestStatus.Pending)
            throw new Exception("Request already processed");

        request.Status = RequestStatus.Rejected;
        request.ResponseMessage = message;
        request.HandledByUserId = approverId;
        request.ResolvedAt = DateTime.UtcNow;

        // ===== AUDIT =====

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = approverId,
            EntityType = "Request",
            EntityId = requestId,
            Action = "RejectBranchRequest"
        });

        // ===== NOTIFICATION =====

        _context.Notifications.Add(new Notification
        {
            NotificationId = Guid.NewGuid(),
            UserId = request.UserId,
            Title = "Branch Request Rejected",
            Message = message ?? "Your branch request has been rejected"
        });

        await _context.SaveChangesAsync();

        return true;
    }


}