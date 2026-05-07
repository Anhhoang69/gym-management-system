using backend.Interfaces;

namespace backend.Services;

/// <summary>
/// Mock implementation — logs to console.
/// Replace with SendGrid / SMTP in production without changing any caller code.
/// </summary>
public class MockEmailService : IEmailService
{
    private readonly ILogger<MockEmailService> _logger;

    public MockEmailService(ILogger<MockEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetAsync(string toEmail, string otpCode)
    {
        _logger.LogInformation(
            "[MOCK EMAIL] Password Reset OTP → {Email} | OTP: {Otp}",
            toEmail, otpCode);

        return Task.CompletedTask;
    }

    public Task SendActivationAsync(string toEmail, string fullName, string tempPassword)
    {
        _logger.LogInformation(
            "[MOCK EMAIL] Account Activation → {Email} | Name: {Name} | TempPassword: {Pass}",
            toEmail, fullName, tempPassword);

        return Task.CompletedTask;
    }
}
