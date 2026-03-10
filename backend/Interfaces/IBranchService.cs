using backend.DTOs.Branch;

namespace backend.Interfaces;

public interface IBranchService
{
    Task<List<BranchListDto>> GetBranchesAsync(string? search, string? status);

    Task<BranchListDto?> GetBranchAsync(Guid id);

    Task<BranchListDto> CreateBranchAsync(CreateBranchDto dto, Guid userId);

    Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId);

    Task<bool> DeactivateBranchAsync(Guid id, Guid userId);
}