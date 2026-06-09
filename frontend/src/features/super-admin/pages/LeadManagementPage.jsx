import { useState, useEffect } from "react"
import {
    CButton,
    CFormInput,
    CBadge,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CNav,
    CNavItem,
    CNavLink
} from "@coreui/react"
import { cilPeople, cilUserPlus, cilChartLine, cilBan } from "@coreui/icons"
import { getLeads, getLeadStats, getLeadSources } from "../services/leadService"
import moment from "moment"
import CreateLeadModal from "../components/lead-management/CreateLeadModal"
import Pagination from "../../../shared/components/Pagination"
import LeadDetailModal from "../components/lead-management/LeadDetailModal"
import MembershipOnboardingModal from "../components/common/MembershipOnboardingModal"
import UnifiedPaymentDrawer from "../components/common/UnifiedPaymentDrawer"
import StatsCards from "../components/common/StatsCards"
import LeadSourcesTab from "../components/lead-management/LeadSourcesTab"
import LeadSourceModal from "../components/lead-management/LeadSourceModal"

function LeadManagementPage() {
    const [activeTab, setActiveTab] = useState("leads") // leads or sources

    const [leads, setLeads] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [sourceId, setSourceId] = useState("")
    const [sources, setSources] = useState([])
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 })

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)

    // Onboarding & Payment Modals State
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [paymentData, setPaymentData] = useState({})

    // Lead Source Modal State
    const [showLeadSourceModal, setShowLeadSourceModal] = useState(false)
    const [selectedLeadSource, setSelectedLeadSource] = useState(null)
    const [leadSourcesRefreshTrigger, setLeadSourcesRefreshTrigger] = useState(0)

    const fetchStats = async () => {
        try {
            const data = await getLeadStats()
            setStats(data)
        } catch (error) {
            console.error("Failed to load lead stats", error)
        }
    }

    const fetchSources = async () => {
        try {
            const data = await getLeadSources()
            setSources(data || [])
        } catch (error) {
            console.error("Failed to load lead sources", error)
        }
    }

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const data = await getLeads({
                Search: search,
                Status: status,
                SourceId: sourceId,
                Page: page,
                PageSize: pageSize
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

    useEffect(() => {
        fetchStats()
        fetchSources()
    }, [])

    useEffect(() => {
        if (activeTab === "leads") {
            fetchLeads()
        }
    }, [page, activeTab])

    useEffect(() => {
        if (activeTab === "leads") {
            const timeout = setTimeout(() => {
                if (page === 1) {
                    fetchLeads()
                } else {
                    setPage(1)
                }
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [search, status, sourceId])

    const getStatusBadge = (status) => {
        let color = "secondary"
        let text = status
        switch (status) {
            case 'New':
                color = "info"
                text = "Mới"
                break
            case 'Contacted':
                color = "primary"
                text = "Đã liên hệ"
                break
            case 'Qualified':
                color = "warning"
                text = "Tiềm năng"
                break
            case 'Converted':
                color = "success"
                text = "Đã chốt"
                break
            case 'Lost':
                color = "danger"
                text = "Thất bại"
                break
        }
        return (
            <CBadge color={color} className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>
                {text}
            </CBadge>
        )
    }

    const statsItems = stats ? [
        {
            title: "Tổng Số Leads",
            value: stats.totalLeads,
            subtitle: `+${stats.leadsCreatedToday} hôm nay`,
            icon: cilPeople,
            bg: "#FFF3CD",
            color: "#F59E0B"
        },
        {
            title: "Lead Mới",
            value: stats.newLeads,
            icon: cilUserPlus,
            bg: "#DCFCE7",
            color: "#22C55E"
        },
        {
            title: "Tỉ Lệ Chuyển Đổi",
            value: `${(stats.conversionRate || 0).toFixed(1)}%`,
            icon: cilChartLine,
            bg: "#F3E8FF",
            color: "#A855F7"
        },
        {
            title: "Lead Đã Mất",
            value: stats.lostLeads,
            icon: cilBan,
            bg: "#FEE2E2",
            color: "#EF4444"
        }
    ] : []

    return (
        <div className="d-flex flex-column h-100" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>
            {/* FIXED TOP AREA */}
            <div className="flex-shrink-0">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-0">Quản Lý Leads</h3>
                    </div>
                    <div className="d-flex gap-2">
                        {activeTab === "leads" ? (
                            <>
                                <CButton color="success" className="text-white fw-semibold shadow-sm" onClick={() => alert("Chức năng Import CSV đang phát triển")}>
                                    Import CSV
                                </CButton>
                                <CButton color="warning" className="fw-semibold shadow-sm" onClick={() => setShowCreateModal(true)}>
                                    + Thêm Lead
                                </CButton>
                            </>
                        ) : (
                            <CButton color="success" className="text-white fw-semibold shadow-sm" onClick={() => {
                                setSelectedLeadSource(null)
                                setShowLeadSourceModal(true)
                            }}>
                                + Thêm Nguồn Lead
                            </CButton>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <CNav variant="tabs" className="mb-3">
                    <CNavItem>
                        <CNavLink
                            active={activeTab === "leads"}
                            onClick={() => setActiveTab("leads")}
                            style={{ cursor: "pointer", fontWeight: activeTab === "leads" ? "bold" : "normal" }}
                        >
                            Danh Sách Leads
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === "sources"}
                            onClick={() => setActiveTab("sources")}
                            style={{ cursor: "pointer", fontWeight: activeTab === "sources" ? "bold" : "normal" }}
                        >
                            Nguồn Leads
                        </CNavLink>
                    </CNavItem>
                </CNav>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "leads" ? (
                <>
                    {/* FIXED STATS & FILTERS (only for leads) */}
                    <div className="flex-shrink-0">
                        {/* STATS */}
                        <StatsCards stats={statsItems} />

                        {/* FILTERS */}
                        <div className="row g-4 align-items-center mt-2 mb-2">
                            <div className="col-md-3">
                                <CFormInput 
                                    placeholder="Tìm theo tên, SĐT, email..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <select 
                                    className="form-select w-100"
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="New">Mới (New)</option>
                                    <option value="Contacted">Đã liên hệ (Contacted)</option>
                                    <option value="Qualified">Tiềm năng (Qualified)</option>
                                    <option value="Converted">Đã chốt (Converted)</option>
                                    <option value="Lost">Thất bại (Lost)</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select 
                                    className="form-select w-100"
                                    value={sourceId} 
                                    onChange={(e) => setSourceId(e.target.value)}
                                >
                                    <option value="">Tất cả nguồn</option>
                                    {sources.map(src => (
                                        <option key={src.id} value={src.id}>{src.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TABLE AREA */}
                    <div className="flex-grow-1 overflow-auto mt-2 border rounded-3" style={{ minHeight: 0, background: "#fff" }}>
                        {loading ? (
                            <div className="text-center py-5 text-muted">Đang tải dữ liệu...</div>
                        ) : (
                            <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                                <thead
                                    style={{
                                        position: "sticky",
                                        top: 0,
                                        background: "#f9fafb",
                                        zIndex: 2,
                                        boxShadow: "0 1px 0 #e5e7eb",
                                    }}
                                >
                                    <tr>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Họ Tên</th>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Liên Hệ</th>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Nguồn</th>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Nhân Viên</th>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Ngày Tạo</th>
                                        <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Trạng Thế</th>
                                        <th style={{ width: 80, padding: "12px 16px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map(lead => (
                                        <tr key={lead.leadId} className="user-row">
                                            <td style={{ padding: "14px 16px" }} className="fw-semibold text-dark">
                                                {lead.name}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div className="small fw-medium text-dark">{lead.phone}</div>
                                                <div className="small text-muted">{lead.email}</div>
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                                                {lead.sourceName || 'Không xác định'}
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                                                {lead.assignedToStaffName || 'Chưa gán'}
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                                                {moment(lead.createdAt).format("DD/MM/YYYY")}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                {getStatusBadge(lead.status)}
                                            </td>
                                            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                                <CDropdown alignment="end" onClick={(e) => e.stopPropagation()}>
                                                    <CDropdownToggle color="light" size="sm" caret={false} className="border shadow-sm" style={{ minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                                        ⋮
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem onClick={() => {
                                                            setSelectedLead(lead)
                                                            setShowDetailModal(true)
                                                        }}>
                                                            Chi Tiết
                                                        </CDropdownItem>
                                                        {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                                                            <CDropdownItem className="border-top" onClick={() => {
                                                                setSelectedLead(lead)
                                                                setShowOnboarding(true)
                                                            }}>
                                                                Chốt Sale
                                                            </CDropdownItem>
                                                        )}
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-muted">
                                                Không tìm thấy lead nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* PAGINATION / FOOTER */}
                    <div className="flex-shrink-0 mt-3 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Hiển thị {pagination.totalItems === 0 ? 0 : (page - 1) * pageSize + 1}–
                            {Math.min(page * pageSize, pagination.totalItems)} của {pagination.totalItems}
                        </small>

                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                            totalPages={pagination.totalPages}
                                onChange={setPage}
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-grow-1 d-flex flex-column overflow-hidden mt-3">
                    <LeadSourcesTab 
                        refreshTrigger={leadSourcesRefreshTrigger} 
                        onEditSource={(source) => {
                            setSelectedLeadSource(source)
                            setShowLeadSourceModal(true)
                        }} 
                    />
                </div>
            )}

            <CreateLeadModal 
                visible={showCreateModal}
                setVisible={setShowCreateModal}
                onRefresh={() => { fetchLeads(); fetchStats(); }}
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

            <LeadSourceModal
                visible={showLeadSourceModal}
                setVisible={setShowLeadSourceModal}
                leadSource={selectedLeadSource}
                onSaved={() => setLeadSourcesRefreshTrigger(prev => prev + 1)}
            />
        </div>
    )
}

export default LeadManagementPage
