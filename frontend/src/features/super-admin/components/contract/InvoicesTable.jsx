import {
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getInvoices, cancelInvoice } from "../../services/invoiceService"
import moment from "moment"
import { MoreVertical } from "lucide-react"
import Pagination from "../../../../shared/components/Pagination"
import InvoiceDetailModal from "./InvoiceDetailModal"

function InvoicesTable({ onPayClick, fixedBranchId = "" }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Details Modal States
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy hóa đơn này?")) return;
    try {
      await cancelInvoice(id);
      fetchInvoices();
    } catch (err) {
      console.error("Failed to cancel invoice", err);
      alert(err.response?.data?.message || "Không thể hủy hóa đơn.");
    }
  }

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
      case 'Pending': return <CBadge color="warning" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Chưa thanh toán</CBadge>
      case 'Paid': return <CBadge color="success" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Đã thanh toán</CBadge>
      case 'Overdue': return <CBadge color="danger" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Quá hạn</CBadge>
      case 'Cancelled': return <CBadge color="secondary" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Đã hủy</CBadge>
      default: return <CBadge color="secondary" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>{status || 'N/A'}</CBadge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  return (
    <div className="d-flex flex-column h-100 bg-white border rounded-3 shadow-sm overflow-hidden">
      {loading ? (
        <div className="text-center py-5 my-auto">Đang tải dữ liệu hóa đơn...</div>
      ) : (
        <>
          <div className="flex-grow-1 overflow-auto">
            <table className="table align-middle table-hover mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead className="table-light sticky-top" style={{ backgroundColor: "#f8f9fa", zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã Hóa Đơn</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Nội dung</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Ngày tạo</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Số tiền</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Trạng thái</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold text-center" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((item, idx) => {
                  const rawCode = item.invoiceCode || item.invoiceId || item.id || '';
                  const displayCode = rawCode ? rawCode.slice(-10).toUpperCase() : 'N/A';
                  const isPending = item.status === 'Pending' || item.paymentStatus === 'Pending';
                  
                  return (
                    <tr key={item.invoiceId || item.id || idx}>
                      <td className="py-3 px-3 text-muted small fw-semibold">
                        {displayCode}
                      </td>
                      <td className="py-3 px-3">
                        <div className="fw-semibold text-dark">{item.description || item.note || `Thanh toán hợp đồng hội viên`}</div>
                        {item.memberName && <div className="small text-muted">{item.memberName}</div>}
                      </td>
                      <td className="py-3 px-3 text-dark">
                        <div className="small">
                          {moment(item.createdAt || item.issueDate).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-dark fw-semibold">
                        {formatCurrency(item.amount || item.totalAmount || item.total)}
                      </td>
                      <td className="py-3 px-3">{getPaymentBadge(item.status || item.paymentStatus)}</td>
                      <td className="py-3 px-3 text-center">
                        <CDropdown alignment="end">
                          <CDropdownToggle
                            color="light"
                            size="sm"
                            caret={false}
                            className="border shadow-sm d-flex align-items-center justify-content-center p-2 rounded-3"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <MoreVertical size={16} className="text-muted" />
                          </CDropdownToggle>
                          <CDropdownMenu style={{ zIndex: 1050 }}>
                            <CDropdownItem
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedInvoiceId(item.invoiceId || item.id)
                                setShowDetailModal(true)
                              }}
                            >
                              Xem chi tiết
                            </CDropdownItem>

                            {isPending && (
                              <>
                                <hr className="my-1" />
                                <CDropdownItem
                                  className="text-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (onPayClick) {
                                      onPayClick({
                                        invoiceId: item.invoiceId || item.id,
                                        contractId: item.contractId,
                                        totalAmountDue: item.amount || item.totalAmount || item.total,
                                        invoiceCode: displayCode
                                      })
                                    }
                                  }}
                                >
                                  Thu tiền
                                </CDropdownItem>
                                <CDropdownItem
                                  className="text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleCancel(item.invoiceId || item.id)}
                                >
                                  Hủy hóa đơn
                                </CDropdownItem>
                              </>
                            )}
                          </CDropdownMenu>
                        </CDropdown>
                      </td>
                    </tr>
                  )
                })}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Chưa có hóa đơn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-end p-3 border-top bg-light">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedInvoiceId(null)
        }}
        invoiceId={selectedInvoiceId}
      />
    </div>
  )
}

export default InvoicesTable
