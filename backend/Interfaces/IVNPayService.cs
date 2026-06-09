using backend.DTOs.Payment;
using Microsoft.AspNetCore.Http;

namespace backend.Interfaces;

public interface IVNPayService
{
    /// <summary>
    /// Tạo VNPay payment URL cho một Invoice đang Pending.
    /// Tạo hoặc thay thế Payment(Pending) trong DB.
    /// </summary>
    Task<VNPayCreateResultDto> CreatePaymentUrlAsync(
        Guid invoiceId,
        Guid? requestedByUserId,
        string clientIp);

    /// <summary>
    /// Xử lý IPN callback từ VNPay (server-to-server).
    /// Validate signature → update Payment + Invoice → activate Contract.
    /// </summary>
    Task<VNPayIpnResult> HandleIpnAsync(IQueryCollection query);

    /// <summary>
    /// Validate ReturnUrl params sau khi user được redirect về.
    /// Chỉ validate signature và trả kết quả — không update DB (IPN đã xử lý rồi).
    /// </summary>
    VNPayReturnResult HandleReturn(IQueryCollection query);

    /// <summary>
    /// Lấy trạng thái payment của invoice để frontend poll.
    /// Tự tính Expired nếu ExpiredAt đã qua mà vẫn Pending.
    /// </summary>
    Task<PaymentStatusDto?> GetPaymentStatusAsync(Guid invoiceId);
}
