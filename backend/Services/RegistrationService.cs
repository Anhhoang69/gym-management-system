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
        // ---- Validate uniqueness ----
        var emailNorm = dto.Email.Trim().ToLowerInvariant();
        if (await _context.Users.AnyAsync(u => u.NormalizedEmail == emailNorm.ToUpperInvariant()))
            throw new Exception("Email is already registered");

        if (await _context.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber))
            throw new Exception("Phone number is already registered");

        // ---- Validate Package + Pricing ----
        var package = await _context.Packages
            .Include(p => p.Pricings)
            .FirstOrDefaultAsync(p => p.PackageId == dto.PackageId && p.Status == PackageStatus.Active)
            ?? throw new Exception("Package not found or inactive");

        var pricing = package.Pricings.FirstOrDefault(p => p.PackagePricingId == dto.PricingId)
            ?? throw new Exception("Pricing tier not found for this package");

        // ---- Validate Branch ----
        var branch = await _context.Branches.FindAsync(dto.BranchId)
            ?? throw new Exception("Branch not found");

        // ---- Begin atomic transaction ----
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Generate temp password
            var tempPassword = GenerateTempPassword();

            // 2. Create User
            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = emailNorm,
                Email = emailNorm,
                NormalizedEmail = emailNorm.ToUpperInvariant(),
                NormalizedUserName = emailNorm.ToUpperInvariant(),
                FullName = dto.FullName.Trim(),
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                Birthday = dto.Birthday,
                Address = dto.Address,
                InitialBranchId = dto.BranchId,
                Status = UserStatus.Active,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user, tempPassword);
            if (!createResult.Succeeded)
                throw new Exception(string.Join("; ", createResult.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Member");

            // 3. Create Member record
            var member = new Member { UserId = user.Id };
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            // 4. Create Contract
            var now = DateTime.UtcNow;
            var contract = new Contract
            {
                ContractId = Guid.NewGuid(),
                MemberUserId = user.Id,
                PackageId = dto.PackageId,
                StaffId = Guid.Empty,       // system-created; no staff assigned at self-registration
                DealPrice = pricing.Price,
                Status = ContractStatus.Active,
                StartDate = now,
                EndDate = now.AddMonths(pricing.DurationMonths),
                TotalPrivateSessions = package.PrivatePtLimit,
                TotalGroupSessions = package.GroupPtLimit,
                CreatedAt = now
            };
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            // 5. Create Invoice
            var invoiceCode = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";
            var invoice = new Invoice
            {
                InvoiceId = Guid.NewGuid(),
                ContractId = contract.ContractId,
                MemberId = user.Id,
                InvoiceCode = invoiceCode,
                Subtotal = pricing.Price,
                DiscountAmount = 0,
                TaxAmount = 0,
                TotalAmount = pricing.Price,
                Status = InvoiceStatus.Paid,
                CreatedByStaffId = Guid.Empty, // system-created
                CreatedAt = now
            };
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // 6. Create Payment (mocked as Paid)
            var payment = new Payment
            {
                PaymentId = Guid.NewGuid(),
                InvoiceId = invoice.InvoiceId,
                Method = dto.PaymentMethod,
                Amount = pricing.Price,
                Status = PaymentStatus.Completed,
                ProcessedBy = Guid.Empty,
                ProcessedByStaffId = Guid.Empty,
                CreatedAt = now
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            // 7. Send activation email / SMS (outside transaction — not critical for rollback)
            if (!string.IsNullOrWhiteSpace(user.Email))
                await _emailService.SendActivationAsync(user.Email, user.FullName ?? dto.FullName, tempPassword);
            else if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                await _smsService.SendActivationAsync(user.PhoneNumber, user.FullName ?? dto.FullName, tempPassword);

            return new RegisterResultDto
            {
                UserId = user.Id,
                Email = user.Email!,
                TempPassword = tempPassword,
                ContractId = contract.ContractId,
                InvoiceId = invoice.InvoiceId,
                Message = "Account created successfully. Check your email for login credentials."
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static string GenerateTempPassword()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
        return string.Concat(Enumerable.Range(0, 10)
            .Select(_ => chars[RandomNumberGenerator.GetInt32(0, chars.Length)]));
    }
}
