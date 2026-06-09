using System.Text.Json;
using backend.Data;
using backend.DTOs.Payment;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class VNPayService : IVNPayService
{
    private readonly ApplicationDbContext _context;
    private readonly VNPayOptions _opts;
    private readonly IEmailService _emailService;
    private readonly INotificationService _notificationService;
    private readonly ILogger<VNPayService> _logger;

    public VNPayService(
        ApplicationDbContext context,
        IOptions<VNPayOptions> opts,
        IEmailService emailService,
        INotificationService notificationService,
        ILogger<VNPayService> logger)
    {
        _context = context;
        _opts = opts.Value;
        _emailService = emailService;
        _notificationService = notificationService;
        _logger = logger;
    }

    // ── Create Payment URL ────────────────────────────────────────────────────

    public async Task<VNPayCreateResultDto> CreatePaymentUrlAsync(
        Guid invoiceId,
        Guid? requestedByUserId,
        string clientIp)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Payment)
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
            ?? throw new Exception("Invoice not found");

        if (invoice.Status == InvoiceStatus.Paid)
            throw new Exception("Invoice đã được thanh toán rồi");

        if (invoice.Status == InvoiceStatus.Cancelled)
            throw new Exception("Invoice đã bị hủy");

        // Replace Payment cũ (Pending/Failed/Cancelled/Expired) — giữ nguyên schema 1-1
        if (invoice.Payment != null)
        {
            if (invoice.Payment.Status == PaymentStatus.Completed)
                throw new Exception("Invoice đã được thanh toán rồi");

            _context.Payments.Remove(invoice.Payment);
            await _context.SaveChangesAsync(); // flush delete trước
        }

        var txnRef = Guid.NewGuid().ToString("N")[..20]; // max 20 chars per VNPay spec
        var expiredAt = DateTime.UtcNow.AddMinutes(_opts.TimeoutMinutes);
        var orderInfo = $"Thanh toan hoa don {invoice.InvoiceCode}";

        var paymentUrl = VNPayHelper.BuildPaymentUrl(
            invoiceId, txnRef, orderInfo, invoice.TotalAmount, clientIp, _opts);

        var payment = new Payment
        {
            PaymentId = Guid.NewGuid(),
            InvoiceId = invoice.InvoiceId,
            Method = PaymentMethod.VNPay,
            Amount = invoice.TotalAmount,
            Status = PaymentStatus.Pending,
            ProcessedBy = requestedByUserId ?? Guid.Empty,
            ProcessedByStaffId = requestedByUserId,
            GatewayTxnRef = txnRef,
            ExpiredAt = expiredAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return new VNPayCreateResultDto
        {
            PaymentUrl = paymentUrl,
            TxnRef = txnRef,
            ExpiredAt = expiredAt,
            Amount = invoice.TotalAmount,
            InvoiceCode = invoice.InvoiceCode
        };
    }

    // ── Handle IPN (server-to-server) ─────────────────────────────────────────

    public async Task<VNPayIpnResult> HandleIpnAsync(IQueryCollection query)
    {
        // 1. Validate signature
        if (!VNPayHelper.ValidateSignature(query, _opts.HashSecret))
        {
            _logger.LogWarning("VNPay IPN: Invalid signature. TxnRef={TxnRef}", query["vnp_TxnRef"].ToString());
            await WriteAuditLogAsync("VNPay_IPN_InvalidSignature",
                $"TxnRef={query["vnp_TxnRef"]} | SecureHash={query["vnp_SecureHash"]}");
            return new VNPayIpnResult { RspCode = "97", Message = "Invalid signature" };
        }

        var txnRef = query["vnp_TxnRef"].ToString();
        var responseCode = query["vnp_ResponseCode"].ToString();
        var transactionNo = query["vnp_TransactionNo"].ToString();
        var bankCode = query["vnp_BankCode"].ToString();
        var rawParams = VNPayHelper.GetAllParams(query);
        var rawData = JsonSerializer.Serialize(rawParams);

        // 2. Load Payment bằng TxnRef
        var payment = await _context.Payments
            .Include(p => p.Invoice)
            .FirstOrDefaultAsync(p => p.GatewayTxnRef == txnRef);

        if (payment == null)
        {
            _logger.LogWarning("VNPay IPN: Payment not found for TxnRef={TxnRef}", txnRef);
            return new VNPayIpnResult { RspCode = "01", Message = "Order not found" };
        }

        // 3. Idempotent check
        if (payment.Status == PaymentStatus.Completed)
        {
            _logger.LogInformation("VNPay IPN: Duplicate callback for TxnRef={TxnRef} — already completed", txnRef);
            return new VNPayIpnResult { RspCode = "00", Message = "Confirm Success" };
        }

        // 4. Validate amount (VNPay gửi * 100)
        if (long.TryParse(query["vnp_Amount"].ToString(), out var vnpAmount))
        {
            var expectedAmount = (long)(payment.Invoice.TotalAmount * 100);
            if (vnpAmount != expectedAmount)
            {
                _logger.LogWarning("VNPay IPN: Amount mismatch. Expected={Expected}, Got={Got}", expectedAmount, vnpAmount);
                payment.Status = PaymentStatus.Failed;
                payment.GatewayResponseCode = responseCode;
                payment.GatewayRawData = rawData;
                payment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return new VNPayIpnResult { RspCode = "04", Message = "Invalid amount" };
            }
        }

        // 5. Parse PayDate
        DateTime? payDate = null;
        if (DateTime.TryParseExact(query["vnp_PayDate"].ToString(), "yyyyMMddHHmmss",
            null, System.Globalization.DateTimeStyles.None, out var pd))
        {
            payDate = DateTime.SpecifyKind(pd, DateTimeKind.Unspecified)
                              .ToUniversalTime();
        }

        // 6. BEGIN TRANSACTION
        using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            payment.GatewayResponseCode = responseCode;
            payment.GatewayTransactionNo = transactionNo;
            payment.GatewayBankCode = bankCode;
            payment.GatewayPayDate = payDate;
            payment.GatewayRawData = rawData;
            payment.UpdatedAt = DateTime.UtcNow;

            if (responseCode == "00")
            {
                // SUCCESS
                payment.Status = PaymentStatus.Completed;
                payment.Invoice.Status = InvoiceStatus.Paid;
                payment.Invoice.UpdatedAt = DateTime.UtcNow;

                // Activate membership
                var cardCode = await ActivateMembershipInternalAsync(payment.Invoice.ContractId);

                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                // Fire-and-forget: email + notification
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var contract = await _context.Contracts
                            .Include(c => c.Package)
                            .Include(c => c.Member).ThenInclude(m => m.User)
                            .FirstOrDefaultAsync(c => c.ContractId == payment.Invoice.ContractId);

                        if (contract?.Member?.User?.Email != null)
                        {
                            await _emailService.SendMembershipActivatedAsync(
                                contract.Member.User.Email,
                                contract.Member.User.FullName ?? "Member",
                                cardCode,
                                contract.Package.Name,
                                contract.StartDate,
                                contract.EndDate,
                                payment.Amount);
                        }

                        if (contract?.MemberUserId != null)
                        {
                            await _notificationService.SendAsync(
                                title: "💳 Thanh toán thành công!",
                                message: $"Hợp đồng và thẻ tập của bạn đã được kích hoạt. Mã thẻ: {cardCode}",
                                recipientIds: new List<Guid> { contract.MemberUserId },
                                type: Enums.NotificationType.Payment);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "VNPay IPN: post-processing error for TxnRef={TxnRef}", txnRef);
                    }
                });
            }
            else
            {
                // FAILED / CANCELLED
                payment.Status = responseCode == "24" ? PaymentStatus.Cancelled : PaymentStatus.Failed;
                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                // Fire-and-forget: notify member
                if (payment.Invoice.MemberId != default)
                {
                    var memberId = payment.Invoice.MemberId;
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            await _notificationService.SendAsync(
                                title: "❌ Thanh toán VNPay thất bại",
                                message: "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ nhân viên.",
                                recipientIds: new List<Guid> { memberId },
                                type: Enums.NotificationType.Info);

                        }
                        catch { }
                    });
                }
            }

            _logger.LogInformation("VNPay IPN: TxnRef={TxnRef} ResponseCode={Code} Status={Status}",
                txnRef, responseCode, payment.Status);

            return new VNPayIpnResult { RspCode = "00", Message = "Confirm Success" };
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            _logger.LogError(ex, "VNPay IPN: DB error for TxnRef={TxnRef}", txnRef);
            return new VNPayIpnResult { RspCode = "99", Message = "Unknown error" };
        }
    }

    // ── Handle Return URL ─────────────────────────────────────────────────────

    public VNPayReturnResult HandleReturn(IQueryCollection query)
    {
        var responseCode = query["vnp_ResponseCode"].ToString();
        var txnRef = query["vnp_TxnRef"].ToString();

        if (!VNPayHelper.ValidateSignature(query, _opts.HashSecret))
        {
            return new VNPayReturnResult
            {
                Success = false,
                ResponseCode = "97",
                Message = "Chữ ký không hợp lệ. Vui lòng liên hệ hỗ trợ."
            };
        }

        var success = responseCode == "00";
        var message = responseCode switch
        {
            "00" => "Thanh toán thành công!",
            "24" => "Bạn đã hủy giao dịch. Hóa đơn vẫn còn hiệu lực.",
            "07" => "Giao dịch bị nghi ngờ gian lận.",
            "09" => "Thẻ/Tài khoản chưa đăng ký Internet Banking.",
            "10" => "Xác thực thẻ/tài khoản sai quá 3 lần.",
            "11" => "Phiên thanh toán hết hạn.",
            "12" => "Thẻ/Tài khoản bị khóa.",
            "13" => "OTP nhập sai.",
            "51" => "Tài khoản không đủ số dư.",
            "65" => "Vượt hạn mức giao dịch trong ngày.",
            "75" => "Ngân hàng đang bảo trì.",
            "79" => "Nhập sai mật khẩu thanh toán quá số lần quy định.",
            _ => $"Thanh toán thất bại (mã lỗi: {responseCode})."
        };

        decimal? amount = null;
        if (long.TryParse(query["vnp_Amount"].ToString(), out var amt))
            amount = amt / 100m;

        return new VNPayReturnResult
        {
            Success = success,
            ResponseCode = responseCode,
            Message = message,
            Amount = amount,
            BankCode = query["vnp_BankCode"].ToString(),
            TransactionNo = query["vnp_TransactionNo"].ToString()
        };
    }

    // ── Get Payment Status ────────────────────────────────────────────────────

    public async Task<PaymentStatusDto?> GetPaymentStatusAsync(Guid invoiceId)
    {
        var payment = await _context.Payments
            .Include(p => p.Invoice)
            .FirstOrDefaultAsync(p => p.InvoiceId == invoiceId);

        if (payment == null) return null;

        // Tính Expired nếu URL đã hết hạn mà vẫn Pending
        var effectiveStatus = payment.Status;
        if (effectiveStatus == PaymentStatus.Pending
            && payment.ExpiredAt.HasValue
            && payment.ExpiredAt.Value < DateTime.UtcNow)
        {
            effectiveStatus = PaymentStatus.Expired;
        }

        return new PaymentStatusDto
        {
            PaymentId = payment.PaymentId,
            Status = effectiveStatus.ToString(),
            InvoiceStatus = payment.Invoice.Status.ToString(),
            GatewayResponseCode = payment.GatewayResponseCode,
            PaidAt = payment.GatewayPayDate,
            ExpiredAt = payment.ExpiredAt,
            Amount = payment.Amount
        };
    }

    // ── Internal Activate (no permission check — called from IPN) ─────────────

    /// <summary>
    /// Kích hoạt hợp đồng từ IPN — không check permission vì là system call.
    /// Reuse logic từ ContractService.ActivateMembershipAsync nhưng bỏ EnsurePermission.
    /// Trả về CardCode.
    /// </summary>
    public async Task<string> ActivateMembershipInternalAsync(Guid contractId)
    {
        var contract = await _context.Contracts
            .Include(c => c.Invoice)
            .Include(c => c.Member).ThenInclude(m => m.AccessCard)
            .FirstOrDefaultAsync(c => c.ContractId == contractId)
            ?? throw new Exception($"Contract {contractId} not found for activation");

        if (contract.Status == ContractStatus.Active)
        {
            // Already activated — idempotent
            return contract.Member?.AccessCard?.CardCode ?? "";
        }

        if (contract.Status != ContractStatus.Pending)
            throw new Exception($"Contract is {contract.Status}, cannot activate");

        contract.Status = ContractStatus.Active;
        contract.UpdatedAt = DateTime.UtcNow;

        var card = contract.Member?.AccessCard;
        string code;

        if (card == null)
        {
            code = RegistrationService.GenerateCardCode(contract.MemberUserId);
            card = new AccessCard
            {
                AccessCardId = Guid.NewGuid(),
                MemberUserId = contract.MemberUserId,
                CardCode = code,
                Status = AccessCardStatus.Active,
                IssueDate = DateTime.UtcNow,
                ExpireDate = contract.EndDate
            };
            _context.AccessCards.Add(card);
        }
        else
        {
            code = card.CardCode;
            card.Status = AccessCardStatus.Active;
            card.ExpireDate = contract.EndDate;
            if (card.IssueDate == default)
                card.IssueDate = DateTime.UtcNow;
        }

        // SaveChanges will be called by the caller within transaction
        return code;
    }

    // ── Audit helper ──────────────────────────────────────────────────────────

    private async Task WriteAuditLogAsync(string action, string detail)
    {
        try
        {
            _context.AuditLogs.Add(new AuditLog
            {
                AuditLogId = Guid.NewGuid(),
                UserId = Guid.Empty,
                Action = action,
                EntityType = "Payment",
                EntityId = Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                NewValue = detail
            });
            await _context.SaveChangesAsync();
        }
        catch { }
    }
}
