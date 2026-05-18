namespace backend.DTOs.Promotion;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdatePromotionStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(PromotionStatus), ErrorMessage = "Status is invalid")]
    public PromotionStatus Status { get; set; }
}