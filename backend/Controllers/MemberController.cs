using backend.DTOs.Member;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/members")]
[Authorize(Roles = AuthorizationRoles.AdminRoles)]
public class MemberController : ControllerBase
{
    private readonly IMemberService _service;

    public MemberController(IMemberService service)
    {
        _service = service;
    }

    [HttpPost("quick-register")]
    [SwaggerOperation(
        Summary = "Đăng ký hội viên nhanh tại quầy (E2 Walk-in)",
        Description = "Actors: Receptionist, BranchAdmin, SuperAdmin. " +
                      "Tạo hồ sơ hội viên, chọn gói, thu tiền và kích hoạt AccessCard ngay trong 1 thao tác. " +
                      "Kết quả: Contract=Active, Invoice=Paid, Card=Active."
    )]
    public async Task<ApiResponse<QuickRegisterResultDto>> QuickRegister([FromBody] QuickRegisterDto dto)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.QuickRegisterAsync(dto, staffId);
        return new ApiResponse<QuickRegisterResultDto>(result, result.Message);
    }
}
