using backend.DTOs.Commission;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/commissions")]
[Authorize]
public class CommissionController : ControllerBase
{
    private readonly ICommissionService _service;

    public CommissionController(ICommissionService service)
    {
        _service = service;
    }

    [HttpGet("my")]
    [Authorize(Roles = AuthorizationRoles.StaffRoles + "," + AuthorizationRoles.AdminRoles)]
    [SwaggerOperation(
        Summary = "Xem hoa hồng cá nhân",
        Description = "Actors: Sales, PT, Staff. Lấy danh sách hoa hồng của nhân viên đang đăng nhập. " +
                      "Lọc theo tháng/năm, có phân trang."
    )]
    public async Task<ApiResponse<PagedResult<CommissionListDto>>> GetMyCommissions(
        [FromQuery] int? month,
        [FromQuery] int? year,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.GetMyCommissionsAsync(staffId, month, year, page, pageSize);
        return new ApiResponse<PagedResult<CommissionListDto>>(result);
    }
}
