import { useState, useEffect } from "react"
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CBadge,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CPagination,
    CPaginationItem
} from "@coreui/react"
import { DollarSign, BookOpen, Award, TrendingUp } from "lucide-react"
import moment from "moment"
import { getMyPayroll } from "../../../shared/services/payrollService"
import { getClasses } from "../../super-admin/services/classService"
import PeriodPicker from "../../../shared/components/payroll/PeriodPicker"

function PtCommissionPage() {
    const [classes, setClasses] = useState([])
    const [allCompletedClasses, setAllCompletedClasses] = useState([])
    const [payrollSlip, setPayrollSlip] = useState(null)
    const [loading, setLoading] = useState(false)

    const currentDate = new Date()
    const defaultPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
    const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const pageSize = 10

    const fetchCommissionData = async () => {
        setLoading(true)
        try {
            const [yearStr, monthStr] = selectedPeriod.split("-")
            const month = parseInt(monthStr, 10)
            const year = parseInt(yearStr, 10)

            // 1. Fetch PT's payroll record for this period to get sessionCommission and kpiBonus
            const payrollRes = await getMyPayroll(month, year)
            const slip = payrollRes.data && payrollRes.data.length > 0 ? payrollRes.data[0] : null
            setPayrollSlip(slip)

            // 2. Fetch completed classes taught by this PT in this month
            // Calculate start and end dates of the selected month
            const startDate = `${year}-${String(month).padStart(2, "0")}-01`
            // Handle last day of month
            const lastDay = new Date(year, month, 0).getDate()
            const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

            // Fetch ALL completed classes for this month to calculate statistics
            const allRes = await getClasses({
                startDate,
                endDate,
                status: "Completed"
            })
            setAllCompletedClasses(allRes || [])

            // Fetch PAGINATED completed classes for display in the table
            const pagedRes = await getClasses({
                startDate,
                endDate,
                status: "Completed",
                page: currentPage,
                pageSize: pageSize
            })
            setClasses(pagedRes?.items || [])
            setTotalPages(pagedRes?.totalPages || 1)
        } catch (error) {
            console.error("Failed to load PT commission statistics", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCommissionData()
    }, [selectedPeriod, currentPage])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
    }

    // Calculations
    const sessionRate = payrollSlip && payrollSlip.sessionCount > 0
        ? Math.round((payrollSlip.sessionCommission || 0) / payrollSlip.sessionCount)
        : 170000 // Default fallback unit commission per session if payroll not computed yet

    const totalSessionsTaught = allCompletedClasses.length
    const totalAttendedCount = allCompletedClasses.reduce((sum, c) => sum + (c.attendedCount || 0), 0)
    const totalSessionCommission = payrollSlip ? payrollSlip.sessionCommission : (totalSessionsTaught * sessionRate)
    const kpiBonus = payrollSlip ? payrollSlip.kpiBonus : 0
    const totalPayout = totalSessionCommission + kpiBonus

    return (
        <div className="container-fluid p-0 d-flex flex-column gap-4">
            {/* Page Header */}
            <div>
                <h3 className="fw-bold mb-1">Thống Kê Thù Lao Lớp Dạy</h3>
                <p className="text-muted mb-0">Theo dõi thù lao tích lũy từ các buổi dạy và thưởng đạt chỉ tiêu KPI dạy học cá nhân.</p>
            </div>

            {/* Statistics Cards */}
            <CRow className="g-3">
                <CCol md={3} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #4f46e5" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Tổng Số Lớp Dạy</small>
                                <h4 className="fw-bold mb-0 mt-1" style={{ color: "#312e81" }}>{totalSessionsTaught} lớp</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={3} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #10b981" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#d1fae5", color: "#10b981" }}>
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Lượt Học Viên Tham Gia</small>
                                <h4 className="fw-bold mb-0 mt-1" style={{ color: "#065f46" }}>{totalAttendedCount} lượt</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={3} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #f59e0b" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#fef3c7", color: "#f59e0b" }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Thưởng Đạt KPI Buổi</small>
                                <h4 className="fw-bold mb-0 mt-1" style={{ color: "#92400e" }}>{formatCurrency(kpiBonus)}</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={3} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #059669" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Tổng Thù Lao Lớp Dạy</small>
                                <h4 className="fw-bold mb-0 mt-1 text-success">{formatCurrency(totalPayout)}</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Filter Section */}
            <CCard className="border-0 shadow-sm rounded-4">
                <CCardBody className="p-3">
                    <CRow className="align-items-end g-3">
                        <CCol md={4} xs={12}>
                            <label className="small fw-bold mb-1">Chọn Kỳ Đối Soát</label>
                            <PeriodPicker
                                value={selectedPeriod}
                                onChange={(val) => {
                                    setSelectedPeriod(val)
                                    setCurrentPage(1)
                                }}
                            />
                        </CCol>
                        {payrollSlip && (
                            <CCol md={8} xs={12} className="d-flex align-items-center justify-content-md-end gap-2">
                                <span className="text-muted small">Trạng thái kỳ lương:</span>
                                {payrollSlip.status === "Paid" && <CBadge color="dark">Đã Thanh Toán</CBadge>}
                                {payrollSlip.status === "Approved" && <CBadge color="success">Đã Phê Duyệt</CBadge>}
                                {payrollSlip.status === "Draft" && <CBadge color="warning" className="text-dark">Chờ Phê Duyệt</CBadge>}
                            </CCol>
                        )}
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Main Table */}
            <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
                <CCardBody className="p-0">
                    {loading ? (
                        <div className="text-center py-5">Đang tải lịch sử lớp dạy...</div>
                    ) : classes.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            Chưa có lớp dạy nào hoàn thành được ghi nhận trong kỳ này.
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <CTable align="middle" className="mb-0 table-hover" responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell className="py-3 px-4">Ngày Dạy</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3">Tên Lớp Học</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3">Loại Lớp</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-center">Đã Đăng Ký</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-center">Đã Điểm Danh</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-end">Đơn Giá / Buổi</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 px-4 text-end">Thành Tiền</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {classes.map((c) => {
                                            const classEarnings = sessionRate
                                            return (
                                                <CTableRow key={c.classId}>
                                                    <CTableDataCell className="py-3 px-4 fw-semibold text-muted">
                                                        {moment(c.date).format("DD/MM/YYYY")} ({c.startTime.substring(0, 5)} - {c.endTime.substring(0, 5)})
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 fw-bold text-dark">
                                                        {c.title}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3">
                                                        {c.classType === "PersonalTraining" ? (
                                                            <CBadge color="info">Huấn Luyện 1-1</CBadge>
                                                        ) : (
                                                            <CBadge color="primary">Lớp Nhóm</CBadge>
                                                        )}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 text-center fw-semibold text-secondary">
                                                        {c.bookedCount} / {c.capacity}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 text-center fw-bold text-success">
                                                        {c.attendedCount || 0} HV
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 text-end text-secondary">
                                                        {formatCurrency(sessionRate)}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 px-4 text-end text-primary fw-bold">
                                                        {formatCurrency(classEarnings)}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                    </CTableBody>
                                </CTable>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-end p-4 border-top">
                                    <CPagination className="mb-0">
                                        <CPaginationItem 
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            ‹
                                        </CPaginationItem>
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <CPaginationItem 
                                                key={idx} 
                                                active={currentPage === idx + 1}
                                                onClick={() => setCurrentPage(idx + 1)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {idx + 1}
                                            </CPaginationItem>
                                        ))}
                                        <CPaginationItem 
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            ›
                                        </CPaginationItem>
                                    </CPagination>
                                </div>
                            )}
                        </>
                    )}
                </CCardBody>
            </CCard>
        </div>
    )
}

export default PtCommissionPage
