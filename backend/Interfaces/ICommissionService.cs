using backend.DTOs.Commission;
using backend.Helpers;

namespace backend.Interfaces;

public interface ICommissionService
{
    Task RecordAsync(Guid contractId, Guid triggerStaffId);
    Task<PagedResult<CommissionListDto>> GetMyCommissionsAsync(Guid staffId, int? month, int? year, int page, int pageSize);
}
