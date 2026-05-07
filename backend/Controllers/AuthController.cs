using System.Security.Claims;
using backend.DTOs.Auth;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // ===================== UC-2: LOGIN =====================

    [AllowAnonymous]
    [HttpPost("login")]
    [SwaggerOperation(
        Summary = "Đăng nhập",
        Description = "Đăng nhập bằng email hoặc số điện thoại. Nếu bật two-factor thì hệ thống yêu cầu OTP, nếu không sẽ trả về JWT token."
    )]
    public async Task<ApiResponse<AuthResultDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto, GetIpAddress());
        var message = result.RequiresOtp ? "OTP required" : "Login successful";
        return new ApiResponse<AuthResultDto>(result, message);
    }

    [AllowAnonymous]
    [HttpPost("verify-otp")]
    [SwaggerOperation(
        Summary = "Xác thực OTP đăng nhập",
        Description = "Xác thực OTP cho tài khoản đã bật two-factor và trả về JWT token nếu hợp lệ."
    )]
    public async Task<ApiResponse<AuthResultDto>> VerifyOtp([FromBody] VerifyOtpDto dto)
    {
        var result = await _authService.VerifyOtpAsync(dto, GetIpAddress());
        return new ApiResponse<AuthResultDto>(result, "Login successful");
    }

    // ===================== UC-3: RESET & CHANGE PASSWORD =====================

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    [SwaggerOperation(
        Summary = "Quên mật khẩu",
        Description = "Gửi OTP 6 chữ số đến email hoặc SMS để đặt lại mật khẩu. Luôn trả 200 để tránh user enumeration."
    )]
    public async Task<ApiResponse<object>> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(dto);
        return new ApiResponse<object>(true, "If the account exists, a reset code has been sent");
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    [SwaggerOperation(
        Summary = "Đặt lại mật khẩu bằng OTP",
        Description = "Nhập OTP nhận được qua email/SMS cùng mật khẩu mới. OTP hết hiệu lực sau 15 phút hoặc sau 5 lần nhập sai."
    )]
    public async Task<ApiResponse<object>> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        await _authService.ResetPasswordAsync(dto);
        return new ApiResponse<object>(true, "Password updated successfully");
    }

    [Authorize]
    [HttpPost("change-password")]
    [SwaggerOperation(
        Summary = "Đổi mật khẩu",
        Description = "Đổi mật khẩu khi đã đăng nhập. Yêu cầu mật khẩu hiện tại."
    )]
    public async Task<ApiResponse<object>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetCurrentUserId();
        await _authService.ChangePasswordAsync(userId, dto);
        return new ApiResponse<object>(true, "Password changed successfully");
    }

    // ===================== UC-5: 2FA MANAGEMENT =====================

    [Authorize]
    [HttpPost("2fa/send-setup-otp")]
    [SwaggerOperation(
        Summary = "Gửi OTP để bật/tắt 2FA",
        Description = "Gửi OTP xác nhận đến email/SMS. Cần nhập OTP này ở bước enable/disable để xác nhận danh tính."
    )]
    public async Task<ApiResponse<object>> SendTwoFactorSetupOtp()
    {
        var userId = GetCurrentUserId();
        await _authService.SendTwoFactorSetupOtpAsync(userId);
        return new ApiResponse<object>(true, "OTP sent to your email/phone");
    }

    [Authorize]
    [HttpPost("2fa/enable")]
    [SwaggerOperation(
        Summary = "Bật Two-Factor Authentication",
        Description = "Xác nhận OTP và bật 2FA cho tài khoản. Từ lần đăng nhập tiếp theo sẽ yêu cầu OTP."
    )]
    public async Task<ApiResponse<object>> EnableTwoFactor([FromBody] TwoFactorOtpDto dto)
    {
        var userId = GetCurrentUserId();
        await _authService.EnableTwoFactorAsync(userId, dto);
        return new ApiResponse<object>(true, "Two-factor authentication enabled");
    }

    [Authorize]
    [HttpPost("2fa/disable")]
    [SwaggerOperation(
        Summary = "Tắt Two-Factor Authentication",
        Description = "Xác nhận OTP và tắt 2FA cho tài khoản."
    )]
    public async Task<ApiResponse<object>> DisableTwoFactor([FromBody] TwoFactorOtpDto dto)
    {
        var userId = GetCurrentUserId();
        await _authService.DisableTwoFactorAsync(userId, dto);
        return new ApiResponse<object>(true, "Two-factor authentication disabled");
    }

    // ===================== HELPERS =====================

    private string? GetIpAddress()
        => HttpContext.Connection.RemoteIpAddress?.ToString();

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Unauthorized");
        return Guid.Parse(claim);
    }
}