using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Contract;

/// <summary>POST /api/contracts/draft — Configure Membership Offer</summary>
public class CreateContractDraftDto
{
    [Required]
    public Guid MemberUserId { get; set; }

    [Required]
    public Guid PackageId { get; set; }

    [Required]
    public Guid PricingId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    /// <summary>Danh sách mã khuyến mãi muốn áp dụng (có thể rỗng)</summary>
    public List<Guid> PromotionIds { get; set; } = [];

    public string? Note { get; set; }
}
