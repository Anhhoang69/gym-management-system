namespace backend.Interfaces;

public interface ICommissionService
{
    Task RecordAsync(Guid contractId, Guid triggerStaffId);
}
