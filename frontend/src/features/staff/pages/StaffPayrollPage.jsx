import React, { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CButton,
  CFormLabel
} from "@coreui/react"
import { getMyPayroll } from "../../../shared/services/payrollService"
import PeriodPicker from "../../../shared/components/payroll/PeriodPicker"
import PayslipDetailModal from "../../../shared/components/payroll/PayslipDetailModal"

function StaffPayrollPage() {
  const [slips, setSlips] = useState([])
  const [loading, setLoading] = useState(false)
  
  const currentDate = new Date()
  const defaultPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod)
  
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <CBadge color="dark">Đã Thanh Toán</CBadge>
      case "Approved":
        return <CBadge color="success">Đã Phê Duyệt</CBadge>
      case "Draft":
      default:
        return <CBadge color="warning" className="text-dark">Chờ Phê Duyệt</CBadge>
    }
  }

  return (
    <div className="d-flex flex-column gap-4" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div>
        <h3 className="fw-bold mb-1">Lương & Thu Nhập Cá Nhân</h3>
        <p className="text-muted mb-0">Theo dõi chi tiết các khoản lương cố định và hoa hồng doanh số tích lũy hàng tháng.</p>
      </div>

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
                      <th className="py-3">Hoa Hồng Doanh Số</th>
                      <th className="py-3 text-end">Tổng Thù Lao (NET)</th>
                      <th className="py-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-4 text-center" style={{ width: "120px" }}>Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slips.map((slip) => (
                      <tr key={slip.payrollId}>
                        <td className="py-3 px-4 fw-bold text-dark">{slip.periodMonth}/{slip.periodYear}</td>
                        <td className="py-3">{formatCurrency(slip.baseSalary)}</td>
                        <td className="py-3 text-success fw-semibold">
                          {slip.salesCommission > 0 ? `+${formatCurrency(slip.salesCommission)}` : "-"}
                        </td>
                        <td className="py-3 text-end text-primary fw-bold">
                          {formatCurrency(slip.totalSalary)}
                        </td>
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

      <PayslipDetailModal
        slip={selectedSlip}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default StaffPayrollPage
