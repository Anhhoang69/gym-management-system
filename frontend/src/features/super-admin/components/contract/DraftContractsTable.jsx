import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem,
  CButton,
  CBadge
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getDraftContracts, deleteDraftContract, generateContract } from "../../services/contractService"
import { createInvoice } from "../../services/invoiceService"
import moment from "moment"
import { Trash2, FileCheck, Loader2 } from "lucide-react"
import Pagination from "../../../../shared/components/Pagination"

function DraftContractsTable({ onContractCreated, fixedBranchId = "" }) {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [processingId, setProcessingId] = useState(null)

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
                    <th>Mã Nháp</th>
                    <th>Hội viên</th>
                    <th>Gói tập</th>
                    <th>Thời gian tập</th>
                    <th>Thời hạn</th>
                    <th>Tổng tiền</th>
                    <th>Hết hạn lưu</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((item, idx) => (
                    <tr key={item.draftId || idx}>
                      <td className="text-muted small fw-semibold">
                        {item.draftId ? item.draftId.substring(0, 8).toUpperCase() : 'N/A'}
                      </td>
                      <td>
                        <div className="fw-semibold">{item.memberName || 'Unknown'}</div>
                      </td>
                      <td>{item.packageName || 'N/A'}</td>
                      <td>{item.durationMonths} Tháng</td>
                      <td>
                        <div className="small">
                          {moment(item.startDate).format("DD/MM/YYYY")} - <br />
                          {moment(item.endDate).format("DD/MM/YYYY")}
                        </div>
                      </td>
                      <td className="fw-bold text-indigo-600">
                        {formatCurrency(item.dealPrice)}
                      </td>
                      <td>
                        <CBadge color={moment().isAfter(moment(item.expiresAt)) ? "danger" : "warning"}>
                          {moment(item.expiresAt).format("DD/MM HH:mm")}
                        </CBadge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton
                            color="success"
                            variant="outline"
                            size="sm"
                            className="d-flex align-items-center gap-1"
                            onClick={() => handleGenerate(item.draftId)}
                            disabled={processingId === item.draftId || moment().isAfter(moment(item.expiresAt))}
                          >
                            {processingId === item.draftId ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />}
                            Ký Hợp Đồng
                          </CButton>
                          <CButton 
                            color="danger" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(item.draftId)}
                            disabled={processingId === item.draftId}
                          >
                            <Trash2 size={14} />
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {drafts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        Chưa có bản nháp nào.
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

export default DraftContractsTable
