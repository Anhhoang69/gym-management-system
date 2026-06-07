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
  CFormSelect
} from "@coreui/react"
import {
  getPayrollFormulas,
  createPayrollFormula,
  activatePayrollFormula,
  calculatePayroll,
  getPayrollReports,
  exportPayrollCsv
} from "../../../shared/services/payrollService"

function AdminPayrollPage() {
  const [activeTab, setActiveTab] = useState("formulas") // "formulas" or "calculation"
  const [formulas, setFormulas] = useState([])
  const [reports, setReports] = useState([])
  const [selectedFormulaId, setSelectedFormulaId] = useState("")

  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("2026-05")

  // Formula Modal State
  const [showFormulaModal, setShowFormulaModal] = useState(false)
  const [newFormula, setNewFormula] = useState({
    name: "",
    defaultBaseSalary: 50000,
    commissionPerSession: 100000,
    kpiSessionThreshold: 30,
    kpiBonus: 1000000
  })

  // Fetch Formulas
  const fetchFormulas = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  // Fetch Reports
  const fetchReports = async () => {
    setLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await getPayrollReports(month, year)
      setReports(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "formulas") {
      fetchFormulas()
    } else {
      fetchReports()
      // also fetch formulas for dropdown if we haven't
      if (formulas.length === 0) fetchFormulas()
    }
  }, [activeTab, selectedPeriod])

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
          defaultBaseSalary: 50000,
          commissionPerSession: 100000,
          kpiSessionThreshold: 30,
          kpiBonus: 1000000
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
        alert(`Đã tính toán lương PT kỳ ${selectedPeriod} thành công!`)
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

  // Calculate Aggregated Metrics
  const totalPayout = reports.reduce((sum, r) => sum + (r.totalSalary || 0), 0)
  const totalClasses = reports.reduce((sum, r) => sum + (r.sessionCount || r.classesTaught || 0), 0)

  return (
    <div className="d-flex flex-column gap-4" style={{ height: "calc(100vh - 120px)" }}>
      {/* Page Header */}
      <div className="flex-shrink-0 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Công Thức Lương & Báo Cáo</h3>
          <p className="text-muted mb-0">Tạo cấu hình công thức tính lương, tính toán và xem báo cáo thù lao cho PT.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <CNav variant="tabs">
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
              active={activeTab === "calculation"}
              onClick={() => setActiveTab("calculation")}
              style={{ cursor: "pointer", fontWeight: activeTab === "calculation" ? "bold" : "normal" }}
            >
              Tính Lương & Báo Cáo
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      {/* Main Content Area */}
      {activeTab === "formulas" ? (
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
                {loading ? (
                  <div className="text-center py-5">Đang tải danh sách công thức lương...</div>
                ) : formulas.length === 0 ? (
                  <div className="text-center py-5 text-muted">Chưa có công thức lương nào được cấu hình.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="py-3 px-4">Tên Công Thức</th>
                          <th className="py-3">Lương Giờ Cơ Bản</th>
                          <th className="py-3">Hoa Hồng Mỗi Buổi</th>
                          <th className="py-3">Chỉ Tiêu KPI</th>
                          <th className="py-3">Thưởng KPI</th>
                          <th className="py-3">Trạng Thái</th>
                          <th className="py-3 px-4 text-center" style={{ width: "160px" }}>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulas.map((item) => (
                          <tr key={item.formulaId || item.id}>
                            <td className="py-3 px-4 fw-bold text-dark">{item.name}</td>
                            <td className="py-3">{formatCurrency(item.defaultBaseSalary || item.baseRate)}/giờ</td>
                            <td className="py-3">{formatCurrency(item.commissionPerSession || item.classCommission)}/buổi</td>
                            <td className="py-3">{item.kpiSessionThreshold || item.kpiBonusThreshold} buổi dạy</td>
                            <td className="py-3 text-success fw-semibold">+{formatCurrency(item.kpiBonus || item.kpiBonusAmount)}</td>
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
      ) : (
        <div className="flex-grow-1 d-flex flex-column overflow-hidden gap-3">
          {/* Quick Metrics Cards */}
          <div className="flex-shrink-0">
            <CRow className="g-3">
              <CCol md={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 bg-primary text-white">
                  <CCardBody className="p-3">
                    <div className="small text-white-50">Tổng Chi Trả Kỳ Lương ({selectedPeriod})</div>
                    <div className="fs-3 fw-bold mt-1">{formatCurrency(totalPayout)}</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 bg-success text-white">
                  <CCardBody className="p-3">
                    <div className="small text-white-50">Tổng Số Buổi Dạy (PT Classes)</div>
                    <div className="fs-3 fw-bold mt-1">{totalClasses} Buổi</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>

          {/* Report Filter & Actions Toolbelt */}
          <CCard className="border-0 shadow-sm rounded-4 flex-shrink-0">
            <CCardBody className="p-3">
              <CRow className="align-items-end g-3">
                <CCol md={3} xs={12}>
                  <CFormLabel className="small fw-bold mb-1">Chọn Kỳ Lương (Period)</CFormLabel>
                  <CFormSelect
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="2026-05">Tháng 05/2026 (2026-05)</option>
                    <option value="2026-06">Tháng 06/2026 (2026-06)</option>
                    <option value="2026-07">Tháng 07/2026 (2026-07)</option>
                  </CFormSelect>
                </CCol>
                
                <CCol md={4} xs={12}>
                  <CFormLabel className="small fw-bold mb-1">Công Thức Tính Lương</CFormLabel>
                  <CFormSelect
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
                </CCol>

                <CCol md={5} xs={12} className="d-flex flex-wrap gap-2 justify-content-md-end">
                  <CButton
                    color="primary"
                    variant="outline"
                    className="fw-bold"
                    onClick={handleCalculatePayroll}
                    disabled={actionLoading}
                  >
                    Tính Lương Kỳ Này
                  </CButton>
                  <CButton
                    color="dark"
                    variant="outline"
                    className="fw-bold"
                    onClick={handleExportCsv}
                    disabled={actionLoading}
                  >
                    Xuất File CSV
                  </CButton>
                </CCol>
              </CRow>
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
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "1000px" }}>
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="py-3 px-4">Tên HLV (PT)</th>
                          <th className="py-3">Lương Cơ Bản</th>
                          <th className="py-3">Số Lớp Dạy</th>
                          <th className="py-3">Hoa Hồng Dạy</th>
                          <th className="py-3">Thưởng KPI</th>
                          <th className="py-3">Tổng Nhận</th>
                          <th className="py-3 px-4 text-center">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((slip) => (
                          <tr key={slip.payrollId}>
                            <td className="py-3 px-4">
                              <div className="fw-bold text-dark">{slip.staffName || slip.ptName}</div>
                              <small className="text-muted" style={{ fontSize: "11px" }}>
                                {slip.position || slip.ptEmail || 'PT'}
                              </small>
                            </td>
                            <td className="py-3">{formatCurrency(slip.baseSalary)}</td>
                            <td className="py-3 fw-semibold">{slip.sessionCount || slip.classesTaught} lớp</td>
                            <td className="py-3">{formatCurrency(slip.sessionCommission || slip.classCommissionEarned)}</td>
                            <td className="py-3 text-success fw-semibold">+{formatCurrency(slip.kpiBonus)}</td>
                            <td className="py-3 text-primary fw-bold">{formatCurrency(slip.totalSalary)}</td>
                            <td className="py-3 px-4 text-center">
                              {slip.status === "Approved" ? (
                                <CBadge color="success">Đã Phê Duyệt</CBadge>
                              ) : (
                                <CBadge color="warning" className="text-dark">Chờ Duyệt</CBadge>
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
              <CFormLabel className="fw-bold small mb-1">Mức lương cơ bản mỗi giờ (VND)</CFormLabel>
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

