using backend.DTOs.Branch;
using backend.Enums;

namespace backend.Interfaces;

public interface IBranchService
{
    // ===== READ =====
    Task<List<BranchListDto>> GetBranchListAsync(string? search, BranchStatus? status);
    Task<BranchDto?> GetBranchAsync(Guid id);
    Task<BranchStatsDto> GetBranchStatsAsync();

    // ===== CREATE =====
    /// <summary>SuperAdmin tạo branch mới → Status=Pending → gửi approve request đến GymOwner</summary>
    Task<CreateBranchResultDto> CreateBranchAsync(CreateBranchDto dto, Guid userId);

    // ===== UPDATE / DEACTIVATE (gửi request → GymOwner approve) =====
    Task<bool> UpdateBranchAsync(Guid id, UpdateBranchDto dto, Guid userId);
    Task<bool> DeactivateBranchAsync(Guid id, Guid userId);

    // ===== STAFF ASSIGNMENT =====
    Task<AssignStaffResultDto> AssignStaffAsync(Guid branchId, AssignStaffDto dto, Guid adminId);
    Task<bool> RemoveStaffFromBranchAsync(Guid branchId, Guid userId, Guid adminId);
}