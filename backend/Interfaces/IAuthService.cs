using backend.DTOs.Auth;

namespace backend.Interfaces;

public interface IAuthService
{
	Task<AuthResultDto> LoginAsync(LoginDto dto, string? ipAddress);
	Task<AuthResultDto> VerifyOtpAsync(VerifyOtpDto dto, string? ipAddress);
}
