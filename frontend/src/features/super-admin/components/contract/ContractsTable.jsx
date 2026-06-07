import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem,
  CButton,
  CBadge
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getContracts } from "../../services/contractService"
import { createInvoice } from "../../services/invoiceService"
import moment from "moment"
import { Banknote, FilePlus, Loader2 } from "lucide-react"

function ContractsTable({ onPayClick, onRefresh, fixedBranchId = "" }) {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchContracts()
  }, [page, fixedBranchId])

  const fetchContracts = async () => {
    setLoading(true)
    try {
      // Assuming getContracts supports pagination
      const data = await getContracts({ page, pageSize: 10, branchId: fixedBranchId })
      setContracts(data.items || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch contracts", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (contractId) => {
    try {
      setLoading(true);
      await createInvoice({ contractId });
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to create invoice", error);
      alert("Không thể tạo hóa đơn. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <CBadge color="warning">Pending</CBadge>
      case 'Active': return <CBadge color="success">Active</CBadge>
      case 'Expired': return <CBadge color="danger">Expired</CBadge>
      case 'Cancelled': return <CBadge color="secondary">Cancelled</CBadge>
      default: return <CBadge color="info">{status}</CBadge>
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Pending': return <CBadge color="warning" shape="rounded-pill">Chưa thanh toán</CBadge>
      case 'Paid': return <CBadge color="success" shape="rounded-pill">Đã thanh toán</CBadge>
      case 'Overdue': return <CBadge color="danger" shape="rounded-pill">Quá hạn</CBadge>
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
                    <th>Mã HĐ</th>
                    <th>Hội viên</th>
                    <th>Gói tập</th>
                    <th>Thời hạn</th>
                    <th>Số tiền</th>
                    <th>Hợp đồng</th>
                    <th>Thanh toán</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((item, idx) => (
                    <tr key={item.contractId || item.id || idx}>
                      <td className="text-muted small fw-semibold">
                        {item.contractId ? item.contractId.substring(0, 8).toUpperCase() : 'N/A'}
                      </td>
                      <td>
                        <div className="fw-semibold">{item.memberName || 'Unknown'}</div>
                      </td>
                      <td>{item.packageName || 'N/A'}</td>
                      <td>
                        <div className="small">
                          {moment(item.startDate).format("DD/MM/YYYY")} - <br />
                          {moment(item.endDate).format("DD/MM/YYYY")}
                        </div>
                      </td>
                      <td className="fw-bold text-indigo-600">
                        {formatCurrency(item.dealPrice || item.originalPrice)}
                      </td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{getPaymentBadge(item.invoiceStatus || item.paymentStatus)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton color="info" variant="ghost" size="sm">
                            Xem
                          </CButton>

                          {/* If contract is Pending or invoice is Pending, allow Collect Payment */}
                          {(item.status === 'Pending' || item.invoiceStatus === 'Pending') && item.invoiceId && (
                            <CButton
                              color="primary"
                              size="sm"
                              className="d-flex align-items-center gap-1 text-white shadow-sm"
                              onClick={() => {
                                if (onPayClick) {
                                  onPayClick({
                                    invoiceId: item.invoiceId,
                                    contractId: item.contractId,
                                    totalAmountDue: item.dealPrice,
                                    invoiceCode: item.invoiceId.substring(0, 8).toUpperCase()
                                  })
                                }
                              }}
                            >
                              <Banknote size={14} />
                              Thu Tiền
                            </CButton>
                          )}

                          {item.status === 'Pending' && !item.invoiceId && (
                            <CButton
                              color="secondary"
                              size="sm"
                              className="d-flex align-items-center gap-1 shadow-sm"
                              onClick={() => handleCreateInvoice(item.contractId)}
                            >
                              <FilePlus size={14} />
                              Tạo HĐ
                            </CButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contracts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        Chưa có hợp đồng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-end mt-3">
                <CPagination>
                  <CPaginationItem
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    ‹
                  </CPaginationItem>
                  {[...Array(totalPages)].map((_, idx) => (
                    <CPaginationItem
                      key={idx}
                      active={page === idx + 1}
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    ›
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ContractsTable