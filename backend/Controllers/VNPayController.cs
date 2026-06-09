using backend.DTOs.Payment;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/payments/vnpay")]
public class VNPayController : ControllerBase
{
    private readonly IVNPayService _vnpay;
    private readonly ILogger<VNPayController> _logger;

    public VNPayController(IVNPayService vnpay, ILogger<VNPayController> logger)
    {
        _vnpay = vnpay;
        _logger = logger;
    }

    /// <summary>
    /// Tạo payment URL cho một Invoice đang Pending.
    /// Actor: Staff hoặc Member đã đăng nhập.
    /// </summary>
    [HttpPost("create")]
    [Authorize]
    [SwaggerOperation(
        Summary = "Tạo VNPay payment URL",
        Description = "Actors: Staff hoặc Member. Tạo redirect URL sang VNPay cho Invoice đang Pending. " +
                      "Nếu đã có Payment(Pending/Failed) cũ → tự động thay thế (Replace pattern). " +
                      "Trả về paymentUrl, txnRef, expiredAt."
    )]
    public async Task<ApiResponse<VNPayCreateResultDto>> CreatePaymentUrl([FromBody] VNPayCreateRequestDto dto)
    {
        var userId = User.GetRequiredUserId();
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var result = await _vnpay.CreatePaymentUrlAsync(dto.InvoiceId, userId, clientIp);
        return new ApiResponse<VNPayCreateResultDto>(result, "Payment URL created");
    }

    /// <summary>
    /// IPN Callback từ VNPay server-to-server. KHÔNG yêu cầu JWT.
    /// Security: HMAC-SHA512 signature validation.
    /// </summary>
    [HttpPost("ipn")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "VNPay IPN Callback",
        Description = "Endpoint nhận server-to-server callback từ VNPay. " +
                      "Validate signature → update Payment/Invoice → activate Contract → gửi email/notification. " +
                      "Luôn reply HTTP 200 với RspCode JSON cho VNPay."
    )]
    public async Task<IActionResult> HandleIpn()
    {
        _logger.LogInformation("VNPay IPN received: TxnRef={TxnRef}", Request.Query["vnp_TxnRef"].ToString());
        var result = await _vnpay.HandleIpnAsync(Request.Query);
        return Ok(result);
    }

    /// <summary>
    /// ReturnUrl — VNPay redirect user về đây sau khi thanh toán.
    /// KHÔNG yêu cầu JWT (VNPay redirect browser, không có token).
    /// Chỉ validate signature và trả kết quả để frontend hiển thị.
    /// </summary>
    [HttpGet("return")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "VNPay ReturnUrl handler",
        Description = "Endpoint nhận browser redirect từ VNPay sau khi user thanh toán. " +
                      "Validate signature và trả kết quả về cho frontend (VNPayReturnPage)."
    )]
    public async Task<IActionResult> HandleReturn()
    {
        _logger.LogInformation("VNPay Return: ResponseCode={Code}, TxnRef={TxnRef}",
            Request.Query["vnp_ResponseCode"].ToString(),
            Request.Query["vnp_TxnRef"].ToString());

        var result = await _vnpay.HandleReturnAsync(Request.Query);
        return Ok(new ApiResponse<VNPayReturnResult>(result));
    }

    /// <summary>
    /// Poll trạng thái payment của invoice. Dùng cho frontend polling sau redirect VNPay.
    /// Public endpoint — VNPayConfirmPage không có JWT (user chưa đăng nhập).
    /// </summary>
    [HttpGet("status/{invoiceId:guid}")]
    [AllowAnonymous]
    [SwaggerOperation(
        Summary = "Lấy trạng thái payment VNPay",
        Description = "Frontend gọi mỗi 3 giây để kiểm tra kết quả sau khi user thanh toán VNPay. " +
                      "Public endpoint — không cần JWT. " +
                      "Trả Expired nếu link đã hết hạn mà chưa thanh toán."
    )]
    public async Task<ApiResponse<PaymentStatusDto?>> GetStatus(Guid invoiceId)
    {
        var result = await _vnpay.GetPaymentStatusAsync(invoiceId);
        if (result == null) return new ApiResponse<PaymentStatusDto?>("Payment not found for this invoice");
        return new ApiResponse<PaymentStatusDto?>(result);
    }
}
