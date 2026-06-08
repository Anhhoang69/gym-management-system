import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem,
  CButton,
  CBadge
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getInvoices } from "../../services/invoiceService"
import moment from "moment"
import { Banknote, ReceiptText } from "lucide-react"
import Pagination from "../../../../shared/components/Pagination"

function InvoicesTable({ onPayClick, fixedBranchId = "" }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchInvoices()
  }, [page, fixedBranchId])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await getInvoices({ page, pageSize: 10, branchId: fixedBranchId })
      setInvoices(data.items || data || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch invoices", error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Pending': return <CBadge color="warning" shape="rounded-pill">Chưa thanh toán</CBadge>
      case 'Paid': return <CBadge color="success" shape="rounded-pill">Đã thanh toán</CBadge>
      case 'Overdue': return <CBadge color="danger" shape="rounded-pill">Quá hạn</CBadge>
      case 'Cancelled': return <CBadge color="secondary" shape="rounded-pill">Đã hủy</CBadge>
      default: return <CBadge color="secondary" shape="rounded-pill">{status || 'N/A'}</CBadge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  return (
    <CCard className="border-0 shadow-sm">
      <CCardBody>
        {loading ? (
          <div className="text-center py-5">Đang tải...</div>
        ) : (
          <>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Mã Hóa Đơn</th>
                    <th>Nội dung</th>
                    <th>Ngày tạo</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((item, idx) => (
                    <tr key={item.invoiceId || item.id || idx}>
                      <td className="text-muted small fw-semibold">
                        {(item.invoiceCode || item.invoiceId || item.id || '').substring(0, 8).toUpperCase()}
                      </td>
                      <td>
                        <div className="fw-semibold text-gray-800">{item.description || item.note || `Thanh toán hợp đồng hội viên`}</div>
                        {item.memberName && <div className="small text-muted">{item.memberName}</div>}
                      </td>
                      <td>
                        <div className="small">
                          {moment(item.createdAt || item.issueDate).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </td>
                      <td className="fw-bold text-indigo-600">
                        {formatCurrency(item.amount || item.totalAmount || item.total)}
                      </td>
                      <td>{getPaymentBadge(item.status || item.paymentStatus)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton color="info" variant="ghost" size="sm">
                            Xem
                          </CButton>

                          {/* Collect Payment */}
                          {(item.status === 'Pending' || item.paymentStatus === 'Pending') && (
                            <CButton
                              color="primary"
                              size="sm"
                              className="d-flex align-items-center gap-1 text-white shadow-sm"
                              onClick={() => {
                                if (onPayClick) {
                                  onPayClick({
                                    invoiceId: item.invoiceId || item.id,
                                    contractId: item.contractId, // Might be null
                                    totalAmountDue: item.amount || item.totalAmount || item.total,
                                    invoiceCode: (item.invoiceCode || item.invoiceId || item.id).substring(0, 8).toUpperCase()
                                  })
                                }
                              }}
                            >
                              <Banknote size={14} />
                              Thu Tiền
                            </CButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Chưa có hóa đơn nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-end mt-3">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default InvoicesTable
