import { useState, useEffect } from "react"
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CBadge,
    CFormSelect,
    CFormLabel,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CPagination,
    CPaginationItem
} from "@coreui/react"
import { DollarSign, Percent, Award, Calendar } from "lucide-react"
import moment from "moment"
import { getMyCommissions } from "../../../shared/services/commissionService"

function StaffCommissionPage() {
    const [commissions, setCommissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 })
    
    const currentDate = new Date()
    const [filters, setFilters] = useState({
        month: String(currentDate.getMonth() + 1),
        year: String(currentDate.getFullYear()),
        page: 1,
        pageSize: 10
    })

    useEffect(() => {
        fetchCommissions()
    }, [filters.month, filters.year, filters.page])

    const fetchCommissions = async () => {
        setLoading(true)
        try {
            const res = await getMyCommissions({
                month: filters.month ? parseInt(filters.month, 10) : undefined,
                year: filters.year ? parseInt(filters.year, 10) : undefined,
                page: filters.page,
                pageSize: filters.pageSize
            })
            if (res?.success) {
                setCommissions(res.data?.items || [])
                setPagination({
                    totalPages: res.data?.totalPages || 1,
                    totalItems: res.data?.totalItems || 0
                })
            } else {
                setCommissions([])
                setPagination({ totalPages: 1, totalItems: 0 })
            }
        } catch (error) {
            console.error("Failed to load commissions", error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
    }

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'paid':
                return <CBadge color="success">Đã duyệt</CBadge>
            case 'pending':
                return <CBadge color="warning" className="text-dark">Chờ duyệt</CBadge>
            case 'rejected':
                return <CBadge color="danger">Bị từ chối</CBadge>
            default:
                return <CBadge color="secondary">{status || 'N/A'}</CBadge>
        }
    }

    // Calculations based on current page's visible items
    const pageTotalAmount = commissions.reduce((sum, item) => sum + (item.amount || 0), 0)
    const pageTotalContracts = commissions.length
    const pageAvgPercent = pageTotalContracts > 0 ? (commissions.reduce((sum, item) => sum + (item.percent || 0), 0) / pageTotalContracts).toFixed(1) : 0

    return (
        <div className="container-fluid p-0 d-flex flex-column gap-4">
            {/* Page Header */}
            <div>
                <h3 className="fw-bold mb-1">Hoa Hồng Cá Nhân</h3>
                <p className="text-muted mb-0">Xem và quản lý các khoản hoa hồng tích lũy từ hợp đồng đăng ký hội viên.</p>
            </div>

            {/* Statistics Cards */}
            <CRow className="g-3">
                <CCol md={4} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #4f46e5" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Tổng Hoa Hồng (Trang này)</small>
                                <h4 className="fw-bold mb-0 mt-1 text-indigo-600">{formatCurrency(pageTotalAmount)}</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={4} sm={6} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #10b981" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#d1fae5", color: "#10b981" }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Số Hợp Đồng (Trang này)</small>
                                <h4 className="fw-bold mb-0 mt-1 text-success">{pageTotalContracts} hợp đồng</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={4} sm={12} xs={12}>
                    <CCard className="border-0 shadow-sm rounded-4 h-100 bg-white" style={{ borderLeft: "4px solid #f59e0b" }}>
                        <CCardBody className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#fef3c7", color: "#f59e0b" }}>
                                <Percent size={24} />
                            </div>
                            <div>
                                <small className="text-muted fw-semibold">Tỉ Lệ Trung Bình (Trang này)</small>
                                <h4 className="fw-bold mb-0 mt-1 text-warning">{pageAvgPercent}%</h4>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Filter Section */}
            <CCard className="border-0 shadow-sm rounded-4">
                <CCardBody className="p-3">
                    <CRow className="align-items-end g-3">
                        <CCol md={3} sm={6} xs={12}>
                            <CFormLabel className="small fw-bold mb-1">Chọn Tháng</CFormLabel>
                            <CFormSelect
                                value={filters.month}
                                onChange={(e) => setFilters({ ...filters, month: e.target.value, page: 1 })}
                            >
                                <option value="">Tất cả các tháng</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Tháng {String(i + 1).padStart(2, "0")}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={3} sm={6} xs={12}>
                            <CFormLabel className="small fw-bold mb-1">Chọn Năm</CFormLabel>
                            <CFormSelect
                                value={filters.year}
                                onChange={(e) => setFilters({ ...filters, year: e.target.value, page: 1 })}
                            >
                                <option value="">Tất cả các năm</option>
                                <option value="2024">Năm 2024</option>
                                <option value="2025">Năm 2025</option>
                                <option value="2026">Năm 2026</option>
                                <option value="2027">Năm 2027</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Main Table */}
            <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
                <CCardBody className="p-0">
                    {loading ? (
                        <div className="text-center py-5">Đang tải lịch sử hoa hồng...</div>
                    ) : commissions.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            Chưa có dữ liệu hoa hồng được ghi nhận cho kỳ này.
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <CTable align="middle" className="mb-0 table-hover" responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell className="py-3 px-4">Mã Hợp Đồng</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3">Hội Viên</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3">Gói Tập</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-center">Tỷ Lệ</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-end">Số Tiền</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-center">Trạng Thái</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 px-4 text-center">Ngày Tạo</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {commissions.map((item) => (
                                            <CTableRow key={item.commissionId}>
                                                <CTableDataCell className="py-3 px-4 fw-semibold text-muted small">
                                                    #{item.contractId?.substring(0, 8).toUpperCase() || 'N/A'}
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3 fw-bold text-dark">
                                                    {item.memberName || 'N/A'}
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3">
                                                    {item.packageName || 'N/A'}
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3 text-center fw-semibold text-secondary">
                                                    {item.percent}%
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3 text-end text-primary fw-bold">
                                                    {formatCurrency(item.amount)}
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3 text-center">
                                                    {getStatusBadge(item.status)}
                                                </CTableDataCell>
                                                <CTableDataCell className="py-3 px-4 text-center text-muted small">
                                                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-end p-4 border-top">
                                    <CPagination className="mb-0">
                                        <CPaginationItem 
                                            disabled={filters.page === 1}
                                            onClick={() => setFilters({...filters, page: filters.page - 1})}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            ‹
                                        </CPaginationItem>
                                        {[...Array(pagination.totalPages)].map((_, idx) => (
                                            <CPaginationItem 
                                                key={idx} 
                                                active={filters.page === idx + 1}
                                                onClick={() => setFilters({...filters, page: idx + 1})}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {idx + 1}
                                            </CPaginationItem>
                                        ))}
                                        <CPaginationItem 
                                            disabled={filters.page === pagination.totalPages}
                                            onClick={() => setFilters({...filters, page: filters.page + 1})}
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

export default StaffCommissionPage
