using backend.Data;
using backend.DTOs.Member;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class MemberService : IMemberService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public MemberService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// E2 Walk-in: Receptionist tạo hồ sơ nhanh cho khách walk-in mới.
    /// Kết quả: User + Member + Card(Inactive) + Contract(Pending) + Invoice(Pending).
    /// Không thu tiền ngay — dùng POST /api/invoices/{id}/payment → POST /api/contracts/{id}/activate sau.
    /// </summary>
    public async Task<QuickRegisterResultDto> QuickRegisterAsync(QuickRegisterDto dto, Guid staffId)
    {
        // ── 0. Kiểm tra quyền: chỉ Receptionist (theo đặc tả E2) ─────────────
        var isReceptionist = await _context.Staffs
            .AsNoTracking()
            .AnyAsync(s => s.UserId == staffId && s.Position == StaffPosition.Receptionist);

        if (!isReceptionist)
            throw new Exception("Only Receptionist can use quick-register");

        // ── 1. Validate Package + Pricing ─────────────────────────────────────
        var package = await _context.Packages
            .Include(p => p.Pricings)
            .FirstOrDefaultAsync(p => p.PackageId == dto.PackageId && p.Status == PackageStatus.Active)
            ?? throw new Exception("Package not found or inactive");

        var pricing = package.Pricings.FirstOrDefault(pr => pr.PackagePricingId == dto.PricingId)
            ?? throw new Exception("Pricing not found for this package");

        // ── 2. Tính giá + Promotions ──────────────────────────────────────────
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
                if (promo.StartDate > DateTime.UtcNow || promo.EndDate < DateTime.UtcNow) continue;
                if (promo.ApplicablePackageId.HasValue && promo.ApplicablePackageId != package.PackageId) continue;
                if (promo.CurrentUsage >= promo.MaxUsage) continue;

                discountAmount += promo.DiscountType == DiscountType.Percentage
                    ? originalPrice * (promo.DiscountValue / 100)
                    : promo.DiscountValue;

                promo.CurrentUsage++;
                appliedPromotions.Add(promo.Name);
            }
        }
        if (discountAmount > originalPrice) discountAmount = originalPrice;
        decimal dealPrice = originalPrice - discountAmount;

        // ── 3. Validate email/phone trùng lặp ─────────────────────────────────
        var email = string.IsNullOrWhiteSpace(dto.Email)
            ? $"{dto.Phone}@placeholder.local"
            : dto.Email.Trim().ToLower();

        if (await _userManager.FindByEmailAsync(email) != null)
            throw new Exception($"An account with email '{email}' already exists");

        if (!string.IsNullOrWhiteSpace(dto.Phone))
        {
            if (await _context.Users.AnyAsync(u => u.PhoneNumber == dto.Phone))
                throw new Exception($"An account with phone '{dto.Phone}' already exists");
        }

        // ── 4. Tạo User + Member + AccessCard(Inactive) ───────────────────────
        var tempPassword = RegistrationService.GenerateTempPassword();
        var user = new User
        {
            UserName = email,
            Email = email,
            PhoneNumber = dto.Phone,
            FullName = dto.FullName,
            Birthday = dto.Birthday,
            Gender = dto.Gender,
            CreatedAt = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(user, tempPassword);
        if (!createResult.Succeeded)
            throw new Exception("Failed to create user: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, "Member");
        _context.Members.Add(new Member { UserId = user.Id });

        var cardCode = RegistrationService.GenerateCardCode(user.Id);
        _context.AccessCards.Add(new AccessCard
        {
            AccessCardId = Guid.NewGuid(),
            MemberUserId = user.Id,
            CardCode = cardCode,
            Status = AccessCardStatus.Inactive,
            IssueDate = DateTime.UtcNow
        });

        // ── 5. Tạo Contract(Pending) ──────────────────────────────────────────
        var startDate = dto.StartDate;
        var endDate = startDate.AddMonths(pricing.DurationMonths);

        var contract = new Contract
        {
            ContractId = Guid.NewGuid(),
            MemberUserId = user.Id,
            PackageId = package.PackageId,
            StaffId = staffId,
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            Note = dto.Note,
            Status = ContractStatus.Pending,
            StartDate = startDate,
            EndDate = endDate,
            TotalPrivateSessions = package.PrivatePtLimit,
            TotalGroupSessions = package.GroupPtLimit,
            CreatedAt = DateTime.UtcNow
        };
        _context.Contracts.Add(contract);

        // ── 6. Tạo Invoice(Pending) ───────────────────────────────────────────
        var suffix = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(3));
        decimal totalAmount = dealPrice + dto.TaxAmount;
        var invoice = new Invoice
        {
            InvoiceId = Guid.NewGuid(),
            ContractId = contract.ContractId,
            MemberId = user.Id,
            InvoiceCode = $"INV-{DateTime.UtcNow:yyyyMMdd}-{suffix}",
            Subtotal = originalPrice,
            DiscountAmount = discountAmount,
            TaxAmount = dto.TaxAmount,
            TotalAmount = totalAmount,
            Status = InvoiceStatus.Pending,   // ← chưa thu tiền
            CreatedByStaffId = staffId,
            CreatedAt = DateTime.UtcNow
        };
        _context.Invoices.Add(invoice);

        // ── 7. Optional: link Lead nếu có ────────────────────────────────────
        if (dto.LinkedLeadId.HasValue)
        {
            var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == dto.LinkedLeadId.Value);
            if (lead != null && !lead.ConvertedMemberUserId.HasValue)
            {
                lead.ConvertedMemberUserId = user.Id;
                lead.Status = LeadStatus.Converted;
                lead.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return new QuickRegisterResultDto
        {
            MemberUserId = user.Id,
            ContractId = contract.ContractId,
            InvoiceId = invoice.InvoiceId,
            InvoiceCode = invoice.InvoiceCode,
            OriginalPrice = originalPrice,
            DiscountAmount = discountAmount,
            DealPrice = dealPrice,
            TotalAmountDue = totalAmount,
            ContractStartDate = startDate,
            ContractEndDate = endDate,
            Message = $"Member onboarded. Collect payment at POST /api/invoices/{invoice.InvoiceId}/payment, then activate at POST /api/contracts/{contract.ContractId}/activate"
        };
    }
}
