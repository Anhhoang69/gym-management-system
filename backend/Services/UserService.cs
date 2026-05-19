using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using backend.DTOs.User;
using backend.Enums;
using backend.Models;
using backend.Interfaces;
using backend.Helpers;
using System.Security.Claims;

namespace backend.Services;

public class UserService : IUserService

{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuditLogService _auditLogService;
    private readonly UserManager<User> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    private static readonly HashSet<string> AllowedCreatableRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "SuperAdmin",
        nameof(StaffPosition.BranchAdmin),
        nameof(StaffPosition.Sales),
        nameof(StaffPosition.PT),
        nameof(StaffPosition.Receptionist),
        "Member"
    };

    private static readonly HashSet<string> BranchAdminAllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(StaffPosition.Sales),
        nameof(StaffPosition.PT),
        nameof(StaffPosition.Receptionist),
        "Member"
    };

    public UserService(ApplicationDbContext context, IMapper mapper, IAuditLogService auditLogService, UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _auditLogService = auditLogService;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    private async Task<(bool IsSuperAdmin, bool IsGymOwner, bool IsBranchAdmin, Guid? BranchId)> GetCallerScopeAsync()
    {
        var rawUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(rawUserId) || !Guid.TryParse(rawUserId, out var userId)) return (false, false, false, null);

        var isSuperAdmin = _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.SuperAdmin) ?? false;
        var isGymOwner = _httpContextAccessor.HttpContext?.User?.IsInRole(AuthorizationRoles.GymOwner) ?? false;

        var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.UserId == userId);
        var isBranchAdmin = staff != null && staff.Position == StaffPosition.BranchAdmin;

        return (isSuperAdmin, isGymOwner, isBranchAdmin, staff?.BranchId);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto, Guid currentUserId)
    {
        var actorContext = await GetActorContextAsync(currentUserId);
        var targetRole = ParseCreateRole(dto.Role);

        ValidateCreatePermission(actorContext, targetRole);

        var normalizedEmail = NormalizeEmail(dto.Email);
        var normalizedPhone = NormalizePhone(dto.PhoneNumber);
        var targetBranchId = ResolveTargetBranchId(actorContext, targetRole, dto.BranchId);

        await EnsureBranchRulesAsync(targetRole, targetBranchId);
        await EnsureUniqueUserFieldsAsync(normalizedEmail, normalizedPhone);

        var user = _mapper.Map<User>(dto);
        user.Id = Guid.NewGuid();
        user.Email = normalizedEmail;
        user.UserName = normalizedEmail;
        user.PhoneNumber = normalizedPhone;
        user.InitialBranchId = targetBranchId;
        user.TwoFactorEnabled = false;
        user.Status = UserStatus.Active;
        user.CreatedAt = DateTime.UtcNow;

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var createResult = await _userManager.CreateAsync(user, dto.Password);
            if (!createResult.Succeeded)
                throw new Exception(string.Join("; ", createResult.Errors.Select(x => x.Description)));

            var identityRoleName = GetIdentityRoleName(targetRole);
            var addRoleResult = await _userManager.AddToRoleAsync(user, identityRoleName);
            if (!addRoleResult.Succeeded)
                throw new Exception(string.Join("; ", addRoleResult.Errors.Select(x => x.Description)));

            if (targetRole.StaffPosition.HasValue)
            {
                _context.Staffs.Add(new Staff
                {
                    UserId = user.Id,
                    BranchId = targetBranchId!.Value,
                    Position = targetRole.StaffPosition.Value
                });
            }
            else if (targetRole.IsMember)
            {
                _context.Members.Add(new Member
                {
                    UserId = user.Id
                });

                // Tạo AccessCard placeholder (Inactive cho đến khi ActivateMembership)
                _context.AccessCards.Add(new AccessCard
                {
                    AccessCardId = Guid.NewGuid(),
                    MemberUserId = user.Id,
                    CardCode = RegistrationService.GenerateCardCode(user.Id),
                    Status = AccessCardStatus.Inactive,
                    IssueDate = DateTime.UtcNow
                });
            }

            _auditLogService.Add(_auditLogService.CreateLog(
                currentUserId,
                "User",
                user.Id,
                "Create",
                newValue: $"{{Email: {user.Email}, Role: {targetRole.RoleName}, BranchId: {targetBranchId}}}"));

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            throw new Exception("A user with the same email or phone number already exists");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        var createdUser = await GetUserAsync(user.Id)
            ?? throw new Exception("Created user could not be loaded");

        createdUser.Role = targetRole.RoleName;
        return createdUser;
    }

    // ================= LIST =================


    public async Task<PagedResult<UserListDto>> GetUserListAsync(
            int page,
            int pageSize,
            string? search,
            UserStatus? status,
            Guid? branchId,
            string? role)
    {
        var scope = await GetCallerScopeAsync();
        if (!scope.IsSuperAdmin && !scope.IsGymOwner && scope.IsBranchAdmin)
        {
            branchId = scope.BranchId; // BranchAdmin can only see their own branch
        }

        var query = _context.Users
            .Include(x => x.InitialBranch)
            .Include(x => x.Staff)
                .ThenInclude(s => s!.Branch)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search}%";
            query = query.Where(x =>
                EF.Functions.ILike(x.FullName ?? "", keyword) ||
                EF.Functions.ILike(x.Email ?? "", keyword));
        }

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (branchId.HasValue)
        {
            query = query.Where(x =>
                (x.Staff != null && x.Staff.BranchId == branchId.Value) ||
                x.InitialBranchId == branchId.Value);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            if (Enum.TryParse<StaffPosition>(role, true, out var position))
            {
                query = query.Where(x =>
                    x.Staff != null &&
                    x.Staff.Position == position);
            }
            else
            {
                query = query.Where(u =>
                    _context.UserRoles.Any(ur =>
                        ur.UserId == u.Id &&
                        _context.Roles.Any(r =>
                            r.Id == ur.RoleId &&
                            r.Name == role)));
            }
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<UserListDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        // Gán role cho từng user
        var userIds = items.Select(x => x.UserId).ToList();
        var roles = await _context.UserRoles
            .Where(x => userIds.Contains(x.UserId))
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => new { ur.UserId, r.Name })
            .ToDictionaryAsync(x => x.UserId, x => x.Name);
        foreach (var user in items)
        {
            if (user.StaffPosition.HasValue)
            {
                user.Role = user.StaffPosition.Value.ToString();
            }
            else if (roles.TryGetValue(user.UserId, out var roleName))
            {
                user.Role = roleName;
            }
        }

        return new PagedResult<UserListDto>(items, total, page, pageSize);
    }

    // ================= DETAIL =================

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        var user = await _context.Users
            .Include(x => x.InitialBranch)
            .Include(x => x.Member)
                .ThenInclude(m => m!.AccessCard)
            .Include(x => x.Member)
                .ThenInclude(m => m!.Contracts.Where(c => c.Status == ContractStatus.Active).OrderByDescending(c => c.CreatedAt).Take(1))
                    .ThenInclude(c => c.Package)
            .Include(x => x.Staff)
                .ThenInclude(s => s!.Branch)
            .Include(x => x.Staff)
                .ThenInclude(s => s!.PTProfile)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return null;

        var scope = await GetCallerScopeAsync();
        if (!scope.IsSuperAdmin && !scope.IsGymOwner && scope.IsBranchAdmin)
        {
            var targetBranchId = user.Staff?.BranchId ?? user.InitialBranchId;
            if (targetBranchId != scope.BranchId)
                throw new UnauthorizedAccessException("Branch admins can only access users in their own branch");
        }

        var dto = _mapper.Map<UserDto>(user);

        // lấy role
        var role = await _context.UserRoles
            .Where(x => x.UserId == user.Id)
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r.Name)
            .FirstOrDefaultAsync();

        dto.Role = user.Staff != null ? user.Staff.Position.ToString() : role;

        if (user.Member != null)
        {
            var totalContracts = await _context.Contracts.CountAsync(c => c.MemberUserId == user.Id);

            dto.MemberInfo = new MemberDetailDto
            {
                TotalContracts = totalContracts,
                AccessCard = user.Member.AccessCard != null ? _mapper.Map<AccessCardSummaryDto>(user.Member.AccessCard) : null,
                ActiveContract = user.Member.Contracts.FirstOrDefault() != null ? _mapper.Map<ContractSummaryDto>(user.Member.Contracts.First()) : null
            };
        }

        // trainer profile
        if (dto.StaffPosition == StaffPosition.PT ||
            dto.StaffPosition == StaffPosition.HeadPT)
        {
            if (user.Staff?.PTProfile != null)
            {
                dto.TrainerProfile = _mapper.Map<PTProfileDto>(user.Staff.PTProfile);
            }
        }

        return dto;
    }

    // ================= UPDATE =================

    public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto dto, Guid adminId)
    {
        var user = await _context.Users
            .Include(x => x.Staff)
                .ThenInclude(s => s!.PTProfile)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return false;

        var scope = await GetCallerScopeAsync();
        if (!scope.IsSuperAdmin && !scope.IsGymOwner && scope.IsBranchAdmin)
        {
            var targetBranchId = user.Staff?.BranchId ?? user.InitialBranchId;
            if (targetBranchId != scope.BranchId)
                throw new UnauthorizedAccessException("Branch admins can only modify users in their own branch");
        }

        var changedFields = new List<string>();

        // ===== UPDATE BASIC INFO =====
        if (dto.FullName != null && dto.FullName != user.FullName) changedFields.Add("FullName");
        if (dto.PhoneNumber != null && dto.PhoneNumber != user.PhoneNumber) changedFields.Add("PhoneNumber");
        if (dto.Gender != null && dto.Gender != user.Gender) changedFields.Add("Gender");
        if (dto.Birthday != null && dto.Birthday != user.Birthday) changedFields.Add("Birthday");
        if (dto.Address != null && dto.Address != user.Address) changedFields.Add("Address");
        if (dto.Status.HasValue && dto.Status.Value != user.Status)
        {
            user.Status = dto.Status.Value;
            changedFields.Add("Status");
        }

        _mapper.Map(dto, user);

        // ===== UPDATE ROLE (SuperAdmin only, Staff to Staff only) =====
        if (!string.IsNullOrWhiteSpace(dto.Role) && scope.IsSuperAdmin)
        {
            var currentRole = await _userManager.GetRolesAsync(user);
            if (!currentRole.Contains(dto.Role))
            {
                if (user.Staff != null && Enum.TryParse<StaffPosition>(dto.Role, true, out var newPosition))
                {
                    user.Staff.Position = newPosition;
                    await _userManager.RemoveFromRolesAsync(user, currentRole);
                    await _userManager.AddToRoleAsync(user, "Staff");
                    changedFields.Add($"Role:{dto.Role}");
                }
                else if (user.Staff == null && dto.Role == "SuperAdmin")
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRole);
                    await _userManager.AddToRoleAsync(user, "SuperAdmin");
                    changedFields.Add("Role:SuperAdmin");
                }
                else if (user.Staff == null && dto.Role == "GymOwner")
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRole);
                    await _userManager.AddToRoleAsync(user, "GymOwner");
                    changedFields.Add("Role:GymOwner");
                }
            }
        }

        // ===== UPDATE STAFF INFO =====

        if (user.Staff != null)
        {
            if (dto.BranchId.HasValue)
            {
                user.Staff.BranchId = dto.BranchId.Value;
                user.InitialBranchId = dto.BranchId.Value;
            }

            if (dto.StaffPosition.HasValue)
                user.Staff.Position = dto.StaffPosition.Value;
        }
        else if (dto.BranchId.HasValue)
        {
            user.InitialBranchId = dto.BranchId.Value;
        }

        // ===== UPDATE PT PROFILE =====

        if ((user.Staff?.Position == StaffPosition.PT ||
             user.Staff?.Position == StaffPosition.HeadPT)
            && dto.TrainerProfile != null)
        {
            var profile = user.Staff.PTProfile;

            if (profile == null)
            {
                profile = new PTProfile
                {
                    StaffUserId = user.Id
                };

                user.Staff.PTProfile = profile;
            }

            _mapper.Map(dto.TrainerProfile, profile);
        }

        // ===== UPDATE MEMBER INFO (AccessCard + new Contract) =====

        if (dto.MemberUpdate != null)
        {
            var member = await _context.Members
                .Include(m => m.AccessCard)
                .FirstOrDefaultAsync(m => m.UserId == id);

            if (member != null)
            {
                // 1. Update AccessCard status
                if (member.AccessCard != null && dto.MemberUpdate.AccessCardStatus.HasValue)
                {
                    member.AccessCard.Status = dto.MemberUpdate.AccessCardStatus.Value;
                    changedFields.Add($"AccessCard.Status:{dto.MemberUpdate.AccessCardStatus.Value}");
                }

                // 2. Tạo Contract mới (Pending) nếu đổi gói
                if (dto.MemberUpdate.NewPackageId.HasValue && dto.MemberUpdate.NewPricingId.HasValue)
                {
                    var package = await _context.Packages
                        .Include(p => p.Pricings)
                        .FirstOrDefaultAsync(p => p.PackageId == dto.MemberUpdate.NewPackageId.Value
                                               && p.Status == PackageStatus.Active)
                        ?? throw new Exception("Package not found or inactive");

                    var pricing = package.Pricings
                        .FirstOrDefault(pr => pr.PackagePricingId == dto.MemberUpdate.NewPricingId.Value)
                        ?? throw new Exception("Pricing not found for this package");

                    var newContract = new Contract
                    {
                        ContractId = Guid.NewGuid(),
                        MemberUserId = id,
                        PackageId = package.PackageId,
                        StaffId = adminId,
                        DealPrice = pricing.Price,
                        Status = ContractStatus.Pending,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddMonths(pricing.DurationMonths),
                        TotalPrivateSessions = package.PrivatePtLimit,
                        TotalGroupSessions = package.GroupPtLimit,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Contracts.Add(newContract);
                    changedFields.Add($"NewContract:Pending,Package:{package.Name}");
                }
            }
        }

        user.UpdatedAt = DateTime.UtcNow;

        // ===== AUDIT LOG =====

        if (changedFields.Any())
        {
            _auditLogService.Add(_auditLogService.CreateLog(
                adminId,
                "User",
                id,
                "UpdateUser",
                newValue: string.Join(", ", changedFields),
                branchId: scope.BranchId));
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateUserStatusAsync(Guid id, UserStatus status, Guid adminId)
    {
        var user = await _context.Users
            .Include(x => x.Staff)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
            return false;

        var scope = await GetCallerScopeAsync();
        if (!scope.IsSuperAdmin && !scope.IsGymOwner && scope.IsBranchAdmin)
        {
            var targetBranchId = user.Staff?.BranchId ?? user.InitialBranchId;
            if (targetBranchId != scope.BranchId)
                throw new UnauthorizedAccessException("Branch admins can only modify users in their own branch");
        }

        var oldStatus = user.Status;
        user.Status = status;
        user.UpdatedAt = DateTime.UtcNow;

        _auditLogService.Add(_auditLogService.CreateLog(
            adminId,
            "User",
            id,
            $"UpdateUserStatus",
            oldValue: oldStatus.ToString(),
            newValue: status.ToString(),
            branchId: scope.BranchId));

        await _context.SaveChangesAsync();

        return true;
    }

    // ================= STATS =================

    public async Task<UserStatsDto> GetUserStatsAsync()
    {
        return new UserStatsDto
        {
            TotalUsers = await _context.Users.CountAsync(),

            ActiveUsers = await _context.Users
                .CountAsync(x => x.Status == UserStatus.Active),

            StaffAccounts = await _context.Users
                .CountAsync(x => x.Staff != null),

            MemberAccounts = await _context.Users
                .CountAsync(x => x.Member != null)
        };
    }

    private async Task<CreateUserActorContext> GetActorContextAsync(Guid currentUserId)
    {
        var currentUser = await _context.Users
            .Include(x => x.Staff)
            .FirstOrDefaultAsync(x => x.Id == currentUserId)
            ?? throw new Exception("Current user not found");

        var isSuperAdmin = await _userManager.IsInRoleAsync(currentUser, "SuperAdmin");
        var isBranchAdmin = currentUser.Staff?.Position == StaffPosition.BranchAdmin;

        if (!isSuperAdmin && !isBranchAdmin)
            throw new UnauthorizedAccessException("You do not have permission to create users");

        return new CreateUserActorContext(
            currentUserId,
            isSuperAdmin,
            isBranchAdmin,
            currentUser.Staff?.BranchId);
    }

    private static CreateUserRole ParseCreateRole(string rawRole)
    {
        if (string.IsNullOrWhiteSpace(rawRole))
            throw new Exception("Role is required");

        var role = rawRole.Trim();
        if (!AllowedCreatableRoles.Contains(role))
            throw new Exception("Role does not exist in the system");

        if (role.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase))
            return new CreateUserRole("SuperAdmin", false, false, null);

        if (role.Equals("Member", StringComparison.OrdinalIgnoreCase))
            return new CreateUserRole("Member", false, true, null);

        if (!Enum.TryParse<StaffPosition>(role, true, out var staffPosition))
            throw new Exception("Role does not exist in the system");

        return new CreateUserRole(staffPosition.ToString(), true, false, staffPosition);
    }

    private static void ValidateCreatePermission(CreateUserActorContext actorContext, CreateUserRole targetRole)
    {
        if (actorContext.IsSuperAdmin)
            return;

        if (!actorContext.IsBranchAdmin)
            throw new UnauthorizedAccessException("You do not have permission to create users");

        if (!BranchAdminAllowedRoles.Contains(targetRole.RoleName))
            throw new UnauthorizedAccessException("Branch admins can only create Sales, PT, Receptionist, or Member accounts");
    }

    private static Guid? ResolveTargetBranchId(CreateUserActorContext actorContext, CreateUserRole targetRole, Guid? requestedBranchId)
    {
        if (targetRole.RoleName.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase))
        {
            if (requestedBranchId.HasValue)
                throw new Exception("BranchId must be null for SuperAdmin accounts");

            return null;
        }

        if (actorContext.IsBranchAdmin)
        {
            if (!actorContext.BranchId.HasValue)
                throw new Exception("Current branch admin is not assigned to a branch");

            if (requestedBranchId.HasValue && requestedBranchId.Value != actorContext.BranchId.Value)
                throw new UnauthorizedAccessException("Branch admins can only create users in their own branch");

            return actorContext.BranchId.Value;
        }

        if (!requestedBranchId.HasValue)
            throw new Exception("BranchId is required for non-SuperAdmin roles");

        return requestedBranchId.Value;
    }

    private async Task EnsureBranchRulesAsync(CreateUserRole targetRole, Guid? branchId)
    {
        if (!targetRole.RoleName.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase) && !branchId.HasValue)
            throw new Exception("BranchId is required for non-SuperAdmin roles");

        if (targetRole.IsMember && !branchId.HasValue)
            throw new Exception("Member accounts must have a branch");

        if (branchId.HasValue)
        {
            var branchExists = await _context.Branches
                .AsNoTracking()
                .AnyAsync(x => x.BranchId == branchId.Value);

            if (!branchExists)
                throw new Exception("Branch does not exist");
        }
    }

    private async Task EnsureUniqueUserFieldsAsync(string normalizedEmail, string normalizedPhone)
    {
        var normalizedEmailUpper = normalizedEmail.ToUpperInvariant();

        var duplicateEmailExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(x => x.NormalizedEmail == normalizedEmailUpper || x.Email == normalizedEmail);

        if (duplicateEmailExists)
            throw new Exception("Email already exists");

        var duplicatePhoneExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(x => x.PhoneNumber == normalizedPhone);

        if (duplicatePhoneExists)
            throw new Exception("Phone number already exists");
    }

    private static string GetIdentityRoleName(CreateUserRole targetRole)
    {
        if (targetRole.RoleName.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase))
            return "SuperAdmin";

        if (targetRole.IsMember)
            return "Member";

        return "Staff";
    }

    private static string NormalizeEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new Exception("Email is required");

        return email.Trim().ToLowerInvariant();
    }

    private static string NormalizePhone(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
            throw new Exception("Phone number is required");

        var digits = new string(phoneNumber.Where(char.IsDigit).ToArray());
        if (string.IsNullOrWhiteSpace(digits))
            throw new Exception("Phone number is invalid");

        return digits;
    }

    private sealed record CreateUserActorContext(Guid UserId, bool IsSuperAdmin, bool IsBranchAdmin, Guid? BranchId);

    private sealed record CreateUserRole(string RoleName, bool IsStaff, bool IsMember, StaffPosition? StaffPosition);
}