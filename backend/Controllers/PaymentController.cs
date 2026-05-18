using backend.DTOs.Payment;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _service;

    public PaymentController(IPaymentService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
    [SwaggerOperation(
        Summary = "Lấy danh sách lịch sử giao dịch",
        Description = "Actors: Receptionist, BranchAdmin, GymOwner, SuperAdmin. " +
                      "Lấy danh sách các giao dịch thanh toán có phân trang. " +
                      "Lọc theo phương thức (Cash/Card/Transfer...), chi nhánh, hóa đơn, nhân viên xử lý, và khoảng thời gian."
    )]
    public async Task<ApiResponse<PagedResult<PaymentListDto>>> GetPayments([FromQuery] PaymentQueryDto query)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.GetPaymentsAsync(query, staffId);
        return new ApiResponse<PagedResult<PaymentListDto>>(result);
    }
}
