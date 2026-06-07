using backend.Data;
using backend.DTOs.Invoice;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace backend.Services;

public class InvoiceService : IInvoiceService
{
    private readonly ApplicationDbContext _context;

    public InvoiceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InvoiceDto> IssueInvoiceAsync(IssueInvoiceDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var contract = await _context.Contracts
            .Include(c => c.Invoice)
            .FirstOrDefaultAsync(c => c.ContractId == dto.ContractId)
            ?? throw new Exception("Contract not found");

        if (contract.Invoice != null)
            throw new Exception("Invoice already exists for this contract");

        if (contract.Status != ContractStatus.Pending)
            throw new Exception("Contract must be in Pending status to issue an invoice");

        var suffix = Convert.ToHexString(RandomNumberGenerator.GetBytes(3));
        string invoiceCode = $"INV-{DateTime.UtcNow:yyyyMMdd}-{suffix}";

        var isStaffExist = await _context.Staffs.AnyAsync(s => s.UserId == staffId);
        var invoice = new Invoice
        {
            InvoiceId = Guid.NewGuid(),
            ContractId = contract.ContractId,
            MemberId = contract.MemberUserId,
            InvoiceCode = invoiceCode,
            Subtotal = contract.OriginalPrice,
            DiscountAmount = contract.DiscountAmount,
            TaxAmount = dto.TaxAmount,
            TotalAmount = contract.DealPrice + dto.TaxAmount,
            Status = InvoiceStatus.Pending,
            CreatedByStaffId = isStaffExist ? staffId : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        return new InvoiceDto
        {
            InvoiceId = invoice.InvoiceId,
            ContractId = invoice.ContractId,
            InvoiceCode = invoice.InvoiceCode,
            Subtotal = invoice.Subtotal,
            DiscountAmount = invoice.DiscountAmount,
            TaxAmount = invoice.TaxAmount,
            TotalAmount = invoice.TotalAmount,
            Status = invoice.Status,
            CreatedAt = invoice.CreatedAt
        };
    }

    public async Task<InvoiceDto> GetInvoiceAsync(Guid invoiceId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
            ?? throw new Exception("Invoice not found");

        return new InvoiceDto
        {
            InvoiceId = invoice.InvoiceId,
            ContractId = invoice.ContractId,
            InvoiceCode = invoice.InvoiceCode,
            Subtotal = invoice.Subtotal,
            DiscountAmount = invoice.DiscountAmount,
            TaxAmount = invoice.TaxAmount,
            TotalAmount = invoice.TotalAmount,
            Status = invoice.Status,
            CreatedAt = invoice.CreatedAt
        };
    }

    public async Task<(PaymentDto Payment, string NewInvoiceStatus)> CollectPaymentAsync(Guid invoiceId, CollectPaymentDto dto, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var invoice = await _context.Invoices
            .Include(i => i.Payment)
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
            ?? throw new Exception("Invoice not found");

        if (invoice.Status == InvoiceStatus.Paid)
            throw new Exception("Invoice is already fully paid");

        decimal effectiveAmount;

        // Gói Trial giá 0đ: tự động xác nhận không cần nhập tiền
        if (invoice.TotalAmount == 0)
        {
            effectiveAmount = 0;
        }
        else
        {
            if (dto.Amount <= 0)
                throw new Exception("Payment amount must be greater than zero");

            if (dto.Amount < invoice.TotalAmount)
                throw new Exception($"Payment amount must be at least {invoice.TotalAmount:N0} VND (Partial payments not supported)");

            effectiveAmount = dto.Amount;
        }

        var isStaffExist = await _context.Staffs.AnyAsync(s => s.UserId == staffId);
        var resolvedStaffId = staffId;
        if (!isStaffExist)
        {
            var firstStaff = await _context.Staffs.FirstOrDefaultAsync();
            if (firstStaff != null)
            {
                resolvedStaffId = firstStaff.UserId;
            }
        }

        var payment = new Payment
        {
            PaymentId = Guid.NewGuid(),
            InvoiceId = invoice.InvoiceId,
            Method = dto.Method,
            RefNo = dto.RefNo,
            Amount = effectiveAmount,
            Status = PaymentStatus.Completed,
            ProcessedBy = resolvedStaffId,
            ProcessedByStaffId = resolvedStaffId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        
        invoice.Status = InvoiceStatus.Paid;
        invoice.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var paymentDto = new PaymentDto
        {
            PaymentId = payment.PaymentId,
            InvoiceId = payment.InvoiceId,
            Method = payment.Method,
            RefNo = payment.RefNo,
            Amount = payment.Amount,
            Status = payment.Status,
            CreatedAt = payment.CreatedAt
        };

        return (paymentDto, invoice.Status.ToString());
    }

    public async Task<PagedResult<InvoiceListDto>> GetInvoicesAsync(InvoiceQueryDto query, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var q = _context.Invoices
            .Include(i => i.Member).ThenInclude(m => m.User)
            .Include(i => i.CreatedByStaff).ThenInclude(s => s.User)
            .AsQueryable();

        if (query.BranchId.HasValue)
            q = q.Where(i => i.CreatedByStaff.BranchId == query.BranchId.Value);

        if (query.Status.HasValue)
            q = q.Where(i => i.Status == query.Status.Value);

        if (query.FromDate.HasValue)
            q = q.Where(i => i.CreatedAt >= query.FromDate.Value);

        if (query.ToDate.HasValue)
            q = q.Where(i => i.CreatedAt <= query.ToDate.Value);

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(i => i.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(i => new InvoiceListDto
            {
                InvoiceId = i.InvoiceId,
                ContractId = i.ContractId,
                InvoiceCode = i.InvoiceCode,
                MemberName = i.Member.User.FullName ?? "Unknown",
                TotalAmount = i.TotalAmount,
                Status = i.Status,
                CreatedAt = i.CreatedAt,
                CreatedByStaffName = i.CreatedByStaff.User.FullName ?? "Unknown"
            })
            .ToListAsync();

        return new PagedResult<InvoiceListDto>
        {
            Items = items,
            TotalItems = total,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)query.PageSize)
        };
    }

    public async Task<bool> CancelInvoiceAsync(Guid invoiceId, Guid staffId)
    {
        await EnsureC2PermissionAsync(staffId);

        var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        if (invoice == null) return false;

        if (invoice.Status == InvoiceStatus.Paid)
        {
            throw new Exception("Không thể hủy hóa đơn đã thanh toán thành công");
        }

        invoice.Status = InvoiceStatus.Cancelled;
        invoice.UpdatedAt = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            AuditLogId = Guid.NewGuid(),
            UserId = staffId,
            Action = "CancelInvoice",
            EntityType = "Invoice",
            EntityId = invoice.InvoiceId,
            CreatedAt = DateTime.UtcNow,
            NewValue = "Cancelled"
        });

        await _context.SaveChangesAsync();
        return true;
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

        var isSuperAdmin = await _context.UserRoles
            .AsNoTracking()
            .AnyAsync(ur => ur.UserId == staffUserId &&
                           _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "SuperAdmin"));

        if (!isSuperAdmin)
            throw new Exception("You do not have permission to manage invoices (requires Sales, Receptionist, BranchAdmin or SuperAdmin)");
    }
}
