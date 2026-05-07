using backend.DTOs.Auth;

namespace backend.Interfaces;

public interface IAuthService
{
    // UC-2: Login
    Task<AuthResultDto> LoginAsync(LoginDto dto, string? ipAddress);
    Task<AuthResultDto> VerifyOtpAsync(VerifyOtpDto dto, string? ipAddress);

    // UC-3: Reset & Change Password
    Task ForgotPasswordAsync(ForgotPasswordDto dto);
    Task ResetPasswordAsync(ResetPasswordDto dto);
    Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto);

    // UC-5: Manage 2FA
    Task SendTwoFactorSetupOtpAsync(Guid userId);
    Task EnableTwoFactorAsync(Guid userId, TwoFactorOtpDto dto);
    Task DisableTwoFactorAsync(Guid userId, TwoFactorOtpDto dto);
}
