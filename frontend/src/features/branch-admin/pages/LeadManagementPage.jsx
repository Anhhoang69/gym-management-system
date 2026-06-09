import { useState, useEffect } from "react"
import {
    CCard,
    CCardBody,
    CButton,
    CFormInput,
    CFormSelect,
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
import { getLeads, getLeadStats } from "../../super-admin/services/leadService"
import moment from "moment"
import CreateLeadModal from "../../super-admin/components/lead-management/CreateLeadModal"
import Pagination from "../../../shared/components/Pagination"
import LeadDetailModal from "../../super-admin/components/lead-management/LeadDetailModal"
import MembershipOnboardingModal from "../../super-admin/components/common/MembershipOnboardingModal"
import UnifiedPaymentDrawer from "../../super-admin/components/common/UnifiedPaymentDrawer"

function LeadManagementPage() {
    const storedUser = localStorage.getItem("user")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const myBranchId = currentUser?.branchId || ""

    const [leads, setLeads] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        page: 1,
        pageSize: 10
    })
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)

    // Onboarding & Payment Modals State
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [paymentData, setPaymentData] = useState({})

    useEffect(() => {
        fetchStats()
        fetchLeads()
    }, [filters.page, filters.status])

    const fetchStats = async () => {
        try {
            const data = await getLeadStats()
            setStats(data)
        } catch (error) {
            console.error("Failed to load lead stats", error)
        }
    }

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const data = await getLeads({
                Search: filters.search,
                Status: filters.status,
                Page: filters.page,
                PageSize: filters.pageSize,
                BranchId: myBranchId
            })
            setLeads(data.items || [])
            setPagination({
                totalPages: data.totalPages,
                totalItems: data.totalItems
            })
        } catch (error) {
            console.error("Failed to load leads", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setFilters({ ...filters, page: 1 })
        fetchLeads()
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return <CBadge color="info">New</CBadge>
            case 'Contacted': return <CBadge color="primary">Contacted</CBadge>
            case 'Qualified': return <CBadge color="warning">Qualified</CBadge>
            case 'Converted': return <CBadge color="success">Converted</CBadge>
            case 'Lost': return <CBadge color="danger">Lost</CBadge>
            default: return <CBadge color="secondary">{status}</CBadge>
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Quản Lý Leads</h3>
                    <p className="text-muted mb-0">Theo dõi khách hàng tiềm năng & CRM</p>
                </div>
                <div className="d-flex gap-2">
                    <CButton color="success" className="text-white" onClick={() => alert("Chức năng Import CSV đang phát triển")}>
                        Import CSV
                    </CButton>
                    <CButton color="warning" onClick={() => setShowCreateModal(true)}>
                        + Thêm Lead
                    </CButton>
                </div>
            </div>

            {/* Dashboard Stats */}
            {stats && (
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <CCard className="border-0 shadow-sm">
                            <CCardBody>
                                <div className="text-muted small fw-semibold">TỔNG SỐ LEADS</div>
                                <h3 className="mb-0 fw-bold">{stats.totalLeads}</h3>
                                <div className="text-success small mt-1">+{stats.leadsCreatedToday} hôm nay</div>
                            </CCardBody>
                        </CCard>
                    </div>
                    <div className="col-md-3">
                        <CCard className="border-0 shadow-sm">
                            <CCardBody>
                                <div className="text-muted small fw-semibold">LEAD MỚI</div>
                                <h3 className="mb-0 fw-bold text-info">{stats.newLeads}</h3>
                            </CCardBody>
                        </CCard>
                    </div>
                    <div className="col-md-3">
                        <CCard className="border-0 shadow-sm">
                            <CCardBody>
                                <div className="text-muted small fw-semibold">TỈ LỆ CHUYỂN ĐỔI</div>
                                <h3 className="mb-0 fw-bold text-success">{(stats.conversionRate || 0).toFixed(1)}%</h3>
                            </CCardBody>
                        </CCard>
                    </div>
                    <div className="col-md-3">
                        <CCard className="border-0 shadow-sm">
                            <CCardBody>
                                <div className="text-muted small fw-semibold">LEAD ĐÃ MẤT</div>
                                <h3 className="mb-0 fw-bold text-danger">{stats.lostLeads}</h3>
                            </CCardBody>
                        </CCard>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <CCard className="border-0 shadow-sm">
                <CCardBody>
                    <div className="row mb-3 g-3">
                        <div className="col-md-4">
                            <div className="d-flex gap-2">
                                <CFormInput 
                                    placeholder="Tìm theo tên, SĐT, email..." 
                                    value={filters.search}
                                    name="search"
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <CButton color="primary" onClick={handleSearch}>Tìm</CButton>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <CFormSelect name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </CFormSelect>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Đang tải...</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell>Họ Tên</CTableHeaderCell>
                                            <CTableHeaderCell>Liên Hệ</CTableHeaderCell>
                                            <CTableHeaderCell>Nguồn</CTableHeaderCell>
                                            <CTableHeaderCell>Nhân Viên</CTableHeaderCell>
                                            <CTableHeaderCell>Ngày Tạo</CTableHeaderCell>
                                            <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Thao tác</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {leads.map(lead => (
                                            <CTableRow key={lead.leadId}>
                                                <CTableDataCell className="fw-semibold">
                                                    {lead.name}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="small">{lead.phone}</div>
                                                    <div className="small text-muted">{lead.email}</div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {lead.sourceName || 'Unknown'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {lead.assignedToStaffName || 'Chưa gán'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {moment(lead.createdAt).format("DD/MM/YYYY")}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {getStatusBadge(lead.status)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CButton 
                                                        color="info" 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedLead(lead)
                                                            setShowDetailModal(true)
                                                        }}
                                                    >
                                                        Chi Tiết
                                                    </CButton>
                                                    {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                                                        <CButton 
                                                            color="success" 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="ms-2"
                                                            onClick={() => {
                                                                setSelectedLead(lead)
                                                                setShowOnboarding(true)
                                                            }}
                                                        >
                                                            Chốt Sale
                                                        </CButton>
                                                    )}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                        {leads.length === 0 && (
                                            <CTableRow>
                                                <CTableDataCell colSpan={7} className="text-center py-4 text-muted">
                                                    Không tìm thấy lead nào.
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

            <CreateLeadModal 
                visible={showCreateModal}
                setVisible={setShowCreateModal}
                onRefresh={() => { fetchLeads(); fetchStats(); }}
                fixedBranchId={myBranchId}
            />

            {selectedLead && (
                <LeadDetailModal
                    visible={showDetailModal}
                    setVisible={setShowDetailModal}
                    leadId={selectedLead.leadId}
                    onRefresh={() => { fetchLeads(); fetchStats(); }}
                    onConvert={() => {
                        setShowDetailModal(false);
                        setShowOnboarding(true);
                    }}
                />
            )}

            <MembershipOnboardingModal
                visible={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                mode="convert-lead"
                leadData={selectedLead}
                onSuccess={(data) => {
                    setShowOnboarding(false);
                    setPaymentData(data);
                    setShowPayment(true);
                    fetchLeads();
                    fetchStats();
                }}
            />

            <UnifiedPaymentDrawer
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                invoiceId={paymentData.invoiceId}
                contractId={paymentData.contractId}
                totalAmountDue={paymentData.totalAmountDue}
                invoiceCode={paymentData.invoiceCode}
                onSuccess={() => {
                    // Drawer success state plays for a bit then closes
                }}
            />
        </div>
    )
}

export default LeadManagementPage
