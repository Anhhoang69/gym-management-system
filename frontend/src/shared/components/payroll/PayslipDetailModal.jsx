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
import { FileText, Clock, BookOpen, Award, CheckCircle, DollarSign } from "lucide-react"

function PayslipDetailModal({ slip, visible, onClose }) {
    if (!slip) return null

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
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

    const isPT = slip.position === "PT" || slip.position === "HeadPT" || (slip.sessionCount && slip.sessionCount > 0)
    const isSales = slip.position === "Sales" || (slip.salesCommission && slip.salesCommission > 0)

    return (
        <CModal
            visible={visible}
            onClose={onClose}
            size="lg"
            backdrop="static"
        >
            <CModalHeader className="bg-light border-0">
                <CModalTitle className="fw-bold text-primary d-flex align-items-center gap-2">
                    <FileText size={20} /> Phiếu Lương Chi Tiết
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="bg-white p-4 rounded-4 shadow-sm border" style={{ color: "#333" }}>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                        <div>
                            <h4 className="fw-extrabold text-primary mb-1">EnerGym Fitness & Yoga</h4>
                            <p className="text-muted small mb-0">Hệ thống quản lý phòng gym & thù lao nhân sự</p>
                        </div>
                        <div className="text-end">
                            <h5 className="fw-bold text-dark mb-1">Kỳ Lương: {slip.periodMonth}/{slip.periodYear}</h5>
                            <small className="text-muted">Mã phiếu: #{slip.payrollId?.substring(0, 8) || slip.id?.substring(0, 8)}</small>
                        </div>
                    </div>

                    {/* Employee info */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted text-uppercase small mb-2">Thông tin người nhận</h6>
                        <div className="fw-bold text-dark fs-5">{slip.staffName}</div>
                        <div className="text-muted fw-semibold">{slip.position}</div>
                    </div>

                    {/* Breakdown table */}
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
                                        <small className="text-muted">Lương cơ bản cố định hàng tháng</small>
                                    </td>
                                    <td className="py-3 text-center fw-bold">-</td>
                                    <td className="py-3 text-end">-</td>
                                    <td className="py-3 text-end fw-bold">{formatCurrency(slip.baseSalary)}</td>
                                </tr>

                                {/* PT Session Commission */}
                                {isPT && (
                                    <tr>
                                        <td className="py-3">
                                            <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                                                <BookOpen size={16} className="text-success" /> Thù lao đứng lớp (HLV)
                                            </div>
                                            <small className="text-muted">Tiền đứng lớp huấn luyện cá nhân & lớp nhóm</small>
                                        </td>
                                        <td className="py-3 text-center fw-bold">{slip.sessionCount || 0}</td>
                                        <td className="py-3 text-end">
                                            {slip.sessionCount > 0 
                                                ? formatCurrency((slip.sessionCommission || 0) / slip.sessionCount) 
                                                : "-"
                                            }
                                        </td>
                                        <td className="py-3 text-end fw-bold">{formatCurrency(slip.sessionCommission || 0)}</td>
                                    </tr>
                                )}

                                {/* PT KPI Bonus */}
                                {isPT && slip.kpiBonus > 0 && (
                                    <tr>
                                        <td className="py-3">
                                            <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                                                <Award size={16} className="text-warning" /> Thưởng chỉ tiêu KPI lớp dạy
                                            </div>
                                            <small className="text-muted">Đạt định mức buổi dạy tối thiểu trong tháng</small>
                                        </td>
                                        <td className="py-3 text-center fw-bold">1</td>
                                        <td className="py-3 text-end">{formatCurrency(slip.kpiBonus)}</td>
                                        <td className="py-3 text-end fw-bold text-success">+{formatCurrency(slip.kpiBonus)}</td>
                                    </tr>
                                )}

                                {/* Sales Commission */}
                                {isSales && (
                                    <tr>
                                        <td className="py-3">
                                            <div className="fw-bold d-flex align-items-center gap-2 text-dark">
                                                <DollarSign size={16} className="text-indigo" /> Hoa hồng doanh số bán hàng
                                            </div>
                                            <small className="text-muted">Hoa hồng tích lũy từ các hợp đồng hội viên mới</small>
                                        </td>
                                        <td className="py-3 text-center fw-bold">-</td>
                                        <td className="py-3 text-end">-</td>
                                        <td className="py-3 text-end fw-bold text-indigo">{formatCurrency(slip.salesCommission || 0)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Payout */}
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-4">
                        <div className="fw-bold fs-5 text-dark">Tổng thù lao thực nhận (NET):</div>
                        <div className="fw-extrabold fs-4 text-primary">{formatCurrency(slip.totalSalary)}</div>
                    </div>

                    {/* Footer / Status */}
                    <div className="d-flex justify-content-between pt-3 border-top align-items-center">
                        <div>
                            <span className="small text-muted me-2">Trạng thái phiếu:</span>
                            {getStatusBadge(slip.status)}
                        </div>
                        <div className="small text-muted">
                            {slip.calculatedAt && `Tính ngày: ${new Date(slip.calculatedAt).toLocaleDateString("vi-VN")}`}
                        </div>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter className="bg-light border-0">
                <CButton color="secondary" onClick={onClose}>
                    Đóng
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default PayslipDetailModal
