namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>Gửi OTP đặt lại mật khẩu.</summary>
    Task SendPasswordResetAsync(string toEmail, string otpCode);

    /// <summary>Gửi email chào mừng + mật khẩu tạm sau khi đăng ký tài khoản bởi admin.</summary>
    Task SendActivationAsync(string toEmail, string fullName, string tempPassword);

    /// <summary>
    /// Gửi email xác nhận đăng ký tự cài: có cả thông tin tài khoản lẫn thông tin hóa đơn cần thanh toán.
    /// </summary>
    Task SendRegistrationConfirmationAsync(
        string toEmail,
        string fullName,
        string tempPassword,
        string packageName,
        decimal totalAmount,
        string invoiceCode);

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
}
