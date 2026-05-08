using backend.Data;
using backend.DTOs.Invoice;
using backend.Enums;
using backend.Interfaces;
using backend.Models;
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

        var invoice = new Invoice
        {
            InvoiceId = Guid.NewGuid(),
            ContractId = contract.ContractId,
            MemberId = contract.MemberUserId,
            InvoiceCode = invoiceCode,
            Subtotal = contract.DealPrice,
            DiscountAmount = 0, // In this model, deal price is already discounted
            TaxAmount = dto.TaxAmount,
            TotalAmount = contract.DealPrice + dto.TaxAmount,
            Status = InvoiceStatus.Pending,
            CreatedByStaffId = staffId,
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
        var invoice = await _context.Invoices
            .Include(i => i.Payment)
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
            ?? throw new Exception("Invoice not found");

        if (invoice.Status == InvoiceStatus.Paid)
            throw new Exception("Invoice is already fully paid");

        if (dto.Amount <= 0)
            throw new Exception("Payment amount must be greater than zero");

        // The user decided against partial payments. The invoice is either fully paid or not.
        // So we just check if it matches the total. We could allow them to overpay or whatever, but standard is exact or more.
        if (dto.Amount < invoice.TotalAmount)
            throw new Exception($"Payment amount must be at least {invoice.TotalAmount} (Partial payments not supported)");

        var payment = new Payment
        {
            PaymentId = Guid.NewGuid(),
            InvoiceId = invoice.InvoiceId,
            Method = dto.Method,
            RefNo = dto.RefNo,
            Amount = dto.Amount,
            Status = PaymentStatus.Completed,
            ProcessedBy = staffId,
            ProcessedByStaffId = staffId,
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
}
