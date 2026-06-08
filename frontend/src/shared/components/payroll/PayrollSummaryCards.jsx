import React, { useMemo } from "react"
import { CRow, CCol, CCard, CCardBody } from "@coreui/react"
import { Users, CreditCard, Clock, CheckCircle } from "lucide-react"

function PayrollSummaryCards({ records }) {
    const metrics = useMemo(() => {
        const totalStaff = records.length
        const totalSalary = records.reduce((sum, r) => sum + (r.totalSalary || 0), 0)
        const draftCount = records.filter((r) => r.status === "Draft").length
        const approvedCount = records.filter((r) => r.status === "Approved").length
        const paidCount = records.filter((r) => r.status === "Paid").length

        return {
            totalStaff,
            totalSalary,
            draftCount,
            approvedCount,
            paidCount
        }
    }, [records])

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
    }

    return (
        <CRow className="g-3">
            <CCol md={3} sm={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #4f46e5" }}>
                    <CCardBody className="d-flex align-items-center gap-3 py-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                            <Users size={22} />
                        </div>
                        <div>
                            <small className="text-muted fw-bold">Tổng Nhân Viên</small>
                            <h4 className="fw-extrabold mb-0 mt-1" style={{ color: "#312e81" }}>{metrics.totalStaff} người</h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol md={3} sm={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #10b981" }}>
                    <CCardBody className="d-flex align-items-center gap-3 py-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: "#d1fae5", color: "#10b981" }}>
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <small className="text-muted fw-bold">Tổng Chi Trả</small>
                            <h4 className="fw-extrabold mb-0 mt-1" style={{ color: "#065f46" }}>{formatCurrency(metrics.totalSalary)}</h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol md={3} sm={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #f59e0b" }}>
                    <CCardBody className="d-flex align-items-center gap-3 py-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: "#fef3c7", color: "#f59e0b" }}>
                            <Clock size={22} />
                        </div>
                        <div>
                            <small className="text-muted fw-bold">Chờ Duyệt (Draft)</small>
                            <h4 className="fw-extrabold mb-0 mt-1" style={{ color: "#92400e" }}>{metrics.draftCount} phiếu</h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol md={3} sm={6} xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #3b82f6" }}>
                    <CCardBody className="d-flex align-items-center gap-3 py-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: "#dbeafe", color: "#3b82f6" }}>
                            <CheckCircle size={22} />
                        </div>
                        <div>
                            <small className="text-muted fw-bold">Đã Duyệt / Thanh Toán</small>
                            <h4 className="fw-extrabold mb-0 mt-1" style={{ color: "#1e40af" }}>
                                {metrics.approvedCount + metrics.paidCount} phiếu
                            </h4>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default PayrollSummaryCards
