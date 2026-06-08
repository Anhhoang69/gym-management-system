import { useState, useEffect } from "react"
import {
    CCard,
    CCardBody,
    CFormSelect,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CPagination,
    CPaginationItem,
    CBadge,
    CFormInput,
    CButton
} from "@coreui/react"
import moment from "moment"
import { getPayments } from "../services/paymentService"
import { Search } from "lucide-react"
import Pagination from "../../../shared/components/Pagination"

function StaffPaymentPage() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        search: "",
        method: "",
        page: 1,
        pageSize: 10
    })
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 })

    useEffect(() => {
        fetchPayments()
    }, [filters.page, filters.method])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const data = await getPayments({
                Search: filters.search,
                PaymentMethod: filters.method,
                Page: filters.page,
                PageSize: filters.pageSize
            })
            setPayments(data.items || data || [])
            setPagination({
                totalPages: data.totalPages || 1,
                totalItems: data.totalItems || 0
            })
        } catch (error) {
            console.error("Failed to load payments", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setFilters({ ...filters, page: 1 })
        fetchPayments()
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    }

    const getMethodBadge = (method) => {
        switch (method?.toLowerCase()) {
            case 'cash': return <CBadge color="success">Tiền mặt</CBadge>
            case 'card': return <CBadge color="info">Thẻ</CBadge>
            case 'transfer': return <CBadge color="primary">Chuyển khoản</CBadge>
            default: return <CBadge color="secondary">{method || 'N/A'}</CBadge>
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Lịch Sử Giao Dịch</h3>
                    <p className="text-muted mb-0">Quản lý các giao dịch thu tiền hội viên</p>
                </div>
            </div>

            <CCard className="border-0 shadow-sm">
                <CCardBody>
                    <div className="row mb-3 g-3">
                        <div className="col-md-4">
                            <div className="d-flex gap-2">
                                <CFormInput 
                                    placeholder="Tìm theo mã giao dịch, hóa đơn..." 
                                    value={filters.search}
                                    name="search"
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <CButton color="primary" onClick={handleSearch}>
                                    <Search size={16} />
                                </CButton>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <CFormSelect name="method" value={filters.method} onChange={handleFilterChange}>
                                <option value="">Tất cả phương thức</option>
                                <option value="Cash">Tiền mặt</option>
                                <option value="Card">Thẻ (POS)</option>
                                <option value="Transfer">Chuyển khoản</option>
                            </CFormSelect>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Đang tải dữ liệu...</div>
                    ) : (
                        <>
                            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                    <CTableHead color="light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <CTableRow>
                                            <CTableHeaderCell>Mã Giao Dịch</CTableHeaderCell>
                                            <CTableHeaderCell>Mã Hóa Đơn</CTableHeaderCell>
                                            <CTableHeaderCell>Số Tiền</CTableHeaderCell>
                                            <CTableHeaderCell>Phương Thức</CTableHeaderCell>
                                            <CTableHeaderCell>Nhân Viên</CTableHeaderCell>
                                            <CTableHeaderCell>Ngày Thanh Toán</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {payments.map(payment => (
                                            <CTableRow key={payment.paymentId || payment.id}>
                                                <CTableDataCell className="fw-semibold text-muted small">
                                                    {(payment.paymentCode || payment.paymentId || payment.id || '').substring(0, 8).toUpperCase()}
                                                </CTableDataCell>
                                                <CTableDataCell className="fw-semibold">
                                                    {(payment.invoiceCode || payment.invoiceId || 'N/A').substring(0, 8).toUpperCase()}
                                                </CTableDataCell>
                                                <CTableDataCell className="fw-bold text-indigo-600">
                                                    {formatCurrency(payment.amount)}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {getMethodBadge(payment.paymentMethod)}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {payment.processedByName || payment.staffName || 'N/A'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {moment(payment.paymentDate || payment.createdAt).format("DD/MM/YYYY HH:mm")}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                        {payments.length === 0 && (
                                            <CTableRow>
                                                <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
                                                    Không tìm thấy giao dịch nào.
                                                </CTableDataCell>
                                            </CTableRow>
                                        )}
                                    </CTableBody>
                                </CTable>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="d-flex justify-content-end mt-4">
                                    <Pagination
                                        currentPage={filters.page}
                                        totalPages={pagination.totalPages}
                                        onChange={(newPage) => setFilters({...filters, page: newPage})}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CCardBody>
            </CCard>
        </div>
    )
}

export default StaffPaymentPage
