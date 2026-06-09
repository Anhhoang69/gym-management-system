import React from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge
} from "@coreui/react"
import { FileText, Printer, ShieldCheck } from "lucide-react"
import moment from "moment"

function PayslipDetailModal({ slip, visible, onClose }) {
  if (!slip) return null

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <CBadge color="success">Đã thanh toán</CBadge>
      case "Approved":
        return <CBadge color="primary">Đã phê duyệt</CBadge>
      case "Draft":
      default:
        return <CBadge color="warning" className="text-dark">Chờ duyệt (Draft)</CBadge>
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const isPT = slip.position === "PT" || slip.position === "HeadPT" || (slip.sessionCount && slip.sessionCount > 0)
  const isSales = slip.position === "Sales" || (slip.salesCommission && slip.salesCommission > 0)

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center" scrollable>
      <CModalHeader closeButton className="border-0 pb-0 bg-light">
        <CModalTitle className="fw-bold fs-5 d-flex align-items-center gap-2 text-dark">
          <FileText className="text-warning" size={20} />
          Chi Tiết Phiếu Lương #{slip.payrollId?.slice(-10).toUpperCase() || slip.id?.slice(-10).toUpperCase()}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light p-4">
        {/* Paper Payslip Sheet */}
        <div className="bg-white p-5 rounded-3 shadow-sm border mx-auto text-dark position-relative" style={{
          maxWidth: "720px",
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1.6,
          fontSize: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}>
          {/* National Motto / Header */}
          <div className="text-center mb-4">
            <h5 className="fw-bold mb-1" style={{ letterSpacing: "0.5px" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
            <div className="fw-semibold small mb-2">Độc lập - Tự do - Hạnh phúc</div>
            <div style={{ width: "160px", borderBottom: "1.5px solid #000", margin: "0 auto 20px" }}></div>
          </div>

          {/* Payslip Title */}
          <div className="text-center mb-5">
            <h4 className="fw-bold mb-1 text-uppercase" style={{ letterSpacing: "1px", color: "#111" }}>Phiếu Thanh Toán Lương & Thù Lao</h4>
            <div className="text-muted small">Kỳ lương: Tháng {slip.periodMonth || moment(slip.calculatedAt).format("MM")}/{slip.periodYear || moment(slip.calculatedAt).format("YYYY")}</div>
            <div className="text-muted small">Mã phiếu: #{slip.payrollId?.slice(-10).toUpperCase() || slip.id?.slice(-10).toUpperCase()}</div>
            <div className="mt-2">{getStatusBadge(slip.status)}</div>
          </div>

          {/* EMPLOYEE INFO */}
          <div className="mb-4">
            <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>THÔNG TIN CHI TIẾT NHÂN SỰ</h6>
            <div className="row g-2 ps-2">
              <div className="col-md-6"><span className="fw-semibold">Họ và tên:</span> {slip.staffName}</div>
              <div className="col-md-6"><span className="fw-semibold">Vị trí / Chức vụ:</span> {slip.position}</div>
              <div className="col-md-6">
                <span className="fw-semibold">Thời gian lập phiếu:</span> {slip.calculatedAt ? moment(slip.calculatedAt).format("DD/MM/YYYY HH:mm") : "-"}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Đơn vị quản lý:</span> Hệ thống phòng tập EnerGym
              </div>
            </div>
          </div>

          {/* DETAILS TABLE */}
          <div className="mb-4">
            <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>CHI TIẾT CÁC KHOẢN THU NHẬP</h6>
            <table className="table table-bordered mt-2 text-center" style={{ fontSize: "14px" }}>
              <thead>
                <tr className="table-light">
                  <th style={{ width: "60px" }}>STT</th>
                  <th className="text-start">Khoản mục thu nhập / Diễn giải</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. Base Salary */}
                <tr>
                  <td>1</td>
                  <td className="text-start">
                    <div className="fw-bold">Lương cơ bản định mức</div>
                    <div className="text-muted small">Lương cơ bản cố định hàng tháng theo vai trò</div>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td className="text-end fw-semibold">{formatCurrency(slip.baseSalary)}</td>
                </tr>

                {/* 2. PT Sessions */}
                {isPT && slip.sessionCount > 0 && (
                  <tr>
                    <td>2</td>
                    <td className="text-start">
                      <div className="fw-bold">Thù lao đứng lớp huấn luyện cá nhân</div>
                      <div className="text-muted small">Tính theo số buổi lớp dạy thực tế trong kỳ lương</div>
                    </td>
                    <td>{slip.sessionCount} lớp</td>
                    <td>{formatCurrency((slip.sessionCommission || 0) / slip.sessionCount)}</td>
                    <td className="text-end fw-semibold">{formatCurrency(slip.sessionCommission)}</td>
                  </tr>
                )}

                {/* 3. Sales Commission */}
                {isSales && slip.salesCommission > 0 && (
                  <tr>
                    <td>{isPT ? 3 : 2}</td>
                    <td className="text-start">
                      <div className="fw-bold">Hoa hồng doanh số bán hàng</div>
                      <div className="text-muted small">Trích lũy từ doanh thu các hợp đồng hội viên mới</div>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td className="text-end fw-semibold text-indigo">{formatCurrency(slip.salesCommission)}</td>
                  </tr>
                )}

                {/* 4. KPI Bonus */}
                {isPT && slip.kpiBonus > 0 && (
                  <tr>
                    <td>{isSales ? 4 : 3}</td>
                    <td className="text-start">
                      <div className="fw-bold">Thưởng đạt chỉ tiêu KPI huấn luyện</div>
                      <div className="text-muted small">Đạt số buổi tối thiểu theo quy định</div>
                    </td>
                    <td>1</td>
                    <td>{formatCurrency(slip.kpiBonus)}</td>
                    <td className="text-end fw-semibold text-success">+{formatCurrency(slip.kpiBonus)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Summary Section */}
            <div className="d-flex flex-column align-items-end mt-3 ps-5">
              <div className="w-100" style={{ maxWidth: "350px" }}>
                <div className="d-flex justify-content-between border-top pt-2">
                  <span className="text-dark fw-bold">Tổng thu nhập thực nhận (NET):</span>
                  <span className="text-primary fw-bold fs-5">{formatCurrency(slip.totalSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature & Stamp Section */}
          <div className="row mt-5 pt-3 g-4 text-center">
            {/* Buyer/Employee */}
            <div className="col-6">
              <div className="fw-bold text-uppercase">NGƯỜI NHẬN LƯƠNG</div>
              <div className="text-muted small mb-4">(Ký, ghi rõ họ tên)</div>
              <div className="text-muted mt-5 pt-3 small" style={{ fontStyle: "italic" }}>
                Đã xác nhận điện tử
              </div>
            </div>

            {/* Vendor Seal / Accountant */}
            <div className="col-6 position-relative">
              <div className="fw-bold text-uppercase">NGƯỜI LẬP BIỂU</div>
              <div className="text-muted small mb-4">(Bộ phận kế toán & Ký số)</div>

              {/* Digital Stamp */}
              {(slip.status === 'Paid' || slip.status === 'Approved') && (
                <div className="position-absolute start-50 top-50 translate-middle" style={{
                  border: "3px double #d9534f",
                  color: "#d9534f",
                  borderRadius: "50%",
                  width: "130px",
                  height: "130px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "11px",
                  transform: "rotate(-12deg) translate(-25px, 5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 0 5px rgba(217, 83, 79, 0.2)",
                  zIndex: 2,
                  pointerEvents: "none",
                  fontFamily: "monospace"
                }}>
                  <span style={{ fontSize: "9px" }}>ENERGYM FITNESS</span>
                  <span className="border-top border-bottom py-0.5 my-0.5 fw-bold" style={{ borderColor: "#d9534f" }}>
                    {slip.status === 'Paid' ? 'ĐÃ CHI TRẢ' : 'ĐÃ PHÊ DUYỆT'}
                  </span>
                  <span>{moment(slip.calculatedAt).format("DD/MM/YYYY")}</span>
                </div>
              )}

              <div className="text-success d-flex flex-column align-items-center justify-content-center mt-5 pt-3" style={{ minHeight: "40px" }}>
                {(slip.status === 'Paid' || slip.status === 'Approved') && (
                  <>
                    <ShieldCheck size={24} className="text-success mb-1" />
                    <span className="fw-bold small" style={{ fontSize: "10px" }}>PHIẾU LƯƠNG HỢP LỆ</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CModalBody>

      <CModalFooter className="border-0 bg-light">
        <CButton color="primary" className="px-4 fw-bold shadow-sm text-white" onClick={handlePrint}>
          <Printer size={16} className="me-1" /> In Phiếu Lương
        </CButton>
        <CButton color="secondary" variant="outline" onClick={onClose} className="px-4 fw-bold bg-white">
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PayslipDetailModal
