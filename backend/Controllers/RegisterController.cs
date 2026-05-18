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

    public RegisterController(IRegistrationService registrationService, ApplicationDbContext context)
    {
        _registrationService = registrationService;
        _context = context;
    }

    [HttpGet("packages")]
    [SwaggerOperation(
        Summary = "Danh sách gói tập (công khai)",
        Description = "Trả về các gói tập đang hoạt động cùng bảng giá để khách hàng chọn trước khi đăng ký (UC-1)."
    )]
    public async Task<ApiResponse<object>> GetPublicPackages()
    {
        var packages = await _context.Packages
            .Where(p => p.Status == PackageStatus.Active)
            .Include(p => p.Pricings)
            .Include(p => p.Features)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new
            {
                p.PackageId,
                p.Name,
                p.Description,
                p.ThumbnailUrl,
                p.Tier,
                p.IsPtIncluded,
                p.PrivatePtLimit,
                p.GroupPtLimit,
                p.MaxCheckinsPerWeek,
                p.BadgeLabel,
                Features = p.Features.OrderBy(f => f.DisplayOrder).Select(f => f.Content),
                Pricings = p.Pricings.Select(pr => new
                {
                    pr.PackagePricingId,
                    pr.DurationMonths,
                    pr.Price,
                    pr.OriginalPrice
                })
            })
            .ToListAsync();

        return new ApiResponse<object>(packages!, "Packages retrieved");
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
