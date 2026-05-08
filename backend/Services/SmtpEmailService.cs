using System.Net;
using System.Net.Mail;
using backend.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetAsync(string toEmail, string otpCode)
    {
        var subject = "Your Password Reset Code";
        var body = $"Your password reset code is: <b>{otpCode}</b>. It will expire in 15 minutes.";
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendActivationAsync(string toEmail, string fullName, string tempPassword)
    {
        var subject = "Welcome to Gym Management System";
        var body = $"Hello {fullName},<br><br>Your account has been created successfully. Your temporary password is: <b>{tempPassword}</b><br><br>Please login and change your password.";
        await SendEmailAsync(toEmail, subject, body);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var host = _configuration["EmailSettings:Host"] ?? "smtp.gmail.com";
        var port = int.TryParse(_configuration["EmailSettings:Port"], out var p) ? p : 587;
        var user = _configuration["EmailSettings:Username"];
        var pass = _configuration["EmailSettings:Password"];
        var from = _configuration["EmailSettings:FromEmail"] ?? user;

        if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
        {
            _logger.LogWarning("EmailSettings (Username/Password) not found in appsettings.json. Falling back to mock email output.");
            _logger.LogInformation("[MOCK EMAIL] To: {ToEmail} | Subject: {Subject} | Body: {Body}", toEmail, subject, body);
            return;
        }

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(user, pass),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(from!, "Gym Management System"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        mailMessage.To.Add(toEmail);

        try
        {
            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Real email sent to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {ToEmail}", toEmail);
            throw new Exception("Could not send email. Please check SMTP configuration.", ex);
        }
    }
}
