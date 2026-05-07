namespace backend.Interfaces;

public interface ISmsService
{
    /// <summary>Gửi OTP đặt lại mật khẩu qua SMS.</summary>
    Task SendPasswordResetAsync(string toPhone, string otpCode);

    /// <summary>Gửi SMS kích hoạt tài khoản sau khi đăng ký.</summary>
    Task SendActivationAsync(string toPhone, string fullName, string tempPassword);
}
