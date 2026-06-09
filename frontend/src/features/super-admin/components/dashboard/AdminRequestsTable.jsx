import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CSpinner
} from "@coreui/react"
import { getAllRequests } from "../../../gym-owner/services/requestService"
import moment from "moment"

function AdminRequestsTable() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await getAllRequests()
      const items = res?.data || []
      const sorted = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setRequests(sorted)
    } catch (error) {
      console.error("Failed to load requests", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category) => {
    switch (category) {
      case "BranchCreate": return "Tạo chi nhánh"
      case "BranchUpdate": return "Cập nhật chi nhánh"
      case "BranchDeactivate": return "Ngừng hoạt động chi nhánh"
      case "ContractChange": return "Thay đổi hợp đồng"
      case "RefundRequest": return "Yêu cầu hoàn tiền"
      default: return category
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <CBadge color="warning">Chờ duyệt</CBadge>
      case "InProgress":
        return <CBadge color="info">Đang xử lý</CBadge>
      case "Approved":
      case "Resolved":
        return <CBadge color="success">Đã duyệt</CBadge>
      case "Rejected":
        return <CBadge color="danger">Từ chối</CBadge>
      case "Cancelled":
        return <CBadge color="secondary">Đã hủy</CBadge>
      default:
        return <CBadge color="dark">{status}</CBadge>
    }
  }

  return (
    <CCard className="border-0 shadow-sm mt-4">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Danh Sách Yêu Cầu Gần Đây</h5>
          <CButton color="outline-primary" size="sm" onClick={fetchRequests} disabled={loading}>
            {loading ? "Đang tải..." : "Tải lại"}
          </CButton>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted py-4">Không có yêu cầu nào.</div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
            <CTable align="middle" hover responsive>
              <CTableHead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <CTableRow>
                  <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                  <CTableHeaderCell>Loại yêu cầu</CTableHeaderCell>
                  <CTableHeaderCell>Người yêu cầu</CTableHeaderCell>
                  <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requests.map((req) => (
                  <CTableRow key={req.requestId}>
                    <CTableDataCell className="fw-semibold">{req.title}</CTableDataCell>
                    <CTableDataCell>{getCategoryName(req.category)}</CTableDataCell>
                    <CTableDataCell>
                      <div>{req.requestedByName}</div>
                      <small className="text-muted">{req.requestedByEmail}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      {moment(req.createdAt).format("DD/MM/YYYY HH:mm")}
                    </CTableDataCell>
                    <CTableDataCell>{getStatusBadge(req.status)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default AdminRequestsTable

