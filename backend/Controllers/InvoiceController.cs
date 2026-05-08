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

    public InvoiceController(IInvoiceService service)
    {
        _service = service;
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
        Description = "Tạo hóa đơn cho hợp đồng đang chờ thanh toán (UC-27)"
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

    [HttpPost("{id}/payment")]
    [SwaggerOperation(
        Summary = "Thu tiền",
        Description = "Ghi nhận thanh toán cho hóa đơn (UC-28). Hỗ trợ thanh toán toàn bộ."
    )]
    [Authorize(Roles = AuthorizationRoles.AdminRoles)]
    public async Task<ApiResponse<PaymentDto>> CollectPayment(Guid id, [FromBody] CollectPaymentDto dto)
    {
        var result = await _service.CollectPaymentAsync(id, dto, GetStaffId());
        return new ApiResponse<PaymentDto>(result.Payment, $"Payment collected. Invoice status is now {result.NewInvoiceStatus}");
    }
}
