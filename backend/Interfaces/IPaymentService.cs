using backend.DTOs.Payment;
using backend.Helpers;

namespace backend.Interfaces;

public interface IPaymentService
{
    Task<PagedResult<PaymentListDto>> GetPaymentsAsync(PaymentQueryDto query, Guid staffId);
}
