using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
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
        // Try getting Brevo API Key from direct variable or fallback to Password field
        var apiKey = _configuration["Brevo__ApiKey"] ?? _configuration["EmailSettings:Password"];
        var senderEmail = _configuration["EmailSettings:FromEmail"] ?? "bmn233485@gmail.com";
        var senderName = "Gym Management System";

        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("Brevo API Key not found. Falling back to mock email output.");
            _logger.LogInformation("[MOCK EMAIL] To: {ToEmail} | Subject: {Subject} | Body: {Body}", toEmail, subject, body);
            return;
        }

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("api-key", apiKey);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var payload = new
        {
            sender = new { name = senderName, email = senderEmail },
            to = new[] { new { email = toEmail } },
            subject = subject,
            htmlContent = body
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await client.PostAsync("https://api.brevo.com/v3/smtp/email", content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Brevo API Error: {response.StatusCode} - {responseString}");
            }

            _logger.LogInformation("Real email sent to {ToEmail} via Brevo API", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {ToEmail}", toEmail);
            throw new Exception($"Could not send email: {ex.Message}", ex);
        }
    }
}
