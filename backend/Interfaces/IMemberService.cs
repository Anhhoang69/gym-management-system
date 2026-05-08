using backend.DTOs.Member;

namespace backend.Interfaces;

public interface IMemberService
{
    /// <summary>
    /// E2 Walk-in: Receptionist tạo hồ sơ nhanh + chọn gói + thu tiền ngay.
    /// Kết quả: Contract=Active, Invoice=Paid, Card=Active.
    /// </summary>
    Task<QuickRegisterResultDto> QuickRegisterAsync(QuickRegisterDto dto, Guid staffId);
}
