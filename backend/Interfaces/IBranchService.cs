using backend.DTOs.Branch;

namespace backend.Interfaces;

public interface IBranchService
{
    Task<List<BranchListDto>> GetBranchesAsync(string? search, string? status);

    Task<BranchListDto?> GetBranchAsync(Guid id);

    //Task<BranchListDto> CreateBranchAsync(CreateBranchDto dto, Guid userId);

    // Admin gửi request update
    Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId);

    // Admin gửi request deactivate
    Task<bool> DeactivateBranchAsync(Guid id, Guid userId);

    Task<bool> ApproveBranchRequestAsync(Guid requestId, Guid approverId);

    Task<bool> RejectBranchRequestAsync(Guid requestId, Guid approverId, string? message);

    // Task<bool> CreateBranchAsync(CreateBranchDto dto, Guid userId);

    // Task<bool> ApproveCreateBranchAsync(Guid requestId, Guid approverId);
}