import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormSelect,
  CBadge,
  CButton,
  CFormLabel
} from "@coreui/react"
import {
  getPayrollFormulas,
  calculatePayroll,
  getPayrollReports,
  approvePayrollPeriod,
  exportPayrollCsv
} from "../../../shared/services/payrollService"

function OwnerPayrollPage() {
  const [formulas, setFormulas] = useState([])
  const [reports, setReports] = useState([])
  const [selectedFormulaId, setSelectedFormulaId] = useState("")
  
  const [selectedPeriod, setSelectedPeriod] = useState("2026-05")
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch Formulas for Dropdown
  const fetchFormulas = async () => {
    try {
      const res = await getPayrollFormulas()
      const data = res.data || []
      setFormulas(data)
      // Auto select active formula if available
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
      const res = await getPayrollReports(month, year)
      setReports(res.data || [])
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
    fetchReports()
  }, [selectedPeriod])

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

  // Handle Payroll Period Approval
  const handleApprovePeriod = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn PHÊ DUYỆT toàn bộ bảng lương kỳ ${selectedPeriod} không? Hành động này sẽ khóa và chuyển trạng thái chi trả thành ĐÃ PHÊ DUYỆT.`)) return
    setActionLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      // GymOwner might pass their branchId if needed, here we just pass undefined
      const res = await approvePayrollPeriod(month, year)
      if (res.success) {
        alert(`Kỳ lương ${selectedPeriod} đã được phê duyệt thành công!`)
        fetchReports()
      } else {
        alert(res.message || "Lỗi phê duyệt kỳ lương")
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
          <h3 className="fw-bold mb-1">Tính & Duyệt Payroll</h3>
          <p className="text-muted mb-0">Tính lương cho PT dựa trên công thức và phê duyệt để chi trả cho từng kỳ.</p>
        </div>
      </div>

      {/* Main Content Area */}
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
                  color="success"
                  className="fw-bold text-white"
                  onClick={handleApprovePeriod}
                  disabled={actionLoading}
                >
                  Duyệt Bảng Lương
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
                <div className="text-center py-5">Đang tải bảng lương tính toán...</div>
              ) : reports.length === 0 ? (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu tính thù lao cho kỳ lương này.</div>
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
                              <CBadge color="warning" className="text-dark">Chờ Duyệt (Draft)</CBadge>
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
    </div>
  )
}

export default OwnerPayrollPage
