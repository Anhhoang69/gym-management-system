import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CFormSelect,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner
} from "@coreui/react"
import moment from "moment"
import { getPayments } from "../../services/paymentService"
import { getBranches } from "../../services/branchService"
import Pagination from "../common/Pagination"

function SalesTable({ fixedBranchId = "", hideBranchFilter = false }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])

  // Local filter inputs (applied only on Search click)
  const [localFilters, setLocalFilters] = useState({
    method: "",
    branchId: fixedBranchId || "",
    fromDate: "",
    toDate: ""
  })

  // Active filter params that trigger useEffect API call
  const [activeFilters, setActiveFilters] = useState({
    method: "",
    branchId: fixedBranchId || "",
    fromDate: "",
    toDate: "",
    page: 1,
    pageSize: 10
  })

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0
  })

  // Fetch branches on mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getBranches()
        setBranches(data || [])
      } catch (err) {
        console.error("Load branches failed in SalesTable:", err)
      }
    }
    loadBranches()
  }, [])

  // Main fetch function
  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = {
        Page: activeFilters.page,
        PageSize: activeFilters.pageSize
      }

      if (activeFilters.method) params.Method = activeFilters.method
      if (activeFilters.branchId) params.BranchId = activeFilters.branchId
      if (activeFilters.fromDate) params.FromDate = `${activeFilters.fromDate}T00:00:00Z`
      if (activeFilters.toDate) params.ToDate = `${activeFilters.toDate}T23:59:59Z`

      const data = await getPayments(params)
      if (data) {
        setPayments(data.items || [])
        setPagination({
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0
        })
      }
    } catch (err) {
      console.error("Fetch payments failed:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch when active filters or page changes
  useEffect(() => {
    fetchPayments()
  }, [
    activeFilters.page,
    activeFilters.method,
    activeFilters.branchId,
    activeFilters.fromDate,
    activeFilters.toDate
  ])

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    setActiveFilters(prev => ({
      ...prev,
      ...localFilters,
      page: 1 // reset to first page on new search
    }))
  }

  const handleReset = () => {
    const defaultFilters = {
      method: "",
      branchId: fixedBranchId || "",
      fromDate: "",
      toDate: ""
    }
    setLocalFilters(defaultFilters)
    setActiveFilters(prev => ({
      ...prev,
      ...defaultFilters,
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    setActiveFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const getMethodBadge = (method) => {
    let color = "secondary"
    switch (method) {
      case "Cash":
        color = "secondary"
        break
      case "Card":
        color = "primary"
        break
      case "BankTransfer":
        color = "success"
        break
      case "EWallet":
        color = "warning"
        break
      case "QRCode":
        color = "info"
        break
    }
    return <CBadge color={color}>{method}</CBadge>
  }

  const getStatusBadge = (status) => {
    let color = "secondary"
    switch (status) {
      case "Paid":
      case "Success":
      case "Completed":
        color = "success"
        break
      case "Pending":
        color = "warning"
        break
      case "Failed":
      case "Cancelled":
        color = "danger"
        break
    }
    return <CBadge color={color}>{status}</CBadge>
  }

  return (
    <div>
      {/* Filter Bar */}
      <form onSubmit={handleSearch} className="mb-3 d-flex gap-3 flex-wrap align-items-center">
        {/* Payment Method */}
        <div style={{ width: 180 }}>
          <CFormSelect
            name="method"
            value={localFilters.method}
            onChange={handleInputChange}
          >
            <option value="">Tất cả phương thức</option>
            <option value="Cash">Cash</option>
            <option value="BankTransfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="EWallet">E-Wallet</option>
            <option value="QRCode">QR Code</option>
          </CFormSelect>
        </div>

        {/* Branch */}
        {!hideBranchFilter && (
          <div style={{ width: 220 }}>
            <CFormSelect
              name="branchId"
              value={localFilters.branchId}
              onChange={handleInputChange}
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        )}

        {/* From Date */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted text-nowrap">Từ:</span>
          <CFormInput
            type="date"
            name="fromDate"
            value={localFilters.fromDate}
            onChange={handleInputChange}
            style={{ width: 150 }}
          />
        </div>

        {/* To Date */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted text-nowrap">Đến:</span>
          <CFormInput
            type="date"
            name="toDate"
            value={localFilters.toDate}
            onChange={handleInputChange}
            style={{ width: 150 }}
          />
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 ms-auto">
          <CButton type="button" color="secondary" variant="outline" size="sm" className="px-3" onClick={handleReset}>
            Làm mới
          </CButton>
          <CButton type="submit" color="warning" size="sm" className="px-3 fw-semibold text-dark">
            Tìm kiếm
          </CButton>
        </div>
      </form>

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-5 bg-white border rounded">
          <CSpinner color="warning" />
          <div className="mt-2 text-muted">Đang tải lịch sử giao dịch...</div>
        </div>
      ) : (
        <div style={{
          maxHeight: "330px", // Fits exactly ~5 rows of data (each ~52px) + header (~45px) beautifully!
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: "8px",
          background: "#fff"
        }}>
          <CTable align="middle" className="mb-0 border" hover responsive style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <CTableHead color="light" className="position-sticky top-0" style={{ zIndex: 1, backgroundColor: "#f8f9fa" }}>
              <CTableRow>
                <CTableHeaderCell style={{ borderTop: "none" }}>Mã giao dịch</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Mã hóa đơn</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Hội viên</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Phương thức</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Mã tham chiếu</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Số tiền</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Nhân viên xử lý</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Trạng thái</CTableHeaderCell>
                <CTableHeaderCell style={{ borderTop: "none" }}>Ngày tạo</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payments.map(item => (
                <CTableRow key={item.paymentId}>
                  <CTableDataCell>
                    <span className="text-muted small" title={item.paymentId}>
                      {item.paymentId?.substring(0, 8)}...
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="fw-semibold" title={item.invoiceId}>
                      {item.invoiceCode || "Chưa có"}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>{item.memberName || "-"}</CTableDataCell>
                  <CTableDataCell>{getMethodBadge(item.method)}</CTableDataCell>
                  <CTableDataCell>
                    <span className="text-muted small">{item.refNo || "-"}</span>
                  </CTableDataCell>
                  <CTableDataCell className="fw-bold">
                    {item.amount?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND"
                    }) || "0 ₫"}
                  </CTableDataCell>
                  <CTableDataCell>{item.processedByStaffName || "-"}</CTableDataCell>
                  <CTableDataCell>{getStatusBadge(item.status)}</CTableDataCell>
                  <CTableDataCell>
                    {item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                  </CTableDataCell>
                </CTableRow>
              ))}
              {payments.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={9} className="text-center py-4 text-muted">
                    Không tìm thấy lịch sử giao dịch nào.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      )}

      {/* Pagination Section */}
      {!loading && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Hiển thị {(activeFilters.page - 1) * activeFilters.pageSize + 1}–
            {Math.min(activeFilters.page * activeFilters.pageSize, pagination.totalItems)} của {pagination.totalItems} giao dịch
          </small>
          <Pagination
            currentPage={activeFilters.page}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default SalesTable