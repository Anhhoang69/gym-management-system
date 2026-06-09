import { useState, useEffect } from "react"
import {
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

  // Sync fixedBranchId
  useEffect(() => {
    setActiveFilters(prev => ({
      ...prev,
      branchId: fixedBranchId || ""
    }))
  }, [fixedBranchId])

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

  const handlePageChange = (newPage) => {
    setActiveFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const getMethodBadge = (method) => {
    let color = "secondary"
    let label = method
    switch (method) {
      case "Cash":
        color = "secondary"
        label = "Tiền mặt"
        break
      case "Card":
        color = "primary"
        label = "Thẻ"
        break
      case "BankTransfer":
        color = "success"
        label = "Chuyển khoản"
        break
      case "EWallet":
        color = "warning"
        label = "Ví điện tử"
        break
      case "QRCode":
        color = "info"
        label = "Mã QR"
        break
    }
    return <CBadge color={color} className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>{label}</CBadge>
  }

  const getStatusBadge = (status) => {
    let color = "secondary"
    let label = status
    switch (status) {
      case "Paid":
      case "Success":
      case "Completed":
        color = "success"
        label = "Thành công"
        break
      case "Pending":
        color = "warning"
        label = "Chờ xử lý"
        break
      case "Failed":
      case "Cancelled":
        color = "danger"
        label = "Thất bại"
        break
    }
    return <CBadge color={color} className="px-2.5 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>{label}</CBadge>
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Filter Bar */}
      <div className="row g-3 align-items-center mb-3 flex-shrink-0">
        {/* Payment Method */}
        <div className={hideBranchFilter ? "col-md-4 col-sm-6" : "col-md-3 col-sm-6"}>
          <CFormSelect
            name="method"
            value={activeFilters.method}
            onChange={(e) => {
              setActiveFilters(prev => ({ ...prev, method: e.target.value, page: 1 }))
            }}
          >
            <option value="">Tất cả phương thức</option>
            <option value="Cash">Tiền mặt</option>
            <option value="BankTransfer">Chuyển khoản</option>
            <option value="Card">Thẻ</option>
            <option value="EWallet">Ví điện tử</option>
            <option value="QRCode">Mã QR</option>
          </CFormSelect>
        </div>

        {/* Branch */}
        {!hideBranchFilter && (
          <div className="col-md-3 col-sm-6">
            <CFormSelect
              name="branchId"
              value={activeFilters.branchId}
              onChange={(e) => {
                setActiveFilters(prev => ({ ...prev, branchId: e.target.value, page: 1 }))
              }}
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
        <div className={`${hideBranchFilter ? "col-md-4 col-sm-6" : "col-md-3 col-sm-6"} d-flex align-items-center gap-2`}>
          <span className="small text-muted text-nowrap">Từ:</span>
          <CFormInput
            type="date"
            name="fromDate"
            value={activeFilters.fromDate}
            onChange={(e) => {
              setActiveFilters(prev => ({ ...prev, fromDate: e.target.value, page: 1 }))
            }}
          />
        </div>

        {/* To Date */}
        <div className={`${hideBranchFilter ? "col-md-4 col-sm-6" : "col-md-3 col-sm-6"} d-flex align-items-center gap-2`}>
          <span className="small text-muted text-nowrap">Đến:</span>
          <CFormInput
            type="date"
            name="toDate"
            value={activeFilters.toDate}
            onChange={(e) => {
              setActiveFilters(prev => ({ ...prev, toDate: e.target.value, page: 1 }))
            }}
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="flex-grow-1 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 bg-white border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center shadow-sm">
            <CSpinner color="warning" />
            <div className="mt-2 text-muted">Đang tải lịch sử giao dịch...</div>
          </div>
        ) : (
          <div className="d-flex flex-column h-100 bg-white border rounded-3 shadow-sm overflow-hidden">
            <div className="flex-grow-1 overflow-auto">
              <table className="table align-middle table-hover mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                <thead className="table-light sticky-top" style={{ backgroundColor: "#f8f9fa", zIndex: 1 }}>
                  <tr>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã GD</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã hóa đơn</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Hội viên</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Phương thức</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Mã tham chiếu</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Số tiền</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Nhân viên</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Trạng thái</th>
                    <th className="py-3 px-3 text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(item => {
                    const payCode = item.paymentId ? item.paymentId.slice(-10).toUpperCase() : "-";
                    const invCode = item.invoiceCode ? (item.invoiceCode.length > 10 ? item.invoiceCode.slice(-10).toUpperCase() : item.invoiceCode) : "Chưa có";
                    return (
                      <tr key={item.paymentId}>
                        <td className="py-3 px-3 text-muted small fw-semibold">
                          {payCode}
                        </td>
                        <td className="py-3 px-3 text-dark fw-semibold">
                          {invCode}
                        </td>
                        <td className="py-3 px-3 text-dark">{item.memberName || "-"}</td>
                        <td className="py-3 px-3">{getMethodBadge(item.method)}</td>
                        <td className="py-3 px-3 text-muted small">{item.refNo || "-"}</td>
                        <td className="py-3 px-3 text-dark fw-semibold">
                          {item.amount?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND"
                          }) || "0 ₫"}
                        </td>
                        <td className="py-3 px-3 text-dark">{item.processedByStaffName || "-"}</td>
                        <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                        <td className="py-3 px-3 text-dark">
                          {item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                        </td>
                      </tr>
                    )
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        Không tìm thấy lịch sử giao dịch nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {!loading && pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light flex-shrink-0">
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
        )}
      </div>
    </div>
  )
}

export default SalesTable