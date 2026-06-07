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
  CFormSelect,
  CFormLabel
} from "@coreui/react"
import { DollarSign, Award, BookOpen, Clock, FileText, CheckCircle } from "lucide-react"
import { getMyPayroll } from "../../../shared/services/payrollService"

function PtPayrollPage() {
  const [slips, setSlips] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("2026-05")
  
  // Detail Modal State
  const [selectedSlip, setSelectedSlip] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchMyPayroll = async () => {
    setLoading(true)
    try {
      const [yearStr, monthStr] = selectedPeriod.split("-")
      const month = parseInt(monthStr, 10)
      const year = parseInt(yearStr, 10)
      const res = await getMyPayroll(month, year)
      setSlips(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyPayroll()
  }, [selectedPeriod])

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
  }

  const handleViewDetail = (slip) => {
    setSelectedSlip(slip)
    setShowModal(true)
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div>
        <h3 className="fw-bold mb-1">Lương & Thù Lao Cá Nhân</h3>
        <p className="text-muted mb-0">Theo dõi chi tiết các khoản thù lao nhận được theo số giờ làm việc và số lớp huấn luyện.</p>
      </div>

      <CCard className="border-0 shadow-sm rounded-4 flex-shrink-0">
        <CCardBody className="p-3">
          <CRow className="align-items-end g-3">
            <CCol md={4} xs={12}>
              <CFormLabel className="small fw-bold mb-1">Chọn Kỳ Lương (Period)</CFormLabel>
              <CFormSelect
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="2026-05">Tháng 05/2026</option>
                <option value="2026-06">Tháng 06/2026</option>
                <option value="2026-07">Tháng 07/2026</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Main List */}
      <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
        <CCardBody className="p-0 d-flex flex-column h-100">
          <div className="flex-grow-1 overflow-auto">
            {loading ? (
              <div className="text-center py-5">Đang tải lịch sử nhận lương...</div>
            ) : slips.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Chưa có dữ liệu thù lao được ghi nhận cho kỳ này.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th className="py-3 px-4">Kỳ Lương (Period)</th>
                      <th className="py-3">Lương Cơ Bản</th>
                      <th className="py-3">Số Lớp Đã Dạy</th>
                      <th className="py-3 text-end">Tổng Thù Lao</th>
                      <th className="py-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-4 text-center" style={{ width: "120px" }}>Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slips.map((slip) => (
                      <tr key={slip.payrollId}>
                        <td className="py-3 px-4 fw-bold text-dark">{slip.periodMonth}/{slip.periodYear}</td>
                        <td className="py-3">{formatCurrency(slip.baseSalary)}</td>
                        <td className="py-3">{slip.sessionCount} lớp</td>
                        <td className="py-3 text-end text-primary fw-bold">
                          {formatCurrency(slip.totalSalary)}
                        </td>
                        <td className="py-3 text-center">
                          {slip.status === "Approved" ? (
                            <CBadge color="success">Đã Thanh Toán</CBadge>
                          ) : (
                            <CBadge color="warning" className="text-dark">Chờ Phê Duyệt</CBadge>
                          )}
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

      {/* Premium Payslip Invoice Modal */}
      {selectedSlip && (
        <CModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
          backdrop="static"
        >
          <CModalHeader className="bg-light border-0">
            <CModalTitle className="fw-bold text-primary d-flex align-items-center gap-2">
              <FileText size={20} /> Phiếu Lương Chi Tiết
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="p-4" style={{ background: "var(--bg-third)" }}>
            {/* Invoice Slip Layout */}
            <div className="bg-white p-4 rounded-4 shadow-sm border" style={{ color: "#333" }}>
              {/* Slip Header */}
              <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                <div>
                  <h4 className="fw-extrabold text-primary mb-1">EnerGym Fitness & Yoga</h4>
                  <p className="text-muted small mb-0">Hệ thống quản lý phòng gym & thù lao HLV</p>
                </div>
                <div className="text-end">
                  <h5 className="fw-bold text-dark mb-1">Kỳ Lương: {selectedSlip.periodMonth}/{selectedSlip.periodYear}</h5>
                  <small className="text-muted">Mã phiếu: #{selectedSlip.payrollId.substring(0, 8)}</small>
                </div>
              </div>

              {/* PT Details */}
              <div className="mb-4">
                <h6 className="fw-bold text-muted text-uppercase small mb-2">Thông tin người nhận</h6>
                <div className="fw-bold text-dark fs-5">{selectedSlip.staffName}</div>
                <div className="text-muted">{selectedSlip.position}</div>
              </div>

              {/* Items Breakdown */}
              <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2">Mô tả khoản thu nhập</th>
                      <th className="py-2 text-center" style={{ width: "100px" }}>Số lượng</th>
                      <th className="py-2 text-end" style={{ width: "180px" }}>Đơn giá</th>
                      <th className="py-2 text-end" style={{ width: "200px" }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Base Salary */}
                    <tr>
                      <td className="py-3">
                        <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                          <Clock size={16} className="text-primary" /> Lương cơ bản
                        </div>
                        <small className="text-muted">Lương cơ bản theo mức định mức cố định</small>
                      </td>
                      <td className="py-3 text-center fw-bold">-</td>
                      <td className="py-3 text-end">-</td>
                      <td className="py-3 text-end fw-bold">{formatCurrency(selectedSlip.baseSalary)}</td>
                    </tr>
                    {/* Class Commissions */}
                    <tr>
                      <td className="py-3">
                        <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                          <BookOpen size={16} className="text-success" /> Hoa hồng lớp huấn luyện cá nhân (PT)
                        </div>
                        <small className="text-muted">Tiền hoa hồng tính theo số buổi dạy thực tế</small>
                      </td>
                      <td className="py-3 text-center fw-bold">{selectedSlip.sessionCount}</td>
                      <td className="py-3 text-end">{formatCurrency(selectedSlip.sessionCommission / (selectedSlip.sessionCount || 1))}</td>
                      <td className="py-3 text-end fw-bold">{formatCurrency(selectedSlip.sessionCommission)}</td>
                    </tr>
                    {/* KPI Bonus */}
                    {selectedSlip.kpiBonus > 0 && (
                      <tr>
                        <td className="py-3">
                          <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                            <Award size={16} className="text-warning" /> Thưởng đạt chỉ tiêu KPI buổi dạy
                          </div>
                          <small className="text-muted">Đạt mốc lớp dạy tối thiểu theo công thức</small>
                        </td>
                        <td className="py-3 text-center fw-bold">1</td>
                        <td className="py-3 text-end">{formatCurrency(selectedSlip.kpiBonus)}</td>
                        <td className="py-3 text-end fw-bold text-success">+{formatCurrency(selectedSlip.kpiBonus)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Payout */}
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-4">
                <div className="fw-bold fs-5 text-dark">Tổng thù lao thực nhận (NET):</div>
                <div className="fw-extrabold fs-4 text-primary">{formatCurrency(selectedSlip.totalSalary)}</div>
              </div>

              {/* Signatures / Approval Details */}
              <div className="d-flex justify-content-between pt-3 border-top">
                <div>
                  <div className="small text-muted">Trạng thái phiếu:</div>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    {selectedSlip.status === "Approved" ? (
                      <>
                        <CheckCircle size={16} className="text-success" />
                        <span className="fw-bold text-success">Đã phê duyệt & chi trả</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} className="text-warning" />
                        <span className="fw-bold text-warning">Đang chờ đối soát duyệt</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CModalBody>
          <CModalFooter className="bg-light border-0">
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Đóng Phiếu
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default PtPayrollPage
