import {
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getDraftContracts, deleteDraftContract, generateContract } from "../../services/contractService"
import { createInvoice } from "../../services/invoiceService"
import moment from "moment"
import { Trash2, FileCheck, Loader2, MoreVertical } from "lucide-react"
import Pagination from "../../../../shared/components/Pagination"
import DraftDetailModal from "./DraftDetailModal"

function DraftContractsTable({ onContractCreated, fixedBranchId = "" }) {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [processingId, setProcessingId] = useState(null)

  // Detail Modal states
  const [selectedDraftId, setSelectedDraftId] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchDrafts()
  }, [page, fixedBranchId])

  const fetchDrafts = async () => {
    setLoading(true)
    try {
      const data = await getDraftContracts({ page, pageSize: 10, branchId: fixedBranchId })
      setDrafts(data.items || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch drafts", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bản nháp này?")) return;
    try {
      await deleteDraftContract(id);
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert("Không thể xoá bản nháp.");
    }
  }

  const handleGenerate = async (id) => {
    try {
      setProcessingId(id);
      let result = await generateContract({ draftId: id });
      
      // Auto-issue invoice if backend didn't generate one
      if (result && !result.invoiceId && (result.contractId || result.id)) {
          try {
              const invoiceRes = await createInvoice({ contractId: result.contractId || result.id });
              if (invoiceRes && invoiceRes.invoiceId) {
                  result = { ...result, invoiceId: invoiceRes.invoiceId };
              }
          } catch (invErr) {
              console.error("Failed to auto-issue invoice", invErr);
          }
      }

      if (onContractCreated) {
        onContractCreated(result);
      }
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert("Không thể tạo hợp đồng từ bản nháp này.");
    } finally {
      setProcessingId(null);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  return (
    <div className="d-flex flex-column h-100 bg-white border rounded-3 shadow-sm overflow-hidden">
      {loading ? (
        <div className="text-center py-5 my-auto">Đang tải dữ liệu bản nháp...</div>
      ) : (
        <>
          <div className="flex-grow-1 overflow-auto">
            <table className="table align-middle table-hover mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead className="table-light sticky-top" style={{ backgroundColor: "#f8f9fa", zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã Nháp</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Hội viên</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Gói tập</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thời gian</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thời hạn</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Tổng tiền</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Hết hạn lưu</th>
                  <th className="py-3 px-3 text-uppercase text-muted fw-bold text-center" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((item, idx) => {
                  const isExpired = moment().isAfter(moment(item.expiresAt));
                  return (
                    <tr key={item.draftId || idx}>
                      <td className="py-3 px-3 text-muted small fw-semibold">
                        {item.draftId ? item.draftId.slice(-10).toUpperCase() : 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="fw-semibold text-dark">{item.memberName || 'Unknown'}</div>
                      </td>
                      <td className="py-3 px-3 text-dark">{item.packageName || 'N/A'}</td>
                      <td className="py-3 px-3 text-dark">{item.durationMonths} Tháng</td>
                      <td className="py-3 px-3 text-dark">
                        <div className="small">
                          {moment(item.startDate).format("DD/MM/YYYY")} - <br />
                          {moment(item.endDate).format("DD/MM/YYYY")}
                        </div>
                      </td>
                      <td className="py-3 px-3 fw-bold text-warning">
                        {formatCurrency(item.dealPrice)}
                      </td>
                      <td className="py-3 px-3">
                        <CBadge color={isExpired ? "danger" : "warning"} className="px-2 py-1" style={{ fontSize: "11px" }}>
                          {moment(item.expiresAt).format("DD/MM HH:mm")}
                        </CBadge>
                      </td>
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
                                setSelectedDraftId(item.draftId)
                                setShowDetailModal(true)
                              }}
                            >
                              Xem chi tiết
                            </CDropdownItem>
                            
                            {!isExpired && (
                              <CDropdownItem
                                className="text-success"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleGenerate(item.draftId)}
                                disabled={processingId === item.draftId}
                              >
                                {processingId === item.draftId ? "Đang ký..." : "Ký hợp đồng"}
                              </CDropdownItem>
                            )}

                            <hr className="my-1" />
                            <CDropdownItem
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDelete(item.draftId)}
                              disabled={processingId === item.draftId}
                            >
                              Xóa bản nháp
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </td>
                    </tr>
                  )
                })}
                {drafts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      Chưa có bản nháp nào.
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

      {/* Draft Detail Modal */}
      <DraftDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedDraftId(null)
        }}
        draftId={selectedDraftId}
        onContractCreated={(result) => {
          if (onContractCreated) {
            onContractCreated(result)
          }
          fetchDrafts()
        }}
      />
    </div>
  )
}

export default DraftContractsTable
