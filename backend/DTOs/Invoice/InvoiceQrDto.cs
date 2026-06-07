namespace backend.DTOs.Invoice;

/// <summary>
/// Thông tin QR chuyển khoản VietQR cho một hóa đơn.
/// Staff hiển thị lên màn hình / in ra cho khách scan.
/// </summary>
public class InvoiceQrDto
{
    public Guid InvoiceId { get; set; }
    public string InvoiceCode { get; set; } = null!;
    public decimal TotalAmount { get; set; }

    /// <summary>Link ảnh QR từ img.vietqr.io — dùng trực tiếp trong thẻ &lt;img&gt;</summary>
    public string QrImageUrl { get; set; } = null!;

    public string BankId { get; set; } = null!;
    public string AccountNo { get; set; } = null!;
    public string AccountName { get; set; } = null!;

    /// <summary>
    /// Nội dung chuyển khoản — chứa mã hóa đơn để staff đối chiếu.
    /// Ví dụ: "GYM INV-20260509-A1B2C3"
    /// </summary>
    public string TransferDescription { get; set; } = null!;
}
