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
        var subject = "[EnerGym] Tài khoản của bạn đã được tạo thành công";
        var body = $"""
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:8px">
              <div style="background:#111827;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #eab308">
                <h1 style="color:#ffffff;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:1px"><span style="color:#eab308">Ener</span>Gym</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
                <h2 style="color:#111827;margin-top:0;font-size:20px">Xin chào {fullName}!</h2>
                <p style="color:#4b5563;line-height:1.6">Tài khoản hội viên của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:</p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0">
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;width:40%;color:#374151">
                      <img src="https://img.icons8.com/fluency-system-regular/32/374151/mail.png" width="16" height="16" style="vertical-align:middle;margin-right:6px;" /> Email đăng nhập
                    </td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#111827">{toEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">
                      <img src="https://img.icons8.com/fluency-system-regular/32/374151/key.png" width="16" height="16" style="vertical-align:middle;margin-right:6px;" /> Mật khẩu
                    </td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb"><strong style="font-size:16px;color:#dc2626">{tempPassword}</strong></td>
                  </tr>
                </table>
                <p style="color:#b45309;background:#fef3c7;padding:12px 16px;border-radius:6px;border-left:4px solid #d97706;font-size:13px;line-height:1.5;margin:20px 0">
                  <img src="https://img.icons8.com/fluency-system-regular/32/b45309/warning-shield.png" width="16" height="16" style="vertical-align:middle;margin-right:6px;" /> <strong>Lưu ý bảo mật:</strong> Vui lòng đăng nhập và đổi mật khẩu ngay sau lần đăng nhập đầu tiên để bảo vệ tài khoản.
                </p>
                <div style="text-align:center;margin:28px 0">
                  <a href="{appUrl}" style="display:inline-block;background:linear-gradient(135deg,#111827,#1f2937);color:#eab308;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">🔐 Đăng nhập ngay</a>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center">Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ quản lý.</p>
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
            ? "<span style=\"color:#059669;font-weight:bold\">Miễn phí 🎁</span>"
            : $"<strong style=\"color:#dc2626;font-size:18px\">{totalAmount:N0} VND</strong>";

        string paymentSection = "";
        if (isFree)
        {
            paymentSection = """
                <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;border-radius:6px;margin:20px 0;color:#065f46">
                  🎁 <strong>Gói dùng thử miễn phí!</strong> Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập để trải nghiệm dịch vụ.
                </div>
                """;
        }
        else if (!string.IsNullOrEmpty(paymentUrl))
        {
            var expireVn = paymentExpiredAt.HasValue ? paymentExpiredAt.Value.AddHours(7) : DateTime.UtcNow.AddHours(7).AddMinutes(15);
            paymentSection = $"""
                <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:6px;margin:20px 0;color:#92400e;font-size:14px;line-height:1.6">
                  <img src="https://img.icons8.com/fluency-system-regular/32/92400e/warning-shield.png" width="16" height="16" style="vertical-align:middle;margin-right:6px;" /> <strong>Yêu cầu thanh toán:</strong> Bạn cần hoàn tất thanh toán để kích hoạt thẻ tập của mình. Link thanh toán có hiệu lực đến <strong>{expireVn:HH:mm dd/MM/yyyy}</strong>.
                </div>
                <div style="text-align:center;margin:24px 0">
                  <a href="{paymentUrl}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#000000;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(217,119,6,0.2)">
                    💳 Thanh toán ngay qua VNPay
                  </a>
                </div>
                """;
        }
        else
        {
            paymentSection = $"""
                <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:6px;margin:20px 0;color:#e65100">
                  💳 <strong>Lưu ý:</strong> Vui lòng thanh toán <strong>{totalAmount:N0} VND</strong> (Mã HĐ: <code>{invoiceCode}</code>) để kích hoạt thẻ tập.
                </div>
                """;
        }

        var subject = "[EnerGym] Đăng ký thành công – Thông tin tài khoản & Hóa đơn";
        var body = $"""
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:8px">
              <div style="background:#111827;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #eab308">
                <h1 style="color:#ffffff;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:1px"><span style="color:#eab308">Ener</span>Gym</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
                <h2 style="color:#111827;margin-top:0;font-size:20px">Xin chào {fullName}!</h2>
                <p style="color:#4b5563;line-height:1.6">Chào mừng bạn đến với <strong>EnerGym</strong>. Bạn đã đăng ký thành công. Dưới đây là thông tin đăng nhập và chi tiết đăng ký:</p>
                
                <h3 style="color:#111827;border-bottom:2px solid #eab308;padding-bottom:6px;margin-top:24px;font-size:16px;display:flex;align-items:center;">
                  <img src="https://img.icons8.com/fluency-system-regular/32/111827/lock.png" width="18" height="18" style="vertical-align:middle;margin-right:8px;" /> Thông tin tài khoản
                </h3>
                <table style="width:100%;border-collapse:collapse;margin:12px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;width:40%;color:#374151">📧 Email</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#111827">{toEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">🔑 Mật khẩu tạm</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb"><strong style="font-size:16px;color:#dc2626">{tempPassword}</strong></td>
                  </tr>
                </table>
                <p style="color:#b45309;background:#fef3c7;padding:8px 12px;border-radius:6px;border-left:4px solid #d97706;font-size:12px;line-height:1.5">
                  <img src="https://img.icons8.com/fluency-system-regular/32/b45309/warning-shield.png" width="14" height="14" style="vertical-align:middle;margin-right:6px;" /> <strong>Bảo mật:</strong> Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên!
                </p>

                <h3 style="color:#111827;border-bottom:2px solid #eab308;padding-bottom:6px;margin-top:28px;font-size:16px;display:flex;align-items:center;">
                  <img src="https://img.icons8.com/fluency-system-regular/32/111827/file-invoice.png" width="18" height="18" style="vertical-align:middle;margin-right:8px;" /> Thông tin đăng ký
                </h3>
                <table style="width:100%;border-collapse:collapse;margin:12px 0">
                  <tr>
                    <td style="padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;width:40%;color:#374151">📦 Gói tập</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#111827">{packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">🧾 Mã hóa đơn</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb"><code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;color:#111827">{invoiceCode}</code></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">💰 Số tiền</td>
                    <td style="padding:10px 14px;border:1px solid #e5e7eb">{amountText}</td>
                  </tr>
                </table>

                {paymentSection}

                <div style="text-align:center;margin:28px 0;border-top:1px solid #f3f4f6;padding-top:20px">
                  <a href="{appUrl}" style="display:inline-block;background:linear-gradient(135deg,#111827,#1f2937);color:#eab308;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">🔐 Đăng nhập ngay</a>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center">Nếu bạn không thực hiện đăng ký này, vui lòng liên hệ quản lý.</p>
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
        var subject = "[EnerGym] 🎉 Hợp đồng hội viên đã được kích hoạt!";
        var body = $"""
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:8px">
              <div style="background:#111827;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #eab308">
                <h1 style="color:#ffffff;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:1px"><span style="color:#eab308">Ener</span>Gym</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
                <h2 style="color:#111827;margin-top:0;font-size:20px">Xin chào {fullName}!</h2>
                <p style="color:#4b5563;line-height:1.6">🎉 Hợp đồng hội viên của bạn đã được <strong style="color:#059669">kích hoạt thành công</strong>. Chào mừng bạn đến với đại gia đình EnerGym!</p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0">
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;width:45%;color:#374151">🃏 Mã thẻ truy cập</td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb"><strong style="font-size:18px;color:#2563eb;letter-spacing:2px">{cardCode}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">📦 Gói tập</td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#111827">{packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">📅 Ngày bắt đầu</td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#111827">{startDate:dd/MM/yyyy}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">⏳ Ngày hết hạn</td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#dc2626;font-weight:bold">{endDate:dd/MM/yyyy}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;color:#374151">💰 Số tiền đã thanh toán</td>
                    <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#059669;font-weight:bold">{amountPaid:N0} VND</td>
                  </tr>
                </table>
                <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;padding:16px;margin:20px 0;text-align:center">
                  <p style="margin:0;color:#065f46;font-size:15px;line-height:1.5">🏋️ Hãy xuất trình mã thẻ <strong style="font-size:18px;letter-spacing:2px;color:#047857">{cardCode}</strong> tại cổng vào khi đến tập!</p>
                </div>
                <p style="color:#9ca3af;font-size:13px;margin-top:24px;text-align:center">Cảm ơn bạn đã tin tưởng EnerGym. Chúc bạn tập luyện hiệu quả! 💪</p>
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
        var subject = "[EnerGym] 💳 Liên kết thanh toán VNPay của bạn";
        var body = $"""
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:8px">
              <div style="background:#111827;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #eab308">
                <h1 style="color:#ffffff;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:1px"><span style="color:#eab308">Ener</span>Gym</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
                <h2 style="color:#111827;margin-top:0;font-size:20px">Xin chào {fullName}!</h2>
                <p style="color:#4b5563;line-height:1.6">Bạn có hóa đơn <strong>{invoiceCode}</strong> cần thanh toán số tiền <strong style="color:#dc2626">{amount:N0} VND</strong>.</p>
                <div style="text-align:center;margin:28px 0">
                  <a href="{paymentUrl}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#000000;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(217,119,6,0.2)">
                    💳 Thanh toán ngay qua VNPay
                  </a>
                </div>
                <p style="color:#b45309;background:#fef3c7;padding:12px 16px;border-radius:6px;border-left:4px solid #d97706;font-size:13px;line-height:1.5;margin:20px 0">
                  <img src="https://img.icons8.com/fluency-system-regular/32/b45309/warning-shield.png" width="16" height="16" style="vertical-align:middle;margin-right:6px;" /> <strong>Thời hạn liên kết:</strong> Link thanh toán chỉ hiệu lực đến <strong>{expireVn:HH:mm dd/MM/yyyy}</strong> (giờ Việt Nam).
                </p>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center">Nếu bạn không yêu cầu thanh toán này, vui lòng liên hệ quản lý.</p>
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
        var subject = "[EnerGym] ❌ Thanh toán VNPay thất bại — Vui lòng thử lại";
        var body = $"""
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:8px">
              <div style="background:#dc2626;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #b91c1c">
                <h1 style="color:#ffffff;margin:0;font-size:26px;font-style:italic;font-weight:bold;letter-spacing:1px">❌ Giao dịch thất bại</h1>
              </div>
              <div style="background:#ffffff;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
                <h2 style="color:#111827;margin-top:0;font-size:20px">Xin chào {fullName}!</h2>
                <p style="color:#4b5563;line-height:1.6">Giao dịch VNPay cho hóa đơn <strong>{invoiceCode}</strong> <span style="color:#dc2626;font-weight:bold">không thành công</span>.</p>
                <p style="color:#4b5563;line-height:1.6">Hóa đơn của bạn vẫn còn hiệu lực trong hệ thống. Bạn có thể thực hiện lại giao dịch bằng cách nhấp vào liên kết phía dưới.</p>
                <div style="text-align:center;margin:28px 0">
                  <a href="{retryUrl}" style="display:inline-block;background:linear-gradient(135deg,#111827,#1f2937);color:#eab308;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                    🔄 Thử thanh toán lại
                  </a>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center">Nếu bạn cần hỗ trợ, vui lòng liên hệ quầy lễ tân hoặc hotline.</p>
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
        var senderName = "EnerGym System";

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
