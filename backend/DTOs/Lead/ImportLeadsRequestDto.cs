using System.ComponentModel.DataAnnotations;
using backend.Enums;
using Microsoft.AspNetCore.Http;

namespace backend.DTOs.Lead;

public class ImportLeadsRequestDto
{
    [Required(ErrorMessage = "CSV file is required")]
    public IFormFile File { get; set; } = null!;

    public LeadImportDuplicateStrategy DuplicateStrategy { get; set; } = LeadImportDuplicateStrategy.Skip;
}
