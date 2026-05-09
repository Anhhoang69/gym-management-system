using backend.DTOs.Invoice;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _service;
    private readonly IVietQrService _vietQrService;

    public InvoiceController(IInvoiceService service, IVietQrService vietQrService)
    {
        _service = service;
        _vietQrService = vietQrService;
    }

    private Guid GetStaffId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Unauthorized");
        return Guid.Parse(claim);
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Phát hành hóa đơn",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. Tạo hóa đơn cho hợp đồng đang chờ thanh toán (UC-27)"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<InvoiceDto>> IssueInvoice([FromBody] IssueInvoiceDto dto)
    {
        var result = await _service.IssueInvoiceAsync(dto, GetStaffId());
        return new ApiResponse<InvoiceDto>(result, "Invoice issued successfully");
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Xem chi tiết hóa đơn"
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<InvoiceDto>> GetInvoice(Guid id)
    {
        var result = await _service.GetInvoiceAsync(id, GetStaffId());
        return new ApiResponse<InvoiceDto>(result, "Invoice retrieved");
    }

    [HttpGet("{id}/qr")]
    [SwaggerOperation(
        Summary = "Tạo mã QR thanh toán",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. " +
                      "Sinh link ảnh QR chuyển khoản VietQR cho hóa đơn Pending. " +
                      "Nội dung chuyển khoản = 'GYM {InvoiceCode}' để staff đối chiếu. " +
                      "Chỉ hóa đơn Pending mới được tạo QR — Paid/Cancelled sẽ trả về lỗi. " +
                      "Sau khi khách scan và chuyển tiền, staff xác nhận tại POST /{id}/payment."
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<InvoiceQrDto>> GetQrCode(Guid id)
    {
        var result = await _vietQrService.GenerateAsync(id, GetStaffId());
        return new ApiResponse<InvoiceQrDto>(result, "QR code generated");
    }

    [HttpPost("{id}/payment")]
    [SwaggerOperation(
        Summary = "Thu tiền (Xác nhận thanh toán)",
        Description = "Actors: Sales, Receptionist, BranchAdmin, SuperAdmin. " +
                      "Thu tiền hóa đơn (hỗ trợ Cash, Card, BankTransfer, EWallet, QRCode...). " +
                      "Staff xác nhận đã nhận tiền thành công (nếu chuyển khoản thì đối chiếu nội dung). " +
                      "Invoice → Paid. Tiếp theo gọi POST /api/contracts/{contractId}/activate để kích hoạt hội viên."
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<PaymentDto>> CollectPayment(Guid id, [FromBody] CollectPaymentDto dto)
    {
        var result = await _service.CollectPaymentAsync(id, dto, GetStaffId());
        return new ApiResponse<PaymentDto>(result.Payment, $"Payment collected. Invoice status is now {result.NewInvoiceStatus}");
    }
}
