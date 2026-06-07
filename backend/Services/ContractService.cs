using backend.Data;
using backend.DTOs.Contract;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Services;

public class ContractService : IContractService
{
    private readonly ApplicationDbContext _context;
    private readonly ICommissionService _commissionService;
    private readonly IEmailService _emailService;

    public ContractService(ApplicationDbContext context, ICommissionService commissionService, IEmailService emailService)
    {
        _context = context;
        _commissionService = commissionService;
        _emailService = emailService;
    }

    public async Task<ContractDraftPreviewDto> CreateDraftAsync(CreateContractDraftDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var package = await _context.Packages
            .Include(p => p.Pricings)
            .FirstOrDefaultAsync(p => p.PackageId == dto.PackageId && p.Status == PackageStatus.Active)
            ?? throw new Exception("Package not found or inactive");

        var pricing = package.Pricings.FirstOrDefault(pr => pr.PackagePricingId == dto.PricingId)
            ?? throw new Exception("Pricing tier not found for this package");

        var member = await _context.Users.Include(u => u.Member).FirstOrDefaultAsync(u => u.Id == dto.MemberUserId && u.Member != null)
            ?? throw new Exception("Member not found");

        decimal originalPrice = pricing.Price;
        decimal discountAmount = 0;
        var appliedPromotions = new List<string>();

        if (dto.PromotionIds != null && dto.PromotionIds.Any())
        {
            var promotions = await _context.Promotions
                .Where(p => dto.PromotionIds.Contains(p.PromotionId) && p.Status == PromotionStatus.Active)
                .ToListAsync();

            foreach (var promo in promotions)
            {
                if (promo.StartDate > DateTime.UtcNow || promo.EndDate < DateTime.UtcNow)
                    continue;

                if (promo.ApplicablePackageId.HasValue && promo.ApplicablePackageId != package.PackageId)
                    continue;

                if (promo.CurrentUsage >= promo.MaxUsage)
                    continue;

                decimal currentDiscount = 0;
                if (promo.DiscountType == DiscountType.Percentage)
                {
                    currentDiscount = originalPrice * (promo.DiscountValue / 100);
                }
                else if (promo.DiscountType == DiscountType.FixedAmount)
                {
                    currentDiscount = promo.DiscountValue;
                }

                discountAmount += currentDiscount;
                appliedPromotions.Add(promo.Name);
            }
        }

        if (discountAmount > originalPrice) discountAmount = originalPrice;
        decimal dealPrice = originalPrice - discountAmount;

        var isStaffExist = await _context.Staffs.AnyAsync(s => s.UserId == staffId);
        var draft = new ContractDraft
        {
            DraftId = Guid.NewGuid(),
            CreatedByStaffId = isStaffExist ? staffId : null,
            MemberUserId = dto.MemberUserId,
            PackageId = dto.PackageId,
            PricingId = dto.PricingId,
            StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc),
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            PromotionIdsJson = JsonSerializer.Serialize(dto.PromotionIds ?? new List<Guid>()),
            Note = dto.Note,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        _context.ContractDrafts.Add(draft);
        await _context.SaveChangesAsync();

        return new ContractDraftPreviewDto
        {
            DraftId = draft.DraftId,
            MemberName = member.FullName ?? "Unknown",
            PackageName = package.Name,
            DurationMonths = pricing.DurationMonths,
            StartDate = draft.StartDate,
            EndDate = draft.StartDate.AddMonths(pricing.DurationMonths),
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            AppliedPromotions = appliedPromotions,
            ExpiresAt = draft.ExpiresAt
        };
    }

    public async Task<ContractDraftPreviewDto> GetDraftAsync(Guid draftId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var draft = await _context.ContractDrafts
            .Include(d => d.Package)
            .Include(d => d.Pricing)
            .Include(d => d.Member!.User)
            .FirstOrDefaultAsync(d => d.DraftId == draftId && !d.IsUsed)
            ?? throw new Exception("Draft not found or already used");

        if (draft.ExpiresAt < DateTime.UtcNow)
            throw new Exception("Draft has expired");

        return new ContractDraftPreviewDto
        {
            DraftId = draft.DraftId,
            MemberName = draft.Member?.User?.FullName ?? "Unknown",
            PackageName = draft.Package.Name,
            DurationMonths = draft.Pricing.DurationMonths,
            StartDate = draft.StartDate,
            EndDate = draft.StartDate.AddMonths(draft.Pricing.DurationMonths),
            OriginalPrice = draft.OriginalPrice,
            DiscountAmount = draft.DiscountAmount,
            DealPrice = draft.DealPrice,
            AppliedPromotions = new List<string>(),
            ExpiresAt = draft.ExpiresAt
        };
    }

    public async Task<ContractDto> GenerateContractAsync(GenerateContractDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var draft = await _context.ContractDrafts
            .Include(d => d.Package)
            .Include(d => d.Pricing)
            .FirstOrDefaultAsync(d => d.DraftId == dto.DraftId && !d.IsUsed)
            ?? throw new Exception("Draft not found or already used");

        if (draft.ExpiresAt < DateTime.UtcNow)
            throw new Exception("Draft has expired");

        if (!draft.MemberUserId.HasValue)
            throw new Exception("Draft must have a target member to generate a contract");

        var memberUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == draft.MemberUserId)
            ?? throw new Exception("Member not found");

        var isStaffExist = await _context.Staffs.AnyAsync(s => s.UserId == staffId);
        var contract = new Contract
        {
            ContractId = Guid.NewGuid(),
            MemberUserId = draft.MemberUserId.Value,
            PackageId = draft.PackageId,
            StaffId = isStaffExist ? staffId : null,
            OriginalPrice = draft.OriginalPrice,
            DiscountAmount = draft.DiscountAmount,
            DealPrice = draft.DealPrice,
            Note = draft.Note,
            Status = ContractStatus.Pending,
            StartDate = draft.StartDate,
            EndDate = draft.StartDate.AddMonths(draft.Pricing.DurationMonths),
            TotalPrivateSessions = draft.Package.PrivatePtLimit,
            TotalGroupSessions = draft.Package.GroupPtLimit,
            CreatedAt = DateTime.UtcNow
        };

        _context.Contracts.Add(contract);

        var promoIds = JsonSerializer.Deserialize<List<Guid>>(draft.PromotionIdsJson);
        if (promoIds != null && promoIds.Any())
        {
            var promos = await _context.Promotions.Where(p => promoIds.Contains(p.PromotionId)).ToListAsync();
            foreach (var p in promos)
            {
                _context.ContractPromotions.Add(new ContractPromotion
                {
                    ContractId = contract.ContractId,
                    PromotionId = p.PromotionId,
                    AppliedAt = DateTime.UtcNow
                });
                p.CurrentUsage++;
            }
        }

        draft.IsUsed = true;
        await _context.SaveChangesAsync();

        return new ContractDto
        {
            ContractId = contract.ContractId,
            MemberUserId = contract.MemberUserId,
            MemberName = memberUser.FullName ?? "Unknown",
            PackageName = draft.Package.Name,
            Status = contract.Status,
            OriginalPrice = contract.OriginalPrice,
            DiscountAmount = contract.DiscountAmount,
            DealPrice = contract.DealPrice,
            StartDate = contract.StartDate,
            EndDate = contract.EndDate,
            TotalPrivateSessions = contract.TotalPrivateSessions,
            UsedPrivateSessions = contract.UsedPrivateSessions,
            TotalGroupSessions = contract.TotalGroupSessions,
            UsedGroupSessions = contract.UsedGroupSessions,
            Note = contract.Note,
            CreatedAt = contract.CreatedAt
        };
    }

    public async Task<ContractDto> GetContractAsync(Guid contractId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var contract = await _context.Contracts
            .Include(c => c.Package)
            .Include(c => c.Member.User)
            .Include(c => c.Invoice)
            .FirstOrDefaultAsync(c => c.ContractId == contractId)
            ?? throw new Exception("Contract not found");

        return new ContractDto
        {
            ContractId = contract.ContractId,
            MemberUserId = contract.MemberUserId,
            MemberName = contract.Member.User.FullName ?? "Unknown",
            PackageName = contract.Package.Name,
            Status = contract.Status,
            OriginalPrice = contract.OriginalPrice,
            DiscountAmount = contract.DiscountAmount,
            DealPrice = contract.DealPrice,
            StartDate = contract.StartDate,
            EndDate = contract.EndDate,
            TotalPrivateSessions = contract.TotalPrivateSessions,
            UsedPrivateSessions = contract.UsedPrivateSessions,
            TotalGroupSessions = contract.TotalGroupSessions,
            UsedGroupSessions = contract.UsedGroupSessions,
            Note = contract.Note,
            CreatedAt = contract.CreatedAt,
            InvoiceId = contract.Invoice?.InvoiceId,
            InvoiceStatus = contract.Invoice?.Status
        };
    }

    public async Task<string> ActivateMembershipAsync(Guid contractId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var contract = await _context.Contracts
            .Include(c => c.Invoice)
            .Include(c => c.Member).ThenInclude(m => m.AccessCard)
            .FirstOrDefaultAsync(c => c.ContractId == contractId)
            ?? throw new Exception("Contract not found");

        if (contract.Status != ContractStatus.Pending)
            throw new Exception("Contract is not in Pending status");

        if (contract.Invoice == null || contract.Invoice.Status != InvoiceStatus.Paid)
            throw new Exception("Invoice is not Paid. Cannot activate membership.");

        contract.Status = ContractStatus.Active;

        var card = contract.Member.AccessCard;
        string code = "";
        if (card == null)
        {
            // Missing card -> create
            code = RegistrationService.GenerateCardCode(contract.MemberUserId);
            card = new AccessCard
            {
                AccessCardId = Guid.NewGuid(),
                MemberUserId = contract.MemberUserId,
                CardCode = code,
                Status = AccessCardStatus.Active,
                IssueDate = DateTime.UtcNow,
                ExpireDate = contract.EndDate
            };
            _context.AccessCards.Add(card);
        }
        else
        {
            code = card.CardCode;
            card.Status = AccessCardStatus.Active;
            
            card.ExpireDate = contract.EndDate;
            if (card.IssueDate == default)
                card.IssueDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        try
        {
            await _commissionService.RecordAsync(contract.ContractId, staffId);
        }
        catch { }

        // Gửi email thông báo kích hoạt (ngoài transaction — lỗi email không ảnh hưởng activation)
        try
        {
            var memberUser = await _context.Users
                .Include(u => u.Member)
                .FirstOrDefaultAsync(u => u.Id == contract.MemberUserId);

            var pkg = await _context.Packages
                .FirstOrDefaultAsync(p => p.PackageId == contract.PackageId);

            if (memberUser?.Email != null && pkg != null)
            {
                await _emailService.SendMembershipActivatedAsync(
                    memberUser.Email,
                    memberUser.FullName ?? "Member",
                    code,
                    pkg.Name,
                    contract.StartDate,
                    contract.EndDate,
                    contract.Invoice!.TotalAmount);
            }
        }
        catch { }

        return code;
    }

    private async Task EnsureC2PermissionAsync(Guid staffUserId)
    {
        var hasPermission = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == staffUserId &&
                          (s.Position == StaffPosition.Sales ||
                           s.Position == StaffPosition.Receptionist ||
                           s.Position == StaffPosition.BranchAdmin));

        if (hasPermission)
            return;

        var isAdmin = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur => ur.UserId == staffUserId &&
                           _context.Roles.Any(r => r.Id == ur.RoleId && 
                               (r.Name == "SuperAdmin" || r.Name == "GymOwner")));

        if (!isAdmin)
            throw new Exception("You do not have permission to manage contracts (requires Sales, Receptionist, BranchAdmin or SuperAdmin)");
    }

    // Draft Management
    public async Task<PagedResult<ContractDraftPreviewDto>> GetDraftsAsync(ContractDraftQueryDto query, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var q = _context.ContractDrafts
            .Include(d => d.Package)
            .Include(d => d.Pricing)
            .Include(d => d.Member!).ThenInclude(m => m.User)
            .Include(d => d.CreatedByStaff)
            .Where(d => !d.IsUsed);

        if (query.MemberId.HasValue)
            q = q.Where(d => d.MemberUserId == query.MemberId.Value);

        if (query.BranchId.HasValue)
            q = q.Where(d => d.CreatedByStaff.BranchId == query.BranchId.Value);

        if (query.FromDate.HasValue)
            q = q.Where(d => d.CreatedAt >= query.FromDate.Value);

        if (query.ToDate.HasValue)
            q = q.Where(d => d.CreatedAt <= query.ToDate.Value);

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(d => d.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(draft => new ContractDraftPreviewDto
            {
                DraftId = draft.DraftId,
                MemberName = draft.Member != null && draft.Member.User != null ? (draft.Member.User.FullName ?? "Unknown") : "Unknown",
                PackageName = draft.Package.Name,
                DurationMonths = draft.Pricing.DurationMonths,
                StartDate = draft.StartDate,
                EndDate = draft.StartDate.AddMonths(draft.Pricing.DurationMonths),
                OriginalPrice = draft.OriginalPrice,
                DiscountAmount = draft.DiscountAmount,
                DealPrice = draft.DealPrice,
                AppliedPromotions = new List<string>(),
                ExpiresAt = draft.ExpiresAt
            })
            .ToListAsync();

        return new PagedResult<ContractDraftPreviewDto>
        {
            Items = items,
            TotalItems = total,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)query.PageSize)
        };
    }

    public async Task<ContractDraftPreviewDto> UpdateDraftAsync(Guid draftId, UpdateContractDraftDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var draft = await _context.ContractDrafts
            .Include(d => d.Package)
            .Include(d => d.Pricing)
            .Include(d => d.Member!).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(d => d.DraftId == draftId && !d.IsUsed)
            ?? throw new Exception("Draft not found or already used");

        draft.StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        draft.Note = dto.Note;
        draft.ExpiresAt = DateTime.UtcNow.AddHours(24);

        await _context.SaveChangesAsync();

        return new ContractDraftPreviewDto
        {
            DraftId = draft.DraftId,
            MemberName = draft.Member?.User?.FullName ?? "Unknown",
            PackageName = draft.Package.Name,
            DurationMonths = draft.Pricing.DurationMonths,
            StartDate = draft.StartDate,
            EndDate = draft.StartDate.AddMonths(draft.Pricing.DurationMonths),
            OriginalPrice = draft.OriginalPrice,
            DiscountAmount = draft.DiscountAmount,
            DealPrice = draft.DealPrice,
            AppliedPromotions = new List<string>(),
            ExpiresAt = draft.ExpiresAt
        };
    }

    public async Task<bool> DeleteDraftAsync(Guid draftId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var draft = await _context.ContractDrafts.FirstOrDefaultAsync(d => d.DraftId == draftId && !d.IsUsed);
        if (draft == null) return false;

        _context.ContractDrafts.Remove(draft);
        await _context.SaveChangesAsync();
        return true;
    }

    // Contract Management
    public async Task<PagedResult<ContractDto>> GetContractsAsync(ContractQueryDto query, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var q = _context.Contracts
            .Include(c => c.Package)
            .Include(c => c.Member).ThenInclude(m => m.User)
            .Include(c => c.Invoice)
            .Include(c => c.Staff)
            .AsQueryable();

        if (query.MemberId.HasValue)
            q = q.Where(c => c.MemberUserId == query.MemberId.Value);

        if (query.BranchId.HasValue)
            q = q.Where(c => c.Staff.BranchId == query.BranchId.Value);

        if (query.Status.HasValue)
            q = q.Where(c => c.Status == query.Status.Value);

        if (query.FromDate.HasValue)
            q = q.Where(c => c.CreatedAt >= query.FromDate.Value);

        if (query.ToDate.HasValue)
            q = q.Where(c => c.CreatedAt <= query.ToDate.Value);

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(c => c.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(c => new ContractDto
            {
                ContractId = c.ContractId,
                MemberUserId = c.MemberUserId,
                MemberName = c.Member.User.FullName ?? "Unknown",
                PackageName = c.Package.Name,
                Status = c.Status,
                OriginalPrice = c.OriginalPrice,
                DiscountAmount = c.DiscountAmount,
                DealPrice = c.DealPrice,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                TotalPrivateSessions = c.TotalPrivateSessions,
                UsedPrivateSessions = c.UsedPrivateSessions,
                TotalGroupSessions = c.TotalGroupSessions,
                UsedGroupSessions = c.UsedGroupSessions,
                Note = c.Note,
                CreatedAt = c.CreatedAt,
                InvoiceId = c.Invoice != null ? c.Invoice.InvoiceId : (Guid?)null,
                InvoiceStatus = c.Invoice != null ? c.Invoice.Status : (InvoiceStatus?)null
            })
            .ToListAsync();

        return new PagedResult<ContractDto>
        {
            Items = items,
            TotalItems = total,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)query.PageSize)
        };
    }

    public async Task<ContractDto> UpdateContractAsync(Guid contractId, UpdateContractDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var contract = await _context.Contracts
            .Include(c => c.Package)
            .Include(c => c.Member).ThenInclude(m => m.User)
            .Include(c => c.Invoice)
            .FirstOrDefaultAsync(c => c.ContractId == contractId)
            ?? throw new Exception("Contract not found");

        if (contract.Status == ContractStatus.Pending)
        {
            var oldStartDate = contract.StartDate;
            contract.StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
            var duration = contract.EndDate - oldStartDate; 
            contract.EndDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc).Add(duration);
        }

        contract.Note = dto.Note;
        contract.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ContractDto
        {
            ContractId = contract.ContractId,
            MemberUserId = contract.MemberUserId,
            MemberName = contract.Member.User.FullName ?? "Unknown",
            PackageName = contract.Package.Name,
            Status = contract.Status,
            OriginalPrice = contract.OriginalPrice,
            DiscountAmount = contract.DiscountAmount,
            DealPrice = contract.DealPrice,
            StartDate = contract.StartDate,
            EndDate = contract.EndDate,
            TotalPrivateSessions = contract.TotalPrivateSessions,
            UsedPrivateSessions = contract.UsedPrivateSessions,
            TotalGroupSessions = contract.TotalGroupSessions,
            UsedGroupSessions = contract.UsedGroupSessions,
            Note = contract.Note,
            CreatedAt = contract.CreatedAt,
            InvoiceId = contract.Invoice?.InvoiceId,
            InvoiceStatus = contract.Invoice?.Status
        };
    }

    public async Task<bool> CancelContractAsync(Guid contractId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var contract = await _context.Contracts
            .Include(c => c.Member).ThenInclude(m => m.AccessCard)
            .FirstOrDefaultAsync(c => c.ContractId == contractId);

        if (contract == null) return false;

        contract.Status = ContractStatus.Cancelled;
        contract.UpdatedAt = DateTime.UtcNow;

        // Deactivate access card if active
        if (contract.Member?.AccessCard != null && contract.Member.AccessCard.Status == AccessCardStatus.Active)
        {
            contract.Member.AccessCard.Status = AccessCardStatus.Inactive;
        }

        // Add audit log
        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = staffId,
            Action = "CancelContract",
            EntityType = "Contract",
            EntityId = contract.ContractId,
            CreatedAt = DateTime.UtcNow,
            NewValue = "Cancelled"
        });

        await _context.SaveChangesAsync();
        return true;
    }
}
