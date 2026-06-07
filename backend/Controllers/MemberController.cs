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
        Description = "Actors: Receptionist only. " +
                      "Tạo hồ sơ hội viên cho khách vãng lai, chọn gói. " +
                      "Kết quả: Trả về InvoiceId và ContractId để gọi API thanh toán. Contract=Pending, Invoice=Pending, Card=Inactive."
    )]
    public async Task<ApiResponse<QuickRegisterResultDto>> QuickRegister([FromBody] QuickRegisterDto dto)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.QuickRegisterAsync(dto, staffId);
        return new ApiResponse<QuickRegisterResultDto>(result, result.Message);
    }
}

[ApiController]
[Route("api/cards")]
[Authorize(Roles = AuthorizationRoles.AdminRoles + "," + AuthorizationRoles.StaffRoles)]
public class AccessCardController : ControllerBase
{
    private readonly IMemberService _service;

    public AccessCardController(IMemberService service)
    {
        _service = service;
    }

    [HttpPatch("{id}/status")]
    [SwaggerOperation(
        Summary = "Cập nhật trạng thái thẻ",
        Description = "Actors: Receptionist, BranchAdmin, SuperAdmin. " +
                      "Cập nhật trạng thái thẻ (Active/Inactive/Lost/Disabled/Expired). " +
                      "Gội cho các trường hợp: báo mất thẻ, khóa/mở khóa thẻ. Ghi AuditLog."
    )]
    public async Task<ApiResponse<bool>> UpdateCardStatus(Guid id, [FromBody] UpdateAccessCardStatusDto dto)
    {
        var staffId = User.GetRequiredUserId();
        var result = await _service.UpdateAccessCardStatusAsync(id, dto, staffId);
        if (!result) return new ApiResponse<bool>("Access card not found");
        return new ApiResponse<bool>(true, "Card status updated successfully");
    }
}
