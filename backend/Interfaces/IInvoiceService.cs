using backend.DTOs.Invoice;
using backend.Helpers;

namespace backend.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceDto> IssueInvoiceAsync(IssueInvoiceDto dto, Guid staffId);
    Task<InvoiceDto> GetInvoiceAsync(Guid invoiceId, Guid staffId);
    Task<(PaymentDto Payment, string NewInvoiceStatus)> CollectPaymentAsync(Guid invoiceId, CollectPaymentDto dto, Guid staffId);
    Task<PagedResult<InvoiceListDto>> GetInvoicesAsync(InvoiceQueryDto query, Guid staffId);
    Task<bool> CancelInvoiceAsync(Guid invoiceId, Guid staffId);
}
