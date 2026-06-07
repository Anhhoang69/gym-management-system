using backend.DTOs.Invoice;

namespace backend.Interfaces;

public interface IVietQrService
{
    /// <summary>
    /// Sinh QR chuyển khoản VietQR cho hóa đơn.
    /// Chỉ hóa đơn có trạng thái Pending mới được generate.
    /// </summary>
    Task<InvoiceQrDto> GenerateAsync(Guid invoiceId, Guid staffId);
}
