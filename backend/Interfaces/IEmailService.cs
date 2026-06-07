namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>Gửi OTP đặt lại mật khẩu.</summary>
    Task SendPasswordResetAsync(string toEmail, string otpCode);

    /// <summary>Gửi email chào mừng + mật khẩu tạm sau khi đăng ký tài khoản.</summary>
    Task SendActivationAsync(string toEmail, string fullName, string tempPassword);

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
