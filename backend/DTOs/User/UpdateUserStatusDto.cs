namespace backend.DTOs.User;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdateUserStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(UserStatus), ErrorMessage = "Status is invalid")]
    public UserStatus Status { get; set; }
}