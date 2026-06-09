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
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:5173";
        var subject = "[GYM] Tài khoản của bạn đã được tạo thành công";
        var body = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px">
              <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px;border-radius:8px 8px 0 0;text-align:center">
                <h1 style="color:#e2b96f;margin:0;font-size:22px">💪 GYM Management System</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
                <h2 style="color:#1a1a2e;margin-top:0">Xin chào {fullName}!</h2>
                <p style="color:#555;line-height:1.6">Tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold;width:40%">📧 Email đăng nhập</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{toEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">🔑 Mật khẩu</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0"><strong style="font-size:16px;color:#d32f2f">{tempPassword}</strong></td>
                  </tr>
                </table>
                <p style="color:#e65100;background:#fff3e0;padding:12px;border-radius:6px;border-left:4px solid #ff9800">
                  ⚠️ <strong>Lưu ý bảo mật:</strong> Vui lòng đăng nhập và đổi mật khẩu ngay sau lần đăng nhập đầu tiên.
                </p>
                <div style="text-align:center;margin-top:24px">
                  <a href="{appUrl}" style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#e2b96f;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px">🔐 Đăng nhập ngay</a>
                </div>
                <p style="color:#999;font-size:12px;margin-top:24px;text-align:center">Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ quản lý.</p>
              </div>
            </div>
            """;
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendRegistrationConfirmationAsync(
        string toEmail,
        string fullName,
        string tempPassword,
        string packageName,
        decimal totalAmount,
        string invoiceCode,
        string? paymentUrl = null,
        DateTime? paymentExpiredAt = null)
    {
        var appUrl = _configuration["AppUrl"] ?? "http://localhost:5173";
        var isFree = totalAmount == 0;
        var amountText = isFree
            ? "<span style=\"color:#2e7d32;font-weight:bold\">Miễn phí 🎁</span>"
            : $"<strong style=\"color:#c62828\">{totalAmount:N0} VND</strong>";

        string paymentNote;
        if (isFree)
        {
            paymentNote = "<p style=\"color:#2e7d32;background:#e8f5e9;padding:12px;border-radius:6px;border-left:4px solid #66bb6a\">&#127873; <strong>Gói dùng thử miễn phí!</strong> Nhân viên sẽ kích hoạt thẻ ngay khi bạn đến gym.</p>";
        }
        else if (!string.IsNullOrEmpty(paymentUrl))
        {
            var expireText = paymentExpiredAt.HasValue
                ? $" (hiệu lực đến {paymentExpiredAt.Value.AddHours(7):HH:mm dd/MM/yyyy})"
                : "";
            paymentNote = $"""<div style="text-align:center;margin-top:16px"><a href="{paymentUrl}" style="background:linear-gradient(135deg,#e65100,#ff8f00);color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">&#128179; Thanh toán ngay {totalAmount:N0} VND{expireText}</a></div>""";
        }
        else
        {
            paymentNote = $"<p style=\"color:#e65100;background:#fff3e0;padding:12px;border-radius:6px;border-left:4px solid #ff9800\">&#128179; <strong>Lưu ý:</strong> Vui lòng thanh toán <strong>{totalAmount:N0} VND</strong> (Mã HĐ: <code>{invoiceCode}</code>) để kích hoạt thẻ tập.</p>";
        }

        var subject = "[GYM] Đăng ký thành công – Thông tin tài khoản & Hóa đơn";
        var body = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px">
              <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px;border-radius:8px 8px 0 0;text-align:center">
                <h1 style="color:#e2b96f;margin:0;font-size:22px">💪 GYM Management System</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
                <h2 style="color:#1a1a2e;margin-top:0">Xin chào {fullName}!</h2>
                <p style="color:#555;line-height:1.6">Bạn đã đăng ký thành công. Dưới đây là thông tin đăng nhập và chi tiết đăng ký:</p>
                <h3 style="color:#1a1a2e;border-bottom:2px solid #e2b96f;padding-bottom:6px">🔐 Thông tin tài khoản</h3>
                <table style="width:100%;border-collapse:collapse;margin:12px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold;width:40%">📧 Email</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{toEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">🔑 Mật khẩu tạm</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0"><strong style="font-size:16px;color:#d32f2f">{tempPassword}</strong></td>
                  </tr>
                </table>
                <p style="color:#e65100;background:#fff3e0;padding:10px 12px;border-radius:6px;border-left:4px solid #ff9800;font-size:13px">
                  ⚠️ <strong>Bảo mật:</strong> Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!
                </p>
                <h3 style="color:#1a1a2e;border-bottom:2px solid #e2b96f;padding-bottom:6px;margin-top:24px">📋 Thông tin đăng ký</h3>
                <table style="width:100%;border-collapse:collapse;margin:12px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold;width:40%">📦 Gói tập</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">🧾 Mã hóa đơn</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0"><code style="background:#f5f5f5;padding:2px 6px;border-radius:4px">{invoiceCode}</code></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">💰 Số tiền</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{amountText}</td>
                  </tr>
                </table>
                {paymentNote}
                <div style="text-align:center;margin-top:24px">
                  <a href="{appUrl}" style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#e2b96f;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px">🔐 Đăng nhập ngay</a>
                </div>
                <p style="color:#999;font-size:12px;margin-top:24px;text-align:center">Nếu bạn không thực hiện đăng ký này, vui lòng liên hệ quản lý.</p>
              </div>
            </div>
            """;
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
        var subject = "[GYM] 🎉 Hợp đồng hội viên đã được kích hoạt!";
        var body = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px">
              <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px;border-radius:8px 8px 0 0;text-align:center">
                <h1 style="color:#e2b96f;margin:0;font-size:22px">💪 GYM Management System</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
                <h2 style="color:#1a1a2e;margin-top:0">Xin chào {fullName}!</h2>
                <p style="color:#555;line-height:1.6">🎉 Hợp đồng hội viên của bạn đã được <strong style="color:#2e7d32">kích hoạt thành công</strong>. Chào mừng bạn đến với gia đình GYM!</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold;width:45%">🃏 Mã thẻ truy cập</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0"><strong style="font-size:18px;color:#1565c0;letter-spacing:2px">{cardCode}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">📦 Gói tập</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">📅 Ngày bắt đầu</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0">{startDate:dd/MM/yyyy}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">⏳ Ngày hết hạn</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0;color:#c62828;font-weight:bold">{endDate:dd/MM/yyyy}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f0f4ff;border:1px solid #d0d8f0;font-weight:bold">💰 Số tiền đã thanh toán</td>
                    <td style="padding:10px 14px;border:1px solid #d0d8f0;color:#2e7d32;font-weight:bold">{amountPaid:N0} VND</td>
                  </tr>
                </table>
                <div style="background:#e8f5e9;border:1px solid #a5d6a7;border-radius:6px;padding:16px;margin-top:16px;text-align:center">
                  <p style="margin:0;color:#1b5e20;font-size:15px">🏋️ Hãy xuất trình mã thẻ <strong style="font-size:18px;letter-spacing:2px">{cardCode}</strong> tại cổng vào khi đến tập!</p>
                </div>
                <p style="color:#999;font-size:13px;margin-top:24px;text-align:center">Cảm ơn bạn đã tin tưởng GYM Management System. Chúc bạn tập luyện hiệu quả! 💪</p>
              </div>
            </div>
            """;
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendVNPayPaymentLinkAsync(
        string toEmail,
        string fullName,
        string invoiceCode,
        decimal amount,
        string paymentUrl,
        DateTime expiredAt)
    {
        var expireVn = expiredAt.AddHours(7);
        var subject = "[GYM] 💳 Link thanh toán VNPay của bạn";
        var body = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px">
              <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px;border-radius:8px 8px 0 0;text-align:center">
                <h1 style="color:#e2b96f;margin:0;font-size:22px">💪 GYM Management System</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
                <h2 style="color:#1a1a2e;margin-top:0">Xin chào {fullName}!</h2>
                <p style="color:#555;line-height:1.6">Bạn có hóa đơn <strong>{invoiceCode}</strong> cần thanh toán <strong style="color:#c62828">{amount:N0} VND</strong>.</p>
                <div style="text-align:center;margin:24px 0">
                  <a href="{paymentUrl}" style="background:linear-gradient(135deg,#e65100,#ff8f00);color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:17px">
                    💳 Thanh toán ngay qua VNPay
                  </a>
                </div>
                <p style="color:#e65100;background:#fff3e0;padding:10px 12px;border-radius:6px;border-left:4px solid #ff9800;font-size:13px">
                  ⚠️ Link chỉ hiệu lực đến <strong>{expireVn:HH:mm dd/MM/yyyy}</strong> (giờ Việt Nam).
                  Sau thời gian này vui lòng liên hệ nhân viên để tạo link mới.
                </p>
                <p style="color:#999;font-size:12px;margin-top:24px;text-align:center">
                  Nếu bạn không yêu cầu thanh toán này, vui lòng liên hệ quản lý.
                </p>
              </div>
            </div>
            """;
        await SendEmailAsync(toEmail, subject, body);
    }

    public async Task SendPaymentFailedAsync(
        string toEmail,
        string fullName,
        string invoiceCode,
        string retryUrl)
    {
        var subject = "[GYM] ❌ Thanh toán VNPay thất bại — Vui lòng thử lại";
        var body = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px">
              <div style="background:linear-gradient(135deg,#b71c1c,#e53935);padding:24px;border-radius:8px 8px 0 0;text-align:center">
                <h1 style="color:#ffffff;margin:0;font-size:22px">❌ Thanh toán thất bại</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
                <h2 style="color:#1a1a2e;margin-top:0">Xin chào {fullName}!</h2>
                <p style="color:#555;line-height:1.6">Giao dịch VNPay cho hóa đơn <strong>{invoiceCode}</strong> <span style="color:#c62828">không thành công</span>.</p>
                <p style="color:#555">Hóa đơn của bạn vẫn còn hiệu lực. Bạn có thể thử lại bất cứ lúc nào.</p>
                <div style="text-align:center;margin:24px 0">
                  <a href="{retryUrl}" style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#e2b96f;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px">
                    🔄 Thử thanh toán lại
                  </a>
                </div>
                <p style="color:#999;font-size:12px;margin-top:16px;text-align:center">Nếu bạn gặp vấn đề, vui lòng liên hệ nhân viên để được hỗ trợ.</p>
              </div>
            </div>
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
