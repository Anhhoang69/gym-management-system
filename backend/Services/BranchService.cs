using System.Text.Json;
using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Branch;
using backend.Interfaces;
using backend.Models;
using backend.Enums;
using backend.Helpers;

namespace backend.Services;

public class BranchService : IBranchService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;
    private readonly INotificationService _notificationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BranchService(
        ApplicationDbContext context,
        IMapper mapper,
        IAuditLogService auditLogService,
        INotificationService notificationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
        _notificationService = notificationService;
        _httpContextAccessor = httpContextAccessor;
    }

    // ===== LIST =====

    public async Task<List<BranchListDto>> GetBranchListAsync(string? search, BranchStatus? status)
    {
        // phân quyền: Staff chỉ xem branch của mình
        var callerBranchId = await GetCallerBranchScopeAsync();

        var query = _context.Branches
            .Include(x => x.Images)
            .Include(x => x.Rooms)
            .Include(x => x.Staffs)
            .Include(x => x.Attendances)
            .AsNoTracking()
            .AsQueryable();

        // nếu caller bị giới hạn branch
        if (callerBranchId.HasValue)
            query = query.Where(x => x.BranchId == callerBranchId.Value);

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

    // ===== CREATE =====

    public async Task<CreateBranchResultDto> CreateBranchAsync(CreateBranchDto dto, Guid userId)
    {
        var warnings = new List<string>();
        var branchId = Guid.NewGuid();
        var requestId = Guid.NewGuid();

        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Tạo Branch
            var branch = _mapper.Map<Branch>(dto);
            branch.BranchId = branchId;
            branch.Status = BranchStatus.Pending;
            branch.CreatedAt = DateTime.UtcNow;

            _context.Branches.Add(branch);

            // 2. Tạo BranchImages
            if (dto.Images != null)
            {
                foreach (var url in dto.Images)
                {
                    _context.BranchImages.Add(new BranchImage
                    {
                        BranchImageId = Guid.NewGuid(),
                        BranchId = branchId,
                        ImageUrl = url
                    });
                }
            }

            // 3. Tạo Rooms (Configure Facilities)
            if (dto.Rooms != null && dto.Rooms.Count > 0)
            {
                foreach (var roomDto in dto.Rooms)
                {
                    _context.Rooms.Add(new Room
                    {
                        RoomId = Guid.NewGuid(),
                        BranchId = branchId,
                        Name = roomDto.Name,
                        RoomNumber = $"R{Guid.NewGuid().ToString("N")[..4].ToUpper()}",
                        Capacity = roomDto.Capacity,
                        Status = RoomStatus.Active
                    });
                }
            }
            else
            {
                warnings.Add("Chi nhánh chưa có cấu hình phòng/khu vực");
            }

            // 4. Assign Staff (Assign Users to Branch)
            if (dto.StaffUserIds != null && dto.StaffUserIds.Count > 0)
            {
                foreach (var staffUserId in dto.StaffUserIds)
                {
                    var existing = await _context.Staffs
                        .FirstOrDefaultAsync(s => s.UserId == staffUserId);

                    if (existing != null)
                    {
                        existing.BranchId = branchId;
                    }
                    else
                    {
                        _context.Staffs.Add(new Staff
                        {
                            UserId = staffUserId,
                            BranchId = branchId,
                            Position = StaffPosition.Receptionist
                        });
                    }
                }
            }
            else
            {
                warnings.Add("Chi nhánh chưa có nhân viên được gán");
            }

            // 5. Tạo Request BranchCreate (JSON snapshot để GymOwner review)
            var payload = JsonSerializer.Serialize(dto);
            var request = new Request
            {
                RequestId = requestId,
                UserId = userId,
                Type = RequestType.Approval,
                Category = RequestCategory.BranchCreate,
                Title = $"Tạo chi nhánh: {dto.Name}",
                Description = $"Yêu cầu tạo chi nhánh mới \"{dto.Name}\" tại {dto.Address}",
                RelatedEntityType = "Branch",
                RelatedEntityId = branchId,
                Payload = payload
            };

            _context.Requests.Add(request);

            // 6. Audit log
            _auditLogService.Add(_auditLogService.CreateLog(
                userId,
                "Branch",
                branchId,
                "CreateBranch"));

            await _context.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }

        // 7. Sau commit: gửi notification đến tất cả GymOwner
        await _notificationService.SendToRoleAsync(
            AuthorizationRoles.GymOwner,
            title: "Yêu cầu tạo chi nhánh mới",
            message: $"Cần phê duyệt tạo chi nhánh \"{dto.Name}\"",
            senderId: userId,
            actionUrl: $"/requests/{requestId}");

        return new CreateBranchResultDto
        {
            BranchId = branchId,
            Name = dto.Name,
            Status = BranchStatus.Pending,
            RequestId = requestId,
            Warnings = warnings
        };
    }

    // ===== UPDATE REQUEST =====

    public async Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null) return false;

        var payload = JsonSerializer.Serialize(dto);
        var requestId = Guid.NewGuid();

        var request = new Request
        {
            RequestId = requestId,
            UserId = userId,
            Type = RequestType.Approval,
            Category = RequestCategory.BranchUpdate,
            Title = $"Cập nhật chi nhánh: {branch.Name}",
            Description = "Yêu cầu cập nhật thông tin chi nhánh",
            RelatedEntityType = "Branch",
            RelatedEntityId = id,
            Payload = payload
        };

        _context.Requests.Add(request);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId, "Branch", id, "RequestUpdateBranch"));

        await _context.SaveChangesAsync();

        // notify sau commit
        await _notificationService.SendToRoleAsync(
            AuthorizationRoles.GymOwner,
            title: "Yêu cầu cập nhật chi nhánh",
            message: $"Chi nhánh \"{branch.Name}\" có yêu cầu cập nhật cần phê duyệt",
            senderId: userId,
            actionUrl: $"/requests/{requestId}");

        return true;
    }

    // ===== DEACTIVATE REQUEST =====

    public async Task<bool> DeactivateBranchAsync(Guid id, Guid userId)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch == null) return false;

        var requestId = Guid.NewGuid();

        var request = new Request
        {
            RequestId = requestId,
            UserId = userId,
            Type = RequestType.Approval,
            Category = RequestCategory.BranchDeactivate,
            Title = $"Vô hiệu hóa chi nhánh: {branch.Name}",
            Description = $"Yêu cầu vô hiệu hóa chi nhánh \"{branch.Name}\"",
            RelatedEntityType = "Branch",
            RelatedEntityId = id
        };

        _context.Requests.Add(request);

        _auditLogService.Add(_auditLogService.CreateLog(
            userId, "Branch", id, "RequestDeactivateBranch"));

        await _context.SaveChangesAsync();

        // notify sau commit
        await _notificationService.SendToRoleAsync(
            AuthorizationRoles.GymOwner,
            title: "Yêu cầu vô hiệu hóa chi nhánh",
            message: $"Chi nhánh \"{branch.Name}\" có yêu cầu vô hiệu hóa cần phê duyệt",
            senderId: userId,
            actionUrl: $"/requests/{requestId}");

        return true;
    }

    // ===== ASSIGN STAFF =====

    public async Task<AssignStaffResultDto> AssignStaffAsync(Guid branchId, AssignStaffDto dto, Guid adminId)
    {
        var branch = await _context.Branches.FindAsync(branchId)
            ?? throw new InvalidOperationException("Branch does not exist");

        var result = new AssignStaffResultDto();

        foreach (var userId in dto.UserIds.Distinct())
        {
            // 1. Validate user tồn tại và Active
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                result.Errors.Add($"User {userId} không tồn tại");
                continue;
            }
            if (user.Status != UserStatus.Active)
            {
                result.Errors.Add($"User {user.FullName ?? user.Email} không ở trạng thái Active");
                continue;
            }

            // 2. Validate user có role Staff (không phải Member-only)
            var isStaffRole = await _context.UserRoles
                .AnyAsync(ur => ur.UserId == userId &&
                    _context.Roles.Any(r => r.Id == ur.RoleId &&
                        (r.Name == "Staff" || r.Name == "SuperAdmin")));

            if (!isStaffRole)
            {
                result.Errors.Add($"User {user.FullName ?? user.Email} không có role Staff");
                continue;
            }

            // 3. Lấy Staff record hiện tại
            var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == userId);

            // 4. Check duplicate
            if (staff != null && staff.BranchId == branchId)
            {
                result.Warnings.Add($"User {user.FullName ?? user.Email} đã được gán vào chi nhánh này");
                continue;
            }

            // 5. Update hoặc tạo mới
            if (staff != null)
            {
                // chuyển từ branch khác sang
                staff.BranchId = branchId;
                if (dto.Position.HasValue)
                    staff.Position = dto.Position.Value;
            }
            else
            {
                _context.Staffs.Add(new Staff
                {
                    UserId = userId,
                    BranchId = branchId,
                    Position = dto.Position ?? StaffPosition.Receptionist
                });
            }

            // 6. Audit log
            _auditLogService.Add(_auditLogService.CreateLog(
                adminId, "Staff", userId, $"AssignToBranch:{branchId}"));

            result.Assigned++;
        }

        if (result.Assigned > 0)
            await _context.SaveChangesAsync();

        return result;
    }

    // ===== REMOVE STAFF =====

    public async Task<bool> RemoveStaffFromBranchAsync(Guid branchId, Guid userId, Guid adminId)
    {
        var staff = await _context.Staffs
            .Include(s => s.TeachingClasses)
            .FirstOrDefaultAsync(s => s.UserId == userId && s.BranchId == branchId);

        if (staff == null) return false;

        // kiểm tra không còn lớp học active
        var hasActiveClasses = staff.TeachingClasses
            .Any(c => c.Status == ClassStatus.Scheduled);

        if (hasActiveClasses)
            throw new InvalidOperationException("Cannot remove this employee because there are ongoing classes");

        // KHÔNG hard delete – chỉ set BranchId = null để giữ audit history
        // Lấy branch ID mới nhất để không mất FK
        staff.BranchId = Guid.Empty; // placeholder – hoặc dùng nullable BranchId nếu schema cho phép

        // Vì BranchId là required, ta dùng approach xóa Staff record nhưng giữ lịch sử qua AuditLog
        // Tạo audit log trước khi xóa
        _auditLogService.Add(_auditLogService.CreateLog(
            adminId, "Staff", userId, $"RemoveFromBranch:{branchId}"));

        _context.Staffs.Remove(staff);

        await _context.SaveChangesAsync();
        return true;
    }

    // ===== PRIVATE HELPERS =====

    /// <summary>
    /// Trả về BranchId nếu caller là Staff (bị giới hạn branch).
    /// Trả về null nếu caller là SuperAdmin/GymOwner (xem tất cả).
    /// </summary>
    private async Task<Guid?> GetCallerBranchScopeAsync()
    {
        var rawUserId = _httpContextAccessor.HttpContext?.User
            ?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(rawUserId) || !Guid.TryParse(rawUserId, out var callerId))
            return null;

        var isSuperAdminOrOwner = _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.SuperAdmin) == true
            || _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.GymOwner) == true;

        if (isSuperAdminOrOwner) return null;

        // Staff: chỉ xem branch của mình
        var staffBranchId = await _context.Staffs
            .Where(s => s.UserId == callerId)
            .Select(s => (Guid?)s.BranchId)
            .FirstOrDefaultAsync();

        return staffBranchId;
    }
}