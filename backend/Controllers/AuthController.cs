using backend.DTOs.Auth;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

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

    private string? GetIpAddress()
    {
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}