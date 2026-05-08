using backend.DTOs.Invoice;

namespace backend.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceDto> IssueInvoiceAsync(IssueInvoiceDto dto, Guid staffId);
    Task<InvoiceDto> GetInvoiceAsync(Guid invoiceId, Guid staffId);
    Task<(PaymentDto Payment, string NewInvoiceStatus)> CollectPaymentAsync(Guid invoiceId, CollectPaymentDto dto, Guid staffId);
}
