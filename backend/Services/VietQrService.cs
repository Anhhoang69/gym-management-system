using backend.Data;
using backend.DTOs.Invoice;
using backend.Enums;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class VietQrService : IVietQrService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public VietQrService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<InvoiceQrDto> GenerateAsync(Guid invoiceId, Guid staffId)
    {
        var invoice = await _context.Invoices
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
            ?? throw new Exception("Invoice not found");

        // Chỉ Pending mới cho generate QR
        if (invoice.Status == InvoiceStatus.Paid)
            throw new Exception("Invoice is already Paid — no need to generate QR");

        if (invoice.Status != InvoiceStatus.Pending)
            throw new Exception($"Cannot generate QR for invoice with status '{invoice.Status}'");

        var bankId      = _config["VietQR:BankId"]      ?? "MB";
        var accountNo   = _config["VietQR:AccountNo"]   ?? "0000000000";
        var accountName = _config["VietQR:AccountName"] ?? "GYM MANAGEMENT";

        // Nội dung chứa mã hóa đơn để staff đối chiếu
        var description = $"GYM {invoice.InvoiceCode}";

        var qrImageUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png" +
                         $"?amount={invoice.TotalAmount:0}" +
                         $"&addInfo={Uri.EscapeDataString(description)}" +
                         $"&accountName={Uri.EscapeDataString(accountName)}";

        return new InvoiceQrDto
        {
            InvoiceId           = invoice.InvoiceId,
            InvoiceCode         = invoice.InvoiceCode,
            TotalAmount         = invoice.TotalAmount,
            QrImageUrl          = qrImageUrl,
            BankId              = bankId,
            AccountNo           = accountNo,
            AccountName         = accountName,
            TransferDescription = description
        };
    }
}
