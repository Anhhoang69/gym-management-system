import {
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getContracts, cancelContract } from "../../services/contractService"
import { createInvoice } from "../../services/invoiceService"
import moment from "moment"
import { Banknote, FilePlus, MoreVertical } from "lucide-react"
import Pagination from "../../../../shared/components/Pagination"
import ContractDetailModal from "./ContractDetailModal"
import EditContractModal from "./EditContractModal"

function ContractsTable({ onPayClick, onRefresh, fixedBranchId = "" }) {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Details Modal states
  const [selectedContractId, setSelectedContractId] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchContracts()
  }, [page, fixedBranchId])

  const fetchContracts = async () => {
    setLoading(true)
    try {
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
      await createInvoice({ contractId, taxAmount: 0 });
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to create invoice", error);
      alert("Không thể tạo hóa đơn. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancelContract = async (contractId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy hợp đồng này không? Thao tác này sẽ vô hiệu hóa thẻ và không thể hoàn tác.")) {
      return
    }
    setLoading(true)
    try {
      await cancelContract(contractId)
      fetchContracts()
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Failed to cancel contract", error)
      alert("Không thể hủy hợp đồng. Vui lòng kiểm tra lại.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <CBadge color="warning" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Chờ xử lý</CBadge>
      case 'Active': return <CBadge color="success" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Hoạt động</CBadge>
      case 'Expired': return <CBadge color="danger" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Hết hạn</CBadge>
      case 'Cancelled': return <CBadge color="secondary" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Đã hủy</CBadge>
      default: return <CBadge color="info" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>{status}</CBadge>
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Pending': return <CBadge color="warning" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Chưa thanh toán</CBadge>
      case 'Paid': return <CBadge color="success" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Đã thanh toán</CBadge>
      case 'Overdue': return <CBadge color="danger" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>Quá hạn</CBadge>
      default: return <CBadge color="secondary" shape="rounded-pill" className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>{status || 'N/A'}</CBadge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  return (
    <div className="d-flex flex-column h-100 bg-white border rounded-3 shadow-sm overflow-hidden">
      {loading ? (
        <div className="text-center py-5 my-auto">Đang tải dữ liệu hợp đồng...</div>
      ) : (
        <>
          <div className="flex-grow-1 overflow-auto">
            <table className="table align-middle table-hover mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead className="table-light sticky-top" style={{ backgroundColor: "#f8f9fa", zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã HĐ</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Hội viên</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Gói tập</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thời hạn</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Số tiền</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Hợp đồng</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thanh toán</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold text-center" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((item, idx) => (
                  <tr key={item.contractId || item.id || idx}>
                    <td className="py-3 px-3 text-muted small fw-semibold">
                      {item.contractId ? item.contractId.slice(-10).toUpperCase() : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="fw-semibold text-dark">{item.memberName || 'Unknown'}</div>
                    </td>
                    <td className="py-3 px-3 text-dark">{item.packageName || 'N/A'}</td>
                    <td className="py-3 px-3 text-dark">
                      <div className="small">
                        {moment(item.startDate).format("DD/MM/YYYY")} - <br />
                        {moment(item.endDate).format("DD/MM/YYYY")}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-dark fw-semibold">
                      {formatCurrency(item.dealPrice || item.originalPrice)}
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3">{getPaymentBadge(item.invoiceStatus || item.paymentStatus)}</td>
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
                              setSelectedContractId(item.contractId)
                              setShowDetailModal(true)
                            }}
                          >
                            Xem chi tiết
                          </CDropdownItem>
                          <CDropdownItem
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedContractId(item.contractId)
                              setShowEditModal(true)
                            }}
                          >
                            Chỉnh sửa hợp đồng
                          </CDropdownItem>

                          {/* If contract is Pending and has no invoice, allow Create Invoice */}
                          {item.status === 'Pending' && !item.invoiceId && (
                            <>
                              <hr className="my-1" />
                              <CDropdownItem
                                className="text-success"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleCreateInvoice(item.contractId)}
                              >
                                Tạo hóa đơn
                              </CDropdownItem>
                            </>
                          )}

                          {/* Allow cancel if contract is active or pending */}
                          {item.status !== 'Cancelled' && item.status !== 'Expired' && (
                            <>
                              <hr className="my-1" />
                              <CDropdownItem
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleCancelContract(item.contractId)}
                              >
                                Hủy hợp đồng
                              </CDropdownItem>
                            </>
                          )}
                        </CDropdownMenu>
                      </CDropdown>
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      Chưa có hợp đồng nào.
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

      {/* Contract Detail Modal */}
      <ContractDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedContractId(null)
        }}
        contractId={selectedContractId}
      />

      {/* Contract Edit Modal */}
      <EditContractModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedContractId(null)
        }}
        contractId={selectedContractId}
        onSuccess={() => {
          fetchContracts()
          if (onRefresh) onRefresh()
        }}
      />
    </div>
  )
}

export default ContractsTable