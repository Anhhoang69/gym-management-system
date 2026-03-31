namespace backend.DTOs.Class;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdateClassStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(ClassStatus), ErrorMessage = "Status is invalid")]
    public ClassStatus Status { get; set; }
}