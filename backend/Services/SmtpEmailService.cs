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
        var subject = "Mã xác nhận đặt lại mật khẩu";
        var body = $"Mã xác nhận đặt lại mật khẩu của bạn là: <b>{otpCode}</b>. Mã này sẽ hết hạn trong 15 phút.";
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendActivationAsync(string toEmail, string fullName, string tempPassword)
    {
        var subject = "Chào mừng bạn đến với Gym Management System";
        var body = $"Xin chào {fullName},<br><br>Tài khoản của bạn đã được tạo thành công. Mật khẩu tạm thời của bạn là: <b>{tempPassword}</b><br><br>Vui lòng đăng nhập và thay đổi mật khẩu của bạn.";
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendMembershipActivatedAsync(
        string toEmail,
        string fullName,
        string cardCode,
        string packageName,
        DateTime startDate,
        DateTime endDate,
        decimal amountPaid)
    {
        var subject = "[Đã kích hoạt] Hợp đồng hội viên của bạn";
        var body = $"""
            <h2>Xin chào {fullName},</h2>
            <p>Hợp đồng hội viên của bạn đã được <strong>kích hoạt thành công</strong>!</p>
            <table style="border-collapse:collapse;width:100%;max-width:480px">
              <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Mã thẻ</b></td><td style="padding:8px;border:1px solid #ddd">{cardCode}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Gói tập</b></td><td style="padding:8px;border:1px solid #ddd">{packageName}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Ngày bắt đầu</b></td><td style="padding:8px;border:1px solid #ddd">{startDate:dd/MM/yyyy}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Hết hạn</b></td><td style="padding:8px;border:1px solid #ddd">{endDate:dd/MM/yyyy}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><b>Số tiền đã thanh toán</b></td><td style="padding:8px;border:1px solid #ddd">{amountPaid:N0} VND</td></tr>
            </table>
            <br><p>Hãy xuất trình mã thẻ <strong>{cardCode}</strong> khi vào phòng gym.</p>
            <p>Cảm ơn bạn đã tin tưởng! Chúc bạn tập luyện hiệu quả. 💪</p>
            """;
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
            throw new Exception($"Could not send email: {ex.Message} | Inner: {ex.InnerException?.Message}", ex);
        }
    }
}
