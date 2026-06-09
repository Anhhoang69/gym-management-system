namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>Gửi OTP đặt lại mật khẩu.</summary>
    Task SendPasswordResetAsync(string toEmail, string otpCode);

    /// <summary>Gửi email chào mừng + mật khẩu tạm sau khi đăng ký tài khoản bởi admin.</summary>
    Task SendActivationAsync(string toEmail, string fullName, string tempPassword);

    /// <summary>
    /// Gửi email xác nhận đăng ký tự điền: có cả thông tin tài khoản lẫn thông tin hóa đơn cần thanh toán.
    /// Nếu paymentUrl != null → hiển thị nút "Thanh toán ngay" thay vì nhắc đến quầy.
    /// </summary>
    Task SendRegistrationConfirmationAsync(
        string toEmail,
        string fullName,
        string tempPassword,
        string packageName,
        decimal totalAmount,
        string invoiceCode,
        string? paymentUrl = null,
        DateTime? paymentExpiredAt = null);

    /// <summary>
    /// Gửi email thông báo hợp đồng đã kích hoạt sau khi thanh toán thành công.
    /// Chứa: mã thẻ, tên gói, ngày hết hạn, số tiền đã thanh toán.
    /// </summary>
    Task SendMembershipActivatedAsync(
        string toEmail,
        string fullName,
        string cardCode,
        string packageName,
        DateTime startDate,
        DateTime endDate,
        decimal amountPaid);

    /// <summary>
    /// Gửi link VNPay cho member sau khi tạo payment URL.
    /// </summary>
    Task SendVNPayPaymentLinkAsync(
        string toEmail,
        string fullName,
        string invoiceCode,
        decimal amount,
        string paymentUrl,
        DateTime expiredAt);

    /// <summary>
    /// Gửi thông báo thanh toán VNPay thất bại kèm link thử lại.
    /// </summary>
    Task SendPaymentFailedAsync(
        string toEmail,
        string fullName,
        string invoiceCode,
        string retryUrl);
}
