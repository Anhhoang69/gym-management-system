import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem
} from "@coreui/react"
import { CChartBar, CChartPie } from "@coreui/react-chartjs"
import {
  getPayrollFormulas,
  createPayrollFormula,
  activatePayrollFormula,
  calculatePayroll,
  getPayrollReports,
  exportPayrollCsv
} from "../../../shared/services/payrollService"
import { getCommissionsAdmin } from "../../../shared/services/commissionService"
import PeriodPicker from "../../../shared/components/payroll/PeriodPicker"
import PayrollSummaryCards from "../../../shared/components/payroll/PayrollSummaryCards"
import PayslipDetailModal from "../../../shared/components/payroll/PayslipDetailModal"

function AdminPayrollPage() {
  const [activeTab, setActiveTab] = useState("payroll_records") // "payroll_records", "commission_records", "formulas", "analytics"
  const [formulas, setFormulas] = useState([])
  const [reports, setReports] = useState([])
  const [commissions, setCommissions] = useState([])
  
  const [selectedFormulaId, setSelectedFormulaId] = useState("")
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const currentDate = new Date()
  const defaultPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod)

  // Filters for Payroll records
  const [filterPosition, setFilterPosition] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  // Pagination for Commissions
  const [commPage, setCommPage] = useState(1)
  const [commTotalPages, setCommTotalPages] = useState(1)

  // Detail Modal State
  const [selectedSlip, setSelectedSlip] = useState(null)
  const [showSlipModal, setShowSlipModal] = useState(false)

  // Formula Modal State
  const [showFormulaModal, setShowFormulaModal] = useState(false)
  const [newFormula, setNewFormula] = useState({
    name: "",
    defaultBaseSalary: 5000000,
    commissionPerSession: 150000,
    kpiSessionThreshold: 20,
    kpiBonus: 1500000
  })

  // Fetch Formulas
  const fetchFormulas = async () => {
    try {
      const res = await getPayrollFormulas()
      const data = res.data || []
      setFormulas(data)

      const active = data.find(f => f.isActive ?? f.active)
      if (active) {
        setSelectedFormulaId(active.formulaId || active.id)
      } else if (data.length > 0) {
        setSelectedFormulaId(data[0].formulaId || data[0].id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Fetch Reports
  const fetchReports = async () => {
    setLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await getPayrollReports(month, year, {
        position: filterPosition || undefined
      })
      
      let data = res.data || []
      if (filterStatus) {
        data = data.filter(r => r.status === filterStatus)
      }
      setReports(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Commissions
  const fetchCommissions = async () => {
    setLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await getCommissionsAdmin({
        month,
        year,
        page: commPage,
        pageSize: 10
      })
      if (res?.success) {
        setCommissions(res.data?.items || [])
        setCommTotalPages(res.data?.totalPages || 1)
      } else {
        setCommissions([])
        setCommTotalPages(1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFormulas()
  }, [])

  useEffect(() => {
    if (activeTab === "payroll_records" || activeTab === "analytics") {
      fetchReports()
    } else if (activeTab === "commission_records") {
      fetchCommissions()
    }
  }, [activeTab, selectedPeriod, filterPosition, filterStatus, commPage])

  // Handle Formula Creation
  const handleCreateFormula = async () => {
    if (!newFormula.name.trim()) {
      alert("Vui lòng nhập tên công thức!")
      return
    }
    setActionLoading(true)
    try {
      const res = await createPayrollFormula(newFormula)
      if (res.success) {
        alert("Đã tạo công thức lương mới thành công!")
        setShowFormulaModal(false)
        setNewFormula({
          name: "",
          defaultBaseSalary: 5000000,
          commissionPerSession: 150000,
          kpiSessionThreshold: 20,
          kpiBonus: 1500000
        })
        fetchFormulas()
      } else {
        alert(res.message || "Lỗi tạo công thức!")
      }
    } catch (e) {
      alert("Lỗi hệ thống")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Formula Activation
  const handleActivateFormula = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn KÍCH HOẠT công thức lương này làm mặc định không? Các công thức khác sẽ bị vô hiệu hóa.")) return
    setActionLoading(true)
    try {
      const res = await activatePayrollFormula(id)
      if (res.success) {
        alert("Kích hoạt công thức lương thành công!")
        fetchFormulas()
      } else {
        alert(res.message || "Lỗi kích hoạt!")
      }
    } catch (e) {
      alert("Lỗi hệ thống")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Payroll Calculation
  const handleCalculatePayroll = async () => {
    if (!selectedFormulaId) {
      alert("Vui lòng chọn công thức tính lương!")
      return
    }
    setActionLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await calculatePayroll({ month, year, formulaId: selectedFormulaId })
      if (res.success) {
        alert(`Đã tính toán lương nhân sự kỳ ${selectedPeriod} thành công!`)
        fetchReports()
      } else {
        alert(res.message || "Lỗi tính toán payroll")
      }
    } catch (e) {
      alert("Lỗi hệ thống")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Export CSV
  const handleExportCsv = async () => {
    setActionLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await exportPayrollCsv(month, year)
      if (!res.success) {
        alert(res.message || "Lỗi xuất file CSV")
      }
    } catch (e) {
      alert("Lỗi hệ thống khi xuất file")
    } finally {
      setActionLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
  }

  const handleViewDetail = (slip) => {
    setSelectedSlip(slip)
    setShowSlipModal(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <CBadge color="dark">Đã Thanh Toán</CBadge>
      case "Approved":
        return <CBadge color="success">Đã Phê Duyệt</CBadge>
      case "Draft":
      default:
        return <CBadge color="warning" className="text-dark">Chờ Duyệt (Draft)</CBadge>
    }
  }

  // Data processing for charts
  const positionDistribution = () => {
    const counts = {}
    reports.forEach(r => {
      counts[r.position] = (counts[r.position] || 0) + (r.totalSalary || 0)
    })
    return {
      labels: Object.keys(counts),
      data: Object.values(counts)
    }
  }

  const chartData = positionDistribution()

  return (
    <div className="d-flex flex-column gap-4" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Page Header */}
      <div className="flex-shrink-0 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Lương & Hoa Hồng Hệ Thống</h3>
          <p className="text-muted mb-0">Cấu hình công thức, tính toán lương nhân sự, thống kê chi phí và theo dõi hoa hồng doanh số.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink
              active={activeTab === "payroll_records"}
              onClick={() => { setActiveTab("payroll_records"); setFilterPosition(""); setFilterStatus(""); }}
              style={{ cursor: "pointer", fontWeight: activeTab === "payroll_records" ? "bold" : "normal" }}
            >
              Bảng Lương Nhân Sự
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === "commission_records"}
              onClick={() => { setActiveTab("commission_records"); setCommPage(1); }}
              style={{ cursor: "pointer", fontWeight: activeTab === "commission_records" ? "bold" : "normal" }}
            >
              Báo Cáo Hoa Hồng
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === "formulas"}
              onClick={() => setActiveTab("formulas")}
              style={{ cursor: "pointer", fontWeight: activeTab === "formulas" ? "bold" : "normal" }}
            >
              Công Thức Lương (Formulas)
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              style={{ cursor: "pointer", fontWeight: activeTab === "analytics" ? "bold" : "normal" }}
            >
              Thống Kê Trực Quan
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      {/* Selected Month Filter (Global for all tabs except Formulas) */}
      {activeTab !== "formulas" && (
        <CCard className="border-0 shadow-sm rounded-4 flex-shrink-0">
          <CCardBody className="p-3">
            <CRow className="align-items-end g-3">
              <CCol md={4} xs={12}>
                <CFormLabel className="small fw-bold mb-1">Chọn Kỳ Lương (Period)</CFormLabel>
                <PeriodPicker
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                />
              </CCol>
              
              {activeTab === "payroll_records" && (
                <>
                  <CCol md={3} xs={6}>
                    <CFormLabel className="small fw-bold mb-1">Vị trí (Position)</CFormLabel>
                    <CFormSelect
                      value={filterPosition}
                      onChange={(e) => setFilterPosition(e.target.value)}
                    >
                      <option value="">Tất cả vị trí</option>
                      <option value="PT">Personal Trainer (PT)</option>
                      <option value="HeadPT">Trưởng Bộ Phận PT (HeadPT)</option>
                      <option value="Sales">Tư Vấn Bán Hàng (Sales)</option>
                      <option value="Receptionist">Lễ Tân (Receptionist)</option>
                      <option value="BranchAdmin">Quản Lý Chi Nhánh (BranchAdmin)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3} xs={6}>
                    <CFormLabel className="small fw-bold mb-1">Trạng thái (Status)</CFormLabel>
                    <CFormSelect
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="Draft">Chờ Duyệt (Draft)</option>
                      <option value="Approved">Đã Duyệt (Approved)</option>
                      <option value="Paid">Đã Thanh Toán (Paid)</option>
                    </CFormSelect>
                  </CCol>
                </>
              )}
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Main Content Area */}
      {activeTab === "payroll_records" && (
        <div className="flex-grow-1 d-flex flex-column gap-3">
          {/* Summary Cards */}
          <PayrollSummaryCards records={reports} />

          {/* Action Toolbar */}
          <CCard className="border-0 shadow-sm rounded-4 flex-shrink-0">
            <CCardBody className="p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted fw-bold">Tính lương bằng công thức:</span>
                <CFormSelect
                  style={{ width: "250px" }}
                  value={selectedFormulaId}
                  onChange={(e) => setSelectedFormulaId(e.target.value)}
                >
                  {formulas.length === 0 && <option value="">Đang tải công thức...</option>}
                  {formulas.map(f => (
                    <option key={f.formulaId || f.id} value={f.formulaId || f.id}>
                      {f.name} {(f.isActive ?? f.active) ? '(Đang Áp Dụng)' : ''}
                    </option>
                  ))}
                </CFormSelect>
                <CButton
                  color="primary"
                  className="fw-bold text-white shadow-sm"
                  onClick={handleCalculatePayroll}
                  disabled={actionLoading}
                >
                  Tính Lương Kỳ Này
                </CButton>
              </div>

              <div>
                <CButton
                  color="dark"
                  variant="outline"
                  className="fw-bold"
                  onClick={handleExportCsv}
                  disabled={actionLoading}
                >
                  Xuất File CSV
                </CButton>
              </div>
            </CCardBody>
          </CCard>

          {/* Calculated Payroll Slip List */}
          <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
            <CCardBody className="p-0 h-100 d-flex flex-column">
              <div className="flex-grow-1 overflow-auto">
                {loading ? (
                  <div className="text-center py-5">Đang tải báo cáo lương...</div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-5 text-muted">Chưa có dữ liệu báo cáo thù lao cho kỳ lương này.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "1200px" }}>
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="py-3 px-4">Nhân Viên</th>
                          <th className="py-3">Mức Lương Cơ Bản</th>
                          <th className="py-3 text-center">Buổi Huấn Luyện</th>
                          <th className="py-3 text-end">Hoa Hồng Lớp Dạy</th>
                          <th className="py-3 text-end">Hoa Hồng Bán Hàng</th>
                          <th className="py-3 text-end">Thưởng KPI</th>
                          <th className="py-3 text-end">Thực Nhận (NET)</th>
                          <th className="py-3 text-center">Trạng Thái</th>
                          <th className="py-3 px-4 text-center" style={{ width: "120px" }}>Chi Tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((slip) => (
                          <tr key={slip.payrollId}>
                            <td className="py-3 px-4">
                              <div className="fw-bold text-dark">{slip.staffName}</div>
                              <small className="text-muted fw-semibold">
                                {slip.position}
                              </small>
                            </td>
                            <td className="py-3">{formatCurrency(slip.baseSalary)}</td>
                            <td className="py-3 text-center fw-semibold">
                              {slip.sessionCount > 0 ? `${slip.sessionCount} lớp` : "-"}
                            </td>
                            <td className="py-3 text-end">
                              {slip.sessionCommission > 0 ? formatCurrency(slip.sessionCommission) : "-"}
                            </td>
                            <td className="py-3 text-end text-indigo fw-semibold">
                              {slip.salesCommission > 0 ? formatCurrency(slip.salesCommission) : "-"}
                            </td>
                            <td className="py-3 text-end text-success fw-semibold">
                              {slip.kpiBonus > 0 ? `+${formatCurrency(slip.kpiBonus)}` : "-"}
                            </td>
                            <td className="py-3 text-end text-primary fw-bold">{formatCurrency(slip.totalSalary)}</td>
                            <td className="py-3 text-center">
                              {getStatusBadge(slip.status)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <CButton
                                color="primary"
                                variant="outline"
                                size="sm"
                                className="fw-bold"
                                onClick={() => handleViewDetail(slip)}
                              >
                                Xem Phiếu
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
        </div>
      )}

      {activeTab === "commission_records" && (
        <div className="flex-grow-1 d-flex flex-column gap-3">
          <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
            <CCardBody className="p-0 h-100 d-flex flex-column">
              <div className="flex-grow-1 overflow-auto">
                {loading ? (
                  <div className="text-center py-5">Đang tải lịch sử hoa hồng...</div>
                ) : commissions.length === 0 ? (
                  <div className="text-center py-5 text-muted">Chưa có dữ liệu hoa hồng trong kỳ này.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="py-3 px-4">Nhân Viên Bán Hàng</th>
                          <th className="py-3">Hội Viên Đăng Ký</th>
                          <th className="py-3">Gói Tập</th>
                          <th className="py-3 text-center">Tỷ Lệ Trích</th>
                          <th className="py-3 text-end">Tiền Hoa Hồng</th>
                          <th className="py-3 text-center">Trạng Thái</th>
                          <th className="py-3 px-4 text-center">Ngày Kích Hoạt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissions.map((item) => (
                          <tr key={item.commissionId}>
                            <td className="py-3 px-4">
                              <div className="fw-bold text-dark">{item.staffName}</div>
                              <small className="text-muted fw-semibold">{item.staffPosition}</small>
                            </td>
                            <td className="py-3 fw-bold text-dark">{item.memberName}</td>
                            <td className="py-3">{item.packageName}</td>
                            <td className="py-3 text-center fw-semibold text-secondary">{item.percent}%</td>
                            <td className="py-3 text-end text-primary fw-bold">{formatCurrency(item.amount)}</td>
                            <td className="py-3 text-center">
                              <CBadge color="success">Approved</CBadge>
                            </td>
                            <td className="py-3 px-4 text-center text-muted small">
                              {new Date(item.createdAt).toLocaleDateString("vi-VN")} {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Commission Pagination */}
              {commTotalPages > 1 && (
                <div className="d-flex justify-content-end p-3 border-top">
                  <CPagination className="mb-0">
                    <CPaginationItem
                      disabled={commPage === 1}
                      onClick={() => setCommPage(commPage - 1)}
                      style={{ cursor: "pointer" }}
                    >
                      ‹
                    </CPaginationItem>
                    {[...Array(commTotalPages)].map((_, idx) => (
                      <CPaginationItem
                        key={idx}
                        active={commPage === idx + 1}
                        onClick={() => setCommPage(idx + 1)}
                        style={{ cursor: "pointer" }}
                      >
                        {idx + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={commPage === commTotalPages}
                      onClick={() => setCommPage(commPage + 1)}
                      style={{ cursor: "pointer" }}
                    >
                      ›
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </CCardBody>
          </CCard>
        </div>
      )}

      {activeTab === "formulas" && (
        <div className="flex-grow-1 d-flex flex-column overflow-hidden gap-3">
          {/* Formula Toolbar */}
          <div className="flex-shrink-0 d-flex justify-content-end">
            <CButton
              color="primary"
              className="fw-bold text-white shadow-sm"
              onClick={() => setShowFormulaModal(true)}
            >
              + Tạo Công Thức Mới
            </CButton>
          </div>

          {/* Formulas List Grid */}
          <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
            <CCardBody className="p-0 h-100 d-flex flex-column">
              <div className="flex-grow-1 overflow-auto">
                {formulas.length === 0 ? (
                  <div className="text-center py-5 text-muted">Chưa có công thức lương nào được cấu hình.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="py-3 px-4">Tên Công Thức</th>
                          <th className="py-3">Lương Định Mức Mặc Định</th>
                          <th className="py-3">Hoa Hồng Mỗi Buổi (PT)</th>
                          <th className="py-3">Chỉ Tiêu KPI (Buổi)</th>
                          <th className="py-3">Thưởng Đạt KPI</th>
                          <th className="py-3">Trạng Thái</th>
                          <th className="py-3 px-4 text-center" style={{ width: "160px" }}>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulas.map((item) => (
                          <tr key={item.formulaId || item.id}>
                            <td className="py-3 px-4 fw-bold text-dark">{item.name}</td>
                            <td className="py-3">{formatCurrency(item.defaultBaseSalary)}</td>
                            <td className="py-3">{formatCurrency(item.commissionPerSession)}/buổi</td>
                            <td className="py-3">{item.kpiSessionThreshold} buổi dạy</td>
                            <td className="py-3 text-success fw-semibold">+{formatCurrency(item.kpiBonus)}</td>
                            <td className="py-3">
                              {(item.isActive ?? item.active) ? (
                                <CBadge color="success">Đang Áp Dụng</CBadge>
                              ) : (
                                <CBadge color="secondary">Không Hoạt Động</CBadge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {!(item.isActive ?? item.active) && (
                                <CButton
                                  color="warning"
                                  size="sm"
                                  className="fw-bold"
                                  onClick={() => handleActivateFormula(item.formulaId || item.id)}
                                  disabled={actionLoading}
                                >
                                  Kích Hoạt
                                </CButton>
                              )}
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
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="flex-grow-1 overflow-auto">
          {reports.length === 0 ? (
            <div className="text-center py-5 text-muted">Không có dữ liệu thống kê cho kỳ lương này.</div>
          ) : (
            <CRow className="g-3">
              <CCol md={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4">
                  <CCardBody>
                    <h5 className="fw-bold mb-3 text-dark">Phân Bổ Lương Chi Trả Theo Vai Trò</h5>
                    <div style={{ height: "300px", display: "flex", justifyContent: "center" }}>
                      <CChartPie
                        data={{
                          labels: chartData.labels,
                          datasets: [
                            {
                              data: chartData.data,
                              backgroundColor: [
                                "#4f46e5",
                                "#10b981",
                                "#f59e0b",
                                "#3b82f6",
                                "#ec4899"
                              ]
                            }
                          ]
                        }}
                      />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4">
                  <CCardBody>
                    <h5 className="fw-bold mb-3 text-dark">Chi Tiết Quỹ Lương Theo Vai Trò (VND)</h5>
                    <CChartBar
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: "Tổng thù lao chi trả",
                            backgroundColor: "rgba(79, 70, 229, 0.7)",
                            data: chartData.data
                          }
                        ]
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </div>
      )}

      {/* Payslip Modal */}
      <PayslipDetailModal
        slip={selectedSlip}
        visible={showSlipModal}
        onClose={() => setShowSlipModal(false)}
      />

      {/* Formula Creation Modal */}
      <CModal
        visible={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        backdrop="static"
        size="md"
      >
        <CModalHeader className="bg-light">
          <CModalTitle className="fw-bold text-primary">Tạo Công Thức Tính Lương Mới</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 d-flex flex-column gap-3">
          <div>
            <CFormLabel className="fw-bold small mb-1">Tên công thức lương *</CFormLabel>
            <CFormInput
              placeholder="Ví dụ: Công thức PT Cao Cấp 2026"
              value={newFormula.name}
              onChange={(e) => setNewFormula({ ...newFormula, name: e.target.value })}
            />
          </div>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold small mb-1">Mức lương cơ bản mặc định (VND)</CFormLabel>
              <CFormInput
                type="number"
                value={newFormula.defaultBaseSalary}
                onChange={(e) => setNewFormula({ ...newFormula, defaultBaseSalary: Number(e.target.value) })}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold small mb-1">Hoa hồng mỗi lớp (VND)</CFormLabel>
              <CFormInput
                type="number"
                value={newFormula.commissionPerSession}
                onChange={(e) => setNewFormula({ ...newFormula, commissionPerSession: Number(e.target.value) })}
              />
            </CCol>
          </CRow>

          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel className="fw-bold small mb-1">Số lớp tối thiểu nhận KPI</CFormLabel>
              <CFormInput
                type="number"
                value={newFormula.kpiSessionThreshold}
                onChange={(e) => setNewFormula({ ...newFormula, kpiSessionThreshold: Number(e.target.value) })}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="fw-bold small mb-1">Tiền thưởng KPI (VND)</CFormLabel>
              <CFormInput
                type="number"
                value={newFormula.kpiBonus}
                onChange={(e) => setNewFormula({ ...newFormula, kpiBonus: Number(e.target.value) })}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="bg-light">
          <CButton color="secondary" variant="ghost" onClick={() => setShowFormulaModal(false)}>
            Hủy
          </CButton>
          <CButton
            color="primary"
            className="fw-bold text-white shadow-sm"
            onClick={handleCreateFormula}
            disabled={actionLoading}
          >
            Lưu Công Thức
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AdminPayrollPage
