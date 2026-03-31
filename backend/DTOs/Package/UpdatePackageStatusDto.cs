namespace backend.DTOs.Package;

using System.ComponentModel.DataAnnotations;
using backend.Enums;

public class UpdatePackageStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [EnumDataType(typeof(PackageStatus), ErrorMessage = "Status is invalid")]
    public PackageStatus Status { get; set; }
}