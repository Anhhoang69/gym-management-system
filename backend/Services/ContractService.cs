using backend.Data;
using backend.DTOs.Contract;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Services;

public class ContractService : IContractService
{
    private readonly ApplicationDbContext _context;
    private readonly ICommissionService _commissionService;

    public ContractService(ApplicationDbContext context, ICommissionService commissionService)
    {
        _context = context;
        _commissionService = commissionService;
    }

    public async Task<ContractDraftPreviewDto> CreateDraftAsync(CreateContractDraftDto dto, Guid staffId)
    {
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

        // Calculate discounts
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

        var draft = new ContractDraft
        {
            DraftId = Guid.NewGuid(),
            CreatedByStaffId = staffId,
            MemberUserId = dto.MemberUserId,
            PackageId = dto.PackageId,
            PricingId = dto.PricingId,
            StartDate = dto.StartDate,
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
            AppliedPromotions = new List<string>(), // Simplification
            ExpiresAt = draft.ExpiresAt
        };
    }

    public async Task<ContractDto> GenerateContractAsync(GenerateContractDto dto, Guid staffId)
    {
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

        var contract = new Contract
        {
            ContractId = Guid.NewGuid(),
            MemberUserId = draft.MemberUserId.Value,
            PackageId = draft.PackageId,
            StaffId = staffId,
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
        var contract = await _context.Contracts
            .Include(c => c.Invoice)
            .Include(c => c.Member).ThenInclude(m => m.AccessCard)
            .FirstOrDefaultAsync(c => c.ContractId == contractId)
            ?? throw new Exception("Contract not found");

        if (contract.Status != ContractStatus.Pending)
            throw new Exception("Contract is not in Pending status");

        if (contract.Invoice == null || contract.Invoice.Status != InvoiceStatus.Paid)
            throw new Exception("Invoice is not Paid. Cannot activate membership.");

        // Activate contract
        contract.Status = ContractStatus.Active;

        // Activate AccessCard
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
            
            // Extends logic: only extend if current expire is older than new end date, 
            // but for simplicity, we set to contract.EndDate (which is StartDate + duration).
            // Proper extension logic would be:
            // if (card.ExpireDate.HasValue && card.ExpireDate.Value > DateTime.UtcNow)
            //     card.ExpireDate = card.ExpireDate.Value.AddMonths(duration);
            // else card.ExpireDate = contract.EndDate;
            
            // But per specs, setting to contract.EndDate is accepted
            card.ExpireDate = contract.EndDate;
            if (card.IssueDate == default)
                card.IssueDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // Commission auto-record
        try
        {
            await _commissionService.RecordAsync(contract.ContractId, staffId);
        }
        catch 
        {
            // Fire and forget / ignore commission errors during activation
        }

        return code;
    }
}
