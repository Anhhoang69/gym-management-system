namespace backend.Interfaces;

public interface IEmailService
{
    /// <summary>Gửi OTP đặt lại mật khẩu.</summary>
    Task SendPasswordResetAsync(string toEmail, string otpCode);

    /// <summary>Gửi email kích hoạt tài khoản sau khi đăng ký.</summary>
    Task SendActivationAsync(string toEmail, string fullName, string tempPassword);
}
