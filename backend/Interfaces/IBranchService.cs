using backend.DTOs.Branch;
using backend.Enums;

namespace backend.Interfaces;

public interface IBranchService
{

    Task<List<BranchListDto>> GetBranchListAsync(string? search, BranchStatus? status);

    Task<BranchDto?> GetBranchAsync(Guid id);

    Task<BranchStatsDto> GetBranchStatsAsync();

    // Admin gửi request update
    Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId);

    // Admin gửi request deactivate
    Task<bool> DeactivateBranchAsync(Guid id, Guid userId);

    Task<bool> ApproveBranchRequestAsync(Guid requestId, Guid approverId);

    Task<bool> RejectBranchRequestAsync(Guid requestId, Guid approverId, string? message);

}