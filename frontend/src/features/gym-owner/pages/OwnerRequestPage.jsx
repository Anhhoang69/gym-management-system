import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow,
  CCol,
  CFormSelect,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormLabel
} from "@coreui/react"
import {
  getAllRequests,
  getMyRequests,
  getRequestDetails,
  approveRequest,
  rejectRequest,
  cancelRequest
} from "../services/requestService"

function OwnerRequestPage() {
  const [activeTab, setActiveTab] = useState("incoming") // "incoming" or "my"
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [relatedEntityTypeFilter, setRelatedEntityTypeFilter] = useState("")

  // Details Modal
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [requestDetails, setRequestDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Rejection Dialog
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch Requests
  const fetchRequests = async () => {
    setLoading(true)
    try {
      let data = []
      if (activeTab === "incoming") {
        const params = {}
        if (categoryFilter) params.category = categoryFilter
        if (statusFilter) params.status = statusFilter
        if (relatedEntityTypeFilter) params.relatedEntityType = relatedEntityTypeFilter
        
        const response = await getAllRequests(params)
        data = response.data || []
      } else {
        const params = {}
        if (categoryFilter) params.category = categoryFilter
        if (statusFilter) params.status = statusFilter

        const response = await getMyRequests(params)
        data = response.data || []
      }
      setRequests(data)
    } catch (e) {
      console.error("Failed to fetch requests", e)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [activeTab, categoryFilter, statusFilter, relatedEntityTypeFilter])

  // Open Details Modal
  const handleOpenDetails = async (id) => {
    setSelectedRequestId(id)
    setShowDetailModal(true)
    setDetailsLoading(true)
    setRequestDetails(null)
    try {
      const response = await getRequestDetails(id)
      setRequestDetails(response.data)
    } catch (e) {
      console.error("Failed to fetch request details", e)
    } finally {
      setDetailsLoading(false)
    }
  }

  // Handle Approve
  const handleApprove = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn PHÊ DUYỆT yêu cầu này không?")) return
    setActionLoading(true)
    try {
      const res = await approveRequest(selectedRequestId)
      if (res.success) {
        alert("Đã phê duyệt yêu cầu thành công!")
        setShowDetailModal(false)
        fetchRequests()
      } else {
        alert(res.message || "Lỗi phê duyệt yêu cầu")
      }
    } catch (e) {
      alert("Lỗi hệ thống khi phê duyệt")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Open Reject Dialog
  const handleOpenReject = () => {
    setRejectReason("")
    setShowRejectModal(true)
  }

  // Handle Submit Reject
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!")
      return
    }
    setActionLoading(true)
    try {
      const res = await rejectRequest(selectedRequestId, rejectReason)
      if (res.success) {
        alert("Đã từ chối yêu cầu!")
        setShowRejectModal(false)
        setShowDetailModal(false)
        fetchRequests()
      } else {
        alert(res.message || "Lỗi từ chối yêu cầu")
      }
    } catch (e) {
      alert("Lỗi hệ thống khi từ chối")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Creator Cancel Request
  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn HỦY yêu cầu của mình không?")) return
    setActionLoading(true)
    try {
      const res = await cancelRequest(selectedRequestId)
      if (res.success) {
        alert("Đã hủy yêu cầu thành công!")
        setShowDetailModal(false)
        fetchRequests()
      } else {
        alert(res.message || "Lỗi hủy yêu cầu")
      }
    } catch (e) {
      alert("Lỗi hệ thống khi hủy")
    } finally {
      setActionLoading(false)
    }
  }

  // Parse Payload beautifully
  const renderPayload = (payload) => {
    if (!payload) return <span className="text-muted">Không có dữ liệu payload</span>
    try {
      let parsed = payload
      if (typeof payload === "string") {
        parsed = JSON.parse(payload)
      }
      return (
        <pre className="bg-light p-3 border rounded text-dark fs-6" style={{ maxHeight: "300px", overflow: "auto", fontFamily: "Consolas, monospace" }}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      )
    } catch (e) {
      return (
        <pre className="bg-light p-3 border rounded text-dark fs-6" style={{ maxHeight: "300px", overflow: "auto", fontFamily: "Consolas, monospace" }}>
          {payload}
        </pre>
      )
    }
  }

  // Badges helper
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "BranchCreate":
        return <CBadge color="primary">Tạo Chi Nhánh</CBadge>
      case "BranchUpdate":
        return <CBadge color="info">Cập Nhật Chi Nhánh</CBadge>
      case "BranchDeactivate":
        return <CBadge color="dark">Vô Hiệu Hóa Chi Nhánh</CBadge>
      case "ContractChange":
        return <CBadge color="warning" className="text-dark">Thay Đổi Hợp Đồng</CBadge>
      case "RefundRequest":
        return <CBadge color="danger">Yêu Cầu Hoàn Tiền</CBadge>
      default:
        return <CBadge color="secondary">{cat}</CBadge>
    }
  }

  const getStatusBadge = (stat) => {
    switch (stat) {
      case "Pending":
        return <CBadge color="warning" className="text-dark">Chờ Duyệt</CBadge>
      case "InProgress":
        return <CBadge color="info">Đang Xử Lý</CBadge>
      case "Resolved":
      case "Approved":
        return <CBadge color="success">Đã Duyệt</CBadge>
      case "Rejected":
        return <CBadge color="danger">Bị Từ Chối</CBadge>
      case "Cancelled":
        return <CBadge color="secondary">Đã Hủy</CBadge>
      default:
        return <CBadge color="secondary">{stat}</CBadge>
    }
  }

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex-shrink-0 mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Yêu Cầu (Requests)</h3>
          <p className="text-muted mb-0">Duyệt hoặc theo dõi các yêu cầu thay đổi trong hệ thống EnerGym.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-shrink-0 mb-3">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink
              active={activeTab === "incoming"}
              onClick={() => {
                setActiveTab("incoming")
                setRequests([])
              }}
              style={{ cursor: "pointer", fontWeight: activeTab === "incoming" ? "bold" : "normal" }}
            >
              Yêu Cầu Cần Duyệt (Incoming)
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === "my"}
              onClick={() => {
                setActiveTab("my")
                setRequests([])
              }}
              style={{ cursor: "pointer", fontWeight: activeTab === "my" ? "bold" : "normal" }}
            >
              Yêu Cầu Của Tôi (My Sent)
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      {/* Filter Row */}
      <CCard className="border-0 shadow-sm rounded-4 mb-3 flex-shrink-0">
        <CCardBody className="p-3">
          <CRow className="g-3">
            <CCol md={4} xs={12}>
              <label className="form-label small fw-bold">Phân Loại Yêu Cầu (Category)</label>
              <CFormSelect
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="BranchCreate">Tạo chi nhánh (BranchCreate)</option>
                <option value="BranchUpdate">Cập nhật chi nhánh (BranchUpdate)</option>
                <option value="BranchDeactivate">Vô hiệu hóa chi nhánh (BranchDeactivate)</option>
                <option value="ContractChange">Thay đổi hợp đồng (ContractChange)</option>
                <option value="RefundRequest">Yêu cầu hoàn tiền (RefundRequest)</option>
              </CFormSelect>
            </CCol>

            <CCol md={4} xs={12}>
              <label className="form-label small fw-bold">Trạng Thái (Status)</label>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Pending">Chờ duyệt (Pending)</option>
                <option value="InProgress">Đang xử lý (InProgress)</option>
                <option value="Approved">Đã duyệt (Approved)</option>
                <option value="Rejected">Bị từ chối (Rejected)</option>
                <option value="Cancelled">Đã hủy (Cancelled)</option>
              </CFormSelect>
            </CCol>

            {activeTab === "incoming" && (
              <CCol md={4} xs={12}>
                <label className="form-label small fw-bold">Thực Thể Liên Quan (Entity Type)</label>
                <CFormSelect
                  value={relatedEntityTypeFilter}
                  onChange={(e) => setRelatedEntityTypeFilter(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Branch">Chi Nhánh (Branch)</option>
                  <option value="Contract">Hợp Đồng (Contract)</option>
                  <option value="Member">Thành Viên (Member)</option>
                </CFormSelect>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Main Table / Content List */}
      <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
        <CCardBody className="p-0 h-100 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">
            {loading ? (
              <div className="text-center py-5">Đang tải danh sách yêu cầu...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Không tìm thấy yêu cầu nào phù hợp với bộ lọc của bạn.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ minWidth: "800px" }}>
                  <thead className="table-light sticky-top">
                    <tr>
                      <th className="py-3 px-4" style={{ width: "100px" }}>Mã YC</th>
                      <th className="py-3">Tiêu Đề</th>
                      <th className="py-3">Phân Loại</th>
                      <th className="py-3">Trạng Thái</th>
                      <th className="py-3">Người Gửi</th>
                      <th className="py-3">Ngày Gửi</th>
                      <th className="py-3 px-4 text-center" style={{ width: "120px" }}>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.requestId} style={{ cursor: "pointer" }} onClick={() => handleOpenDetails(req.requestId)}>
                        <td className="py-3 px-4 font-monospace small text-muted">
                          {req.requestId.slice(0, 8)}...
                        </td>
                        <td className="py-3 fw-semibold">{req.title || "Không có tiêu đề"}</td>
                        <td className="py-3">{getCategoryBadge(req.category)}</td>
                        <td className="py-3">{getStatusBadge(req.status)}</td>
                        <td className="py-3">
                          <div>
                            <div className="fw-semibold small">{req.requestedByName}</div>
                            <div className="text-muted small" style={{ fontSize: "11px" }}>{req.requestedByEmail}</div>
                          </div>
                        </td>
                        <td className="py-3 text-muted small">
                          {new Date(req.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <CButton
                            color="warning"
                            size="sm"
                            variant="ghost"
                            className="fw-bold"
                            onClick={() => handleOpenDetails(req.requestId)}
                          >
                            Chi Tiết
                          </CButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* Dynamic Request Details Modal */}
      <CModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        size="lg"
        backdrop="static"
        scrollable
      >
        <CModalHeader className="bg-light">
          <CModalTitle className="fw-bold">Chi Tiết Yêu Cầu</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          {detailsLoading ? (
            <div className="text-center py-4">Đang tải thông tin chi tiết...</div>
          ) : requestDetails ? (
            <div className="d-flex flex-column gap-3">
              {/* Core Attributes */}
              <CRow className="row-cols-1 row-cols-md-2 g-3 border-bottom pb-3">
                <CCol>
                  <div className="small text-muted">Mã yêu cầu (UUID)</div>
                  <div className="fw-semibold font-monospace">{requestDetails.requestId}</div>
                </CCol>
                <CCol>
                  <div className="small text-muted">Tiêu đề</div>
                  <div className="fw-bold fs-5 text-dark">{requestDetails.title}</div>
                </CCol>
                <CCol>
                  <div className="small text-muted">Loại danh mục</div>
                  <div className="mt-1">{getCategoryBadge(requestDetails.category)}</div>
                </CCol>
                <CCol>
                  <div className="small text-muted">Trạng thái hiện tại</div>
                  <div className="mt-1">{getStatusBadge(requestDetails.status)}</div>
                </CCol>
                <CCol>
                  <div className="small text-muted">Người gửi yêu cầu</div>
                  <div className="fw-semibold">{requestDetails.requestedByName} ({requestDetails.requestedByEmail})</div>
                </CCol>
                <CCol>
                  <div className="small text-muted">Thời gian khởi tạo</div>
                  <div className="fw-semibold text-muted">{new Date(requestDetails.createdAt).toLocaleString("vi-VN")}</div>
                </CCol>
              </CRow>

              {/* Description */}
              <div className="border-bottom pb-3">
                <div className="small text-muted mb-1">Mô tả lý do / Nội dung chi tiết</div>
                <div className="bg-light p-3 rounded text-dark fs-6" style={{ whiteSpace: "pre-wrap" }}>
                  {requestDetails.description || "Không có mô tả nội dung."}
                </div>
              </div>

              {/* JSON payload snapshot */}
              <div className="border-bottom pb-3">
                <div className="small text-muted mb-1">Dữ liệu Snapshot (Payload JSON)</div>
                {renderPayload(requestDetails.payload)}
              </div>

              {/* Handling / Resolution details */}
              {(requestDetails.status === "Approved" || requestDetails.status === "Resolved" || requestDetails.status === "Rejected") && (
                <div className="bg-light p-3 rounded border">
                  <h6 className="fw-bold mb-2">Thông Tin Xử Lý Yêu Cầu</h6>
                  <CRow className="g-2 small">
                    <CCol xs={12} md={6}>
                      <span className="text-muted">Người xử lý:</span>{" "}
                      <span className="fw-bold">{requestDetails.handledByName || "Hệ thống"}</span>
                    </CCol>
                    <CCol xs={12} md={6}>
                      <span className="text-muted">Thời gian giải quyết:</span>{" "}
                      <span className="fw-bold">{requestDetails.resolvedAt ? new Date(requestDetails.resolvedAt).toLocaleString("vi-VN") : "N/A"}</span>
                    </CCol>
                    {requestDetails.responseMessage && (
                      <CCol xs={12} className="mt-2">
                        <span className="text-muted">Phản hồi của Admin:</span>
                        <div className="fw-semibold bg-white p-2 rounded mt-1 border text-danger">{requestDetails.responseMessage}</div>
                      </CCol>
                    )}
                  </CRow>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-danger py-4">Không tìm thấy dữ liệu yêu cầu!</div>
          )}
        </CModalBody>

        <CModalFooter className="bg-light">
          <CButton color="secondary" variant="ghost" className="fw-semibold" onClick={() => setShowDetailModal(false)}>
            Đóng
          </CButton>

          {/* Incoming Tab actions - GymOwner approves / rejects Pending request */}
          {activeTab === "incoming" && requestDetails?.status === "Pending" && (
            <div className="d-flex gap-2">
              <CButton
                color="danger"
                className="fw-bold text-white"
                onClick={handleOpenReject}
                disabled={actionLoading}
              >
                Từ Chối (Reject)
              </CButton>
              <CButton
                color="success"
                className="fw-bold text-white"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                Phê Duyệt (Approve)
              </CButton>
            </div>
          )}

          {/* My Sent Tab actions - Creator cancels Pending request */}
          {activeTab === "my" && requestDetails?.status === "Pending" && (
            <CButton
              color="danger"
              variant="outline"
              className="fw-bold"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              Hủy Yêu Cầu (Cancel)
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Rejection Message Form Dialog */}
      <CModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        backdrop="static"
      >
        <CModalHeader className="bg-danger text-white">
          <CModalTitle className="fw-bold">Từ Chối Yêu Cầu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel className="fw-semibold text-danger">Lý do từ chối yêu cầu *</CFormLabel>
            <CFormTextarea
              rows={3}
              placeholder="Vui lòng cung cấp lý do từ chối chi tiết..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <small className="text-muted mt-1 d-block">Admin sẽ nhận được lý do phản hồi này thông qua Notification.</small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowRejectModal(false)}>
            Hủy
          </CButton>
          <CButton
            color="danger"
            className="fw-bold text-white"
            onClick={handleConfirmReject}
            disabled={actionLoading}
          >
            Từ Chối
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default OwnerRequestPage
