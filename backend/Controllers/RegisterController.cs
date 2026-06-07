using backend.Data;
using backend.DTOs.Register;
using backend.Enums;
using backend.Helpers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[ApiController]
[Route("api/register")]
[AllowAnonymous]
public class RegisterController : ControllerBase
{
    private readonly IRegistrationService _registrationService;
    private readonly ApplicationDbContext _context;
    private readonly IBranchService _branchService;
    private readonly IPackageService _packageService;

    public RegisterController(
        IRegistrationService registrationService, 
        ApplicationDbContext context,
        IBranchService branchService,
        IPackageService packageService)
    {
        _registrationService = registrationService;
        _context = context;
        _branchService = branchService;
        _packageService = packageService;
    }

    [HttpGet("packages")]
    [SwaggerOperation(
        Summary = "Danh sách gói tập (công khai)",
        Description = "Trả về các gói tập đang hoạt động cùng bảng giá để khách hàng chọn trước khi đăng ký (UC-1)."
    )]
    public async Task<ApiResponse<object>> GetPublicPackages()
    {
        var packages = await _packageService.GetPublicPackagesAsync();
        return new ApiResponse<object>(packages, "Packages retrieved");
    }

    [HttpGet("branches")]
    [SwaggerOperation(
        Summary = "Danh sách chi nhánh (công khai)",
        Description = "Trả về các chi nhánh đang hoạt động để khách hàng chọn khi đăng ký tài khoản (UC-1)."
    )]
    public async Task<ApiResponse<object>> GetPublicBranches()
    {
        var branches = await _branchService.GetPublicBranchListAsync();
        return new ApiResponse<object>(branches, "Branches retrieved");
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Đăng ký tài khoản hội viên",
        Description = "Khách hàng chọn gói, điền thông tin cá nhân và phương thức thanh toán. Hệ thống tạo tài khoản, hợp đồng, hóa đơn và gửi mật khẩu tạm qua email/SMS (UC-1)."
    )]
    public async Task<ActionResult<ApiResponse<RegisterResultDto>>> Register([FromBody] RegisterMemberDto dto)
    {
        var result = await _registrationService.RegisterMemberAsync(dto);
        return StatusCode(201, new ApiResponse<RegisterResultDto>(result, result.Message));
    }
}
