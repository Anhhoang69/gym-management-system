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
    private readonly IAuditLogService _auditLogService;

    public BranchService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }

    public async Task<List<BranchListDto>> GetBranchListAsync(string? search, BranchStatus? status)
    {
        var query = _context.Branches
            .Include(x => x.Images)
            .Include(x => x.Rooms)
            .Include(x => x.Staffs)
            .Include(x => x.Attendances)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search}%";
            query = query.Where(x => EF.Functions.ILike(x.Name, keyword));
        }

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        return await query
            .OrderBy(x => x.Name)
            .ProjectTo<BranchListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }


    public async Task<BranchDto?> GetBranchAsync(Guid id)
    {
        return await _context.Branches
            .Include(x => x.Images)
            .Include(x => x.Rooms)
            .Include(x => x.Staffs)
                .ThenInclude(s => s.User)
            .Include(x => x.Attendances)
            .AsNoTracking()
            .Where(x => x.BranchId == id)
            .ProjectTo<BranchDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    public async Task<BranchStatsDto> GetBranchStatsAsync()
    {
        return new BranchStatsDto
        {
            TotalBranches = await _context.Branches.CountAsync(),

            ActiveBranches = await _context.Branches
                .CountAsync(x => x.Status == BranchStatus.Active),

            PendingBranches = await _context.Branches
                .CountAsync(x => x.Status == BranchStatus.Pending),

            InactiveBranches = await _context.Branches
                .CountAsync(x => x.Status == BranchStatus.Inactive)
        };
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
        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Branch",
            id,
            "RequestUpdateBranch"));

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

        _auditLogService.Add(_auditLogService.CreateLog(
            userId,
            "Branch",
            id,
            "RequestDeactivateBranch"));

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

            if (update != null)
            {
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
        }

        if (request.Category == RequestCategory.BranchDeactivate)
        {
            var branch = await _context.Branches
                .FirstAsync(x => x.BranchId == request.RelatedEntityId);

            branch.Status = BranchStatus.Inactive;
        }

        request.Status = RequestStatus.Approved;
        request.HandledByUserId = approverId;
        request.ResolvedAt = DateTime.UtcNow;

        // ===== AUDIT =====

        _auditLogService.Add(_auditLogService.CreateLog(
            approverId,
            "Request",
            requestId,
            "ApproveBranchRequest"));

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

        _auditLogService.Add(_auditLogService.CreateLog(
            approverId,
            "Request",
            requestId,
            "RejectBranchRequest"));

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