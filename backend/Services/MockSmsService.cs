using backend.Interfaces;

namespace backend.Services;

/// <summary>
/// Mock implementation — logs to console.
/// Replace with Twilio / other SMS provider in production without changing any caller code.
/// </summary>
public class MockSmsService : ISmsService
{
    private readonly ILogger<MockSmsService> _logger;

    public MockSmsService(ILogger<MockSmsService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetAsync(string toPhone, string otpCode)
    {
        _logger.LogInformation(
            "[MOCK SMS] Password Reset OTP → {Phone} | OTP: {Otp}",
            toPhone, otpCode);

        return Task.CompletedTask;
    }

    public Task SendActivationAsync(string toPhone, string fullName, string tempPassword)
    {
        _logger.LogInformation(
            "[MOCK SMS] Account Activation → {Phone} | Name: {Name} | TempPassword: {Pass}",
            toPhone, fullName, tempPassword);

        return Task.CompletedTask;
    }
}
