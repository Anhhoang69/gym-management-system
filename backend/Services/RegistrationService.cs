using System.Security.Cryptography;
using backend.Data;
using backend.DTOs.Register;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class RegistrationService : IRegistrationService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public RegistrationService(
        ApplicationDbContext context,
        UserManager<User> userManager,
        IEmailService emailService,
        ISmsService smsService)
    {
        _context = context;
        _userManager = userManager;
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task<RegisterResultDto> RegisterMemberAsync(RegisterMemberDto dto)
    {
        // ── Validate uniqueness ──────────────────────────────────────────────
        var emailNorm = dto.Email.Trim().ToLowerInvariant();
        if (await _context.Users.AnyAsync(u => u.NormalizedEmail == emailNorm.ToUpperInvariant()))
            throw new Exception("Email is already registered");

        if (await _context.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber))
            throw new Exception("Phone number is already registered");

        // ── Validate Package + Pricing ──────────────────────────────────────
        var package = await _context.Packages
            .Include(p => p.Pricings)
            .FirstOrDefaultAsync(p => p.PackageId == dto.PackageId && p.Status == PackageStatus.Active)
            ?? throw new Exception("Package not found or inactive");

        var pricing = package.Pricings.FirstOrDefault(p => p.PackagePricingId == dto.PricingId)
            ?? throw new Exception("Pricing tier not found for this package");

        // ── Validate Branch ─────────────────────────────────────────────────
        _ = await _context.Branches.FindAsync(dto.BranchId)
            ?? throw new Exception("Branch not found");

        // ── Begin atomic transaction ─────────────────────────────────────────
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Generate temp password & create User
            var tempPassword = GenerateTempPassword();
            var user = new User
            {
                Id               = Guid.NewGuid(),
                UserName         = emailNorm,
                Email            = emailNorm,
                NormalizedEmail  = emailNorm.ToUpperInvariant(),
                NormalizedUserName = emailNorm.ToUpperInvariant(),
                FullName         = dto.FullName.Trim(),
                PhoneNumber      = dto.PhoneNumber,
                Gender           = dto.Gender,
                Birthday         = dto.Birthday,
                Address          = dto.Address,
                InitialBranchId  = dto.BranchId,
                Status           = UserStatus.Active,
                CreatedAt        = DateTime.UtcNow,
                EmailConfirmed   = true
            };

            var createResult = await _userManager.CreateAsync(user, tempPassword);
            if (!createResult.Succeeded)
                throw new Exception(string.Join("; ", createResult.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Member");

            // 2. Create Member record
            var member = new Member { UserId = user.Id };
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            var now = DateTime.UtcNow;

            // 3. Create Contract — Pending (chờ thanh toán)
            var contract = new Contract
            {
                ContractId            = Guid.NewGuid(),
                MemberUserId          = user.Id,
                PackageId             = dto.PackageId,
                StaffId               = Guid.Empty,   // system-created; no staff
                OriginalPrice         = pricing.Price,
                DiscountAmount        = 0,
                DealPrice             = pricing.Price,
                Status                = ContractStatus.Pending,
                StartDate             = now,
                EndDate               = now.AddMonths(pricing.DurationMonths),
                TotalPrivateSessions  = package.PrivatePtLimit,
                TotalGroupSessions    = package.GroupPtLimit,
                CreatedAt             = now
            };
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            // 4. Create Invoice — Pending (chưa thu tiền)
            var suffix      = Convert.ToHexString(RandomNumberGenerator.GetBytes(3));
            var invoiceCode = $"INV-{now:yyyyMMdd}-{suffix}";
            var invoice = new Invoice
            {
                InvoiceId         = Guid.NewGuid(),
                ContractId        = contract.ContractId,
                MemberId          = user.Id,
                InvoiceCode       = invoiceCode,
                Subtotal          = pricing.Price,
                DiscountAmount    = 0,
                TaxAmount         = 0,
                TotalAmount       = pricing.Price,
                Status            = InvoiceStatus.Pending,
                CreatedByStaffId  = Guid.Empty,
                CreatedAt         = now
            };
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // AccessCard sẽ được tạo khi staff activate (POST /api/contracts/{id}/activate)

            await transaction.CommitAsync();

            // 5. Gửi email chào + mật khẩu tạm (ngoài transaction — lỗi không rollback)
            if (!string.IsNullOrWhiteSpace(user.Email))
                await _emailService.SendActivationAsync(user.Email, user.FullName ?? dto.FullName, tempPassword);
            else if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                await _smsService.SendActivationAsync(user.PhoneNumber, user.FullName ?? dto.FullName, tempPassword);

            return new RegisterResultDto
            {
                UserId         = user.Id,
                Email          = user.Email!,
                TempPassword   = tempPassword,
                ContractId     = contract.ContractId,
                InvoiceId      = invoice.InvoiceId,
                TotalAmountDue = invoice.TotalAmount,
                Message        = $"Account created. Please pay {invoice.TotalAmount:N0} VND (Invoice: {invoiceCode}) to activate membership."
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    internal static string GenerateTempPassword()
    {
        const string uppers   = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lowers   = "abcdefghjkmnpqrstuvwxyz";
        const string digits   = "23456789";
        const string specials = "!@#$*";

        var chars = new[]
        {
            uppers  [RandomNumberGenerator.GetInt32(0, uppers.Length)],
            lowers  [RandomNumberGenerator.GetInt32(0, lowers.Length)],
            digits  [RandomNumberGenerator.GetInt32(0, digits.Length)],
            specials[RandomNumberGenerator.GetInt32(0, specials.Length)]
        }.ToList();

        const string allChars = uppers + lowers + digits + specials;
        for (int i = 0; i < 6; i++)
            chars.Add(allChars[RandomNumberGenerator.GetInt32(0, allChars.Length)]);

        return new string(chars.OrderBy(_ => RandomNumberGenerator.GetInt32(0, 100)).ToArray());
    }

    /// <summary>Format: GYM-{8 ký tự hex ngẫu nhiên viết hoa}</summary>
    internal static string GenerateCardCode(Guid userId)
    {
        var suffix = Convert.ToHexString(RandomNumberGenerator.GetBytes(4));
        return $"GYM-{suffix}";
    }
}
