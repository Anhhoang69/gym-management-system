import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput
} from "@coreui/react"
import {
  getPayrollFormulas,
  createPayrollFormula,
  activatePayrollFormula
} from "../../../shared/services/payrollService"

function AdminPayrollPage() {
  const [formulas, setFormulas] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

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
      setFormulas(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFormulas()
  }, [])

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

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ height: "calc(100vh - 120px)" }}>
      {/* Page Header */}
      <div className="flex-shrink-0 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-1">Quản Lý Công Thức Lương</h3>
          <p className="text-muted mb-0">Tạo và cấu hình các công thức tính lương áp dụng cho toàn hệ thống.</p>
        </div>
      </div>

      {/* Main Content Area */}
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

