import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CBadge, CFormSelect, CFormInput, CFormTextarea
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getLeadById, updateLead, updateLeadStatus, contactLead, mergeLeads } from "../../services/leadService"
import { getBranches, getBranchById } from "../../services/branchService"
import { getLeadSources } from "../../services/leadSourceService"
import moment from "moment"

function LeadDetailModal({ visible, setVisible, leadId, onRefresh }) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Edit form states
    const [formData, setFormData] = useState({})
    const [branches, setBranches] = useState([])
    const [sources, setSources] = useState([])
    const [staffs, setStaffs] = useState([])

    // Status / Confirm modal states
    const [statusForm, setStatusForm] = useState({ lostReason: "" })
    const [confirmModalVisible, setConfirmModalVisible] = useState(false)
    const [targetStatus, setTargetStatus] = useState("")

    // Merge state
    const [duplicateId, setDuplicateId] = useState("")
    const [showMerge, setShowMerge] = useState(false)

    useEffect(() => {
        if (visible && leadId) {
            setIsEditing(false)
            setShowMerge(false)
            setConfirmModalVisible(false)
            fetchDetail()
        }
    }, [visible, leadId])

    const fetchDetail = async () => {
        setLoading(true)
        try {
            const data = await getLeadById(leadId)
            setDetail(data)
            setStatusForm({ lostReason: data.lostReason || "" })
        } catch (error) {
            console.error("Failed to load lead detail", error)
        } finally {
            setLoading(false)
        }
    }

    const loadFormData = async (branchId) => {
        try {
            const [branchData, sourceData] = await Promise.all([
                getBranches(),
                getLeadSources()
            ])
            setBranches(branchData || [])
            setSources(sourceData || [])

            if (branchId) {
                const bData = await getBranchById(branchId)
                setStaffs(bData.staffs || [])
            }
        } catch (error) {
            console.error("Failed to load form data", error)
        }
    }

    const handleEditClick = () => {
        setFormData({
            name: detail.name || "",
            phone: detail.phone || "",
            email: detail.email || "",
            note: detail.note || "",
            branchId: detail.branchId || "",
            sourceId: detail.sourceId || "",
            assignedToStaffId: detail.assignedToStaffId || ""
        })
        loadFormData(detail.branchId)
        setIsEditing(true)
    }

    const handleBranchChange = async (e) => {
        const branchId = e.target.value
        setFormData({ ...formData, branchId, assignedToStaffId: "" })
        if (branchId) {
            try {
                const data = await getBranchById(branchId)
                setStaffs(data.staffs || [])
            } catch (error) {
                console.error("Failed to load branch staff", error)
            }
        } else {
            setStaffs([])
        }
    }

    const handleSaveEdit = async () => {
        try {
            await updateLead(leadId, formData)
            setIsEditing(false)
            fetchDetail()
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to update lead", error)
            alert("Cập nhật thất bại.")
        }
    }

    const handleContact = async () => {
        try {
            await contactLead(leadId)
            fetchDetail()
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to contact lead", error)
            alert("Lỗi khi ghi nhận liên hệ.")
        }
    }

    const handleStatusClick = (status) => {
        if (status === detail.status) return
        setTargetStatus(status)
        if (status === "Lost") {
            setStatusForm({ lostReason: "" })
        }
        setConfirmModalVisible(true)
    }

    const confirmStatusChange = async () => {
        if (targetStatus === "Lost" && !statusForm.lostReason) {
            alert("Vui lòng nhập lý do Lost.")
            return
        }
        
        if (targetStatus === "Converted" && onConvert) {
            setConfirmModalVisible(false)
            onConvert()
            return
        }

        try {
            await updateLeadStatus(leadId, targetStatus, statusForm.lostReason)
            setConfirmModalVisible(false)
            fetchDetail()
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to update status", error)
            alert("Cập nhật trạng thái thất bại.")
        }
    }

    const handleMerge = async () => {
        if (!duplicateId) return alert("Vui lòng nhập ID lead bị trùng.")
        try {
            await mergeLeads(leadId, duplicateId)
            alert("Gộp lead thành công!")
            setVisible(false)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to merge lead", error)
            alert("Lỗi gộp lead.")
        }
    }

    const renderStepper = () => {
        const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"]
        const currentIndex = statuses.indexOf(detail?.status)

        return (
            <div className="d-flex justify-content-between position-relative my-4 px-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="progress position-absolute" style={{ height: '4px', top: '18px', left: '10%', right: '10%', zIndex: 0 }}>
                    <div className="progress-bar bg-success" style={{ width: `${(currentIndex / 4) * 100}%` }}></div>
                </div>
                {statuses.map((status, index) => {
                    const isActive = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const isLost = status === "Lost"
                    
                    let colorClass = "bg-light text-muted border"
                    if (isActive) colorClass = "bg-success text-white"
                    if (isCurrent && !isLost) colorClass = "bg-primary text-white shadow"
                    if (isActive && isLost) colorClass = "bg-danger text-white shadow"

                    return (
                        <div key={status} className="text-center position-relative" style={{ zIndex: 1, cursor: 'pointer', width: '80px' }} onClick={() => handleStatusClick(status)}>
                            <div 
                                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${colorClass}`} 
                                style={{ width: '40px', height: '40px', transition: 'all 0.2s', border: isCurrent ? '2px solid white' : 'none' }}
                                title="Click để chuyển trạng thái"
                            >
                                {index + 1}
                            </div>
                            <div className={`mt-2 small fw-bold ${isCurrent ? 'text-dark' : 'text-muted'}`}>{status}</div>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (!leadId) return null

    return (
        <>
            <CModal visible={visible} onClose={() => setVisible(false)} fullscreen backdrop="static">
                <CModalHeader className="bg-light">
                    <CModalTitle className="fw-bold">{isEditing ? "Chỉnh Sửa Lead" : "Hồ Sơ Khách Hàng Tiềm Năng"}</CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4 bg-light" style={{ overflowY: 'auto' }}>
                    {loading ? (
                        <div className="text-center py-5">Đang tải dữ liệu...</div>
                    ) : detail && !isEditing ? (
                        <div className="container" style={{ maxWidth: '1000px' }}>
                            {/* Header info */}
                            <div className="bg-white p-3 rounded border shadow-sm mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold mb-1">{detail.name}</h4>
                                    <div className="text-muted d-flex gap-4 mt-1 fs-6">
                                        <span>📞 {detail.phone}</span>
                                        {detail.email && <span>✉️ {detail.email}</span>}
                                    </div>
                                </div>
                                <div className="text-end">
                                    <CBadge color={
                                        detail.status === 'New' ? 'info' :
                                        detail.status === 'Contacted' ? 'primary' :
                                        detail.status === 'Qualified' ? 'warning' :
                                        detail.status === 'Converted' ? 'success' : 'danger'
                                    } shape="rounded-pill" className="fs-6 mb-2">
                                        {detail.status}
                                    </CBadge>
                                    <div>
                                        <span className="badge bg-secondary text-white px-2 py-1 rounded-pill">🔥 Điểm: {detail.score}</span>
                                    </div>
                                </div>
                            </div>

                            {/* STEPPER */}
                            <div className="bg-white p-3 rounded border shadow-sm mb-3 text-center">
                                <h6 className="fw-bold mb-1 text-start">Trạng Thái Lead</h6>
                                {renderStepper()}
                            </div>

                            <div className="row g-3 mb-3">
                                {/* Thông tin chi tiết */}
                                <div className="col-md-8">
                                    <div className="bg-white p-3 rounded border shadow-sm h-100">
                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                            <h6 className="fw-bold mb-0">Thông tin chi tiết</h6>
                                            <CButton color="warning" size="sm" onClick={handleEditClick}>Sửa thông tin</CButton>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <strong className="text-muted small">Chi nhánh:</strong><br />
                                                <span>{detail.branchName || "N/A"}</span>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong className="text-muted small">Nguồn:</strong><br />
                                                <span>{detail.sourceName || "N/A"}</span>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong className="text-muted small">Sales phụ trách:</strong><br />
                                                <span>{detail.assignedToStaffName || "Chưa phân bổ"}</span>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong className="text-muted small">Ngày tạo:</strong><br />
                                                <span>{moment(detail.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                                            </div>
                                            <div className="col-12 mt-1">
                                                <strong className="text-muted small">Ghi chú:</strong>
                                                <div className="p-2 bg-light rounded mt-1 border" style={{ minHeight: '60px' }}>
                                                    {detail.note || <span className="text-muted fst-italic small">Không có ghi chú.</span>}
                                                </div>
                                            </div>
                                            {detail.status === 'Lost' && (
                                                <div className="col-12 mt-2">
                                                    <strong className="text-danger small">Lý do Lost:</strong>
                                                    <div className="text-danger mt-1 fw-semibold small">{detail.lostReason}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Thao tác Sales */}
                                <div className="col-md-4">
                                    <div className="bg-white p-3 rounded border shadow-sm h-100 text-center d-flex flex-column justify-content-center align-items-center">
                                        <h6 className="fw-bold mb-3 w-100 border-bottom pb-2 text-start">Tương tác Sales</h6>
                                        <div className="display-4 fw-bold text-primary mb-1">{detail.contactCount}</div>
                                        <div className="text-muted mb-2">Lần liên hệ</div>
                                        <p className="small text-muted mb-3 w-100 bg-light p-2 rounded">
                                            Gần nhất:<br/>
                                            <strong>{detail.lastContactedAt ? moment(detail.lastContactedAt).format("DD/MM/YYYY HH:mm") : "Chưa liên hệ"}</strong>
                                        </p>
                                        <CButton color="primary" className="w-100 shadow fw-bold py-2 mt-auto" onClick={handleContact}>
                                            📞 GHI NHẬN LIÊN HỆ
                                        </CButton>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : detail && isEditing ? (
                        <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: '800px' }}>
                            <h4 className="fw-bold mb-4 pb-2 border-bottom">Chỉnh Sửa Thông Tin Lead</h4>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <CFormInput label="Họ tên (*)" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <CFormInput label="Số điện thoại (*)" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <CFormInput type="email" label="Email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <CFormSelect label="Nguồn Khách Hàng (*)" name="sourceId" value={formData.sourceId} onChange={(e) => setFormData({...formData, sourceId: e.target.value})}>
                                        <option value="">-- Chọn Nguồn --</option>
                                        {sources.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </CFormSelect>
                                </div>
                                <div className="col-md-6">
                                    <CFormSelect label="Chi nhánh quan tâm (*)" value={formData.branchId} onChange={handleBranchChange}>
                                        <option value="">-- Chọn Chi nhánh --</option>
                                        {branches.map(b => (
                                            <option key={b.branchId || b.id} value={b.branchId || b.id}>{b.name}</option>
                                        ))}
                                    </CFormSelect>
                                </div>
                                <div className="col-md-6">
                                    <CFormSelect label="Gán cho Sales" name="assignedToStaffId" value={formData.assignedToStaffId} onChange={(e) => setFormData({...formData, assignedToStaffId: e.target.value})} disabled={!formData.branchId}>
                                        <option value="">-- Chọn --</option>
                                        {staffs.map(s => (
                                            <option key={s.userId || s.staffId || s.id} value={s.userId || s.staffId || s.id}>{s.fullName || s.name}</option>
                                        ))}
                                    </CFormSelect>
                                </div>
                                <div className="col-12">
                                    <CFormTextarea label="Ghi chú" name="note" rows="4" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
                                </div>
                                <div className="col-12 text-end mt-4">
                                    <CButton color="secondary" className="me-2" onClick={() => setIsEditing(false)}>Hủy</CButton>
                                    <CButton color="success" className="text-white" onClick={handleSaveEdit}>Lưu Thay Đổi</CButton>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </CModalBody>
                {/* Removed Footer for View Mode */}
            </CModal>

            {/* Confirm Status Modal */}
            <CModal visible={confirmModalVisible} onClose={() => setConfirmModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Xác nhận chuyển trạng thái</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn có chắc chắn muốn chuyển trạng thái Lead này sang <strong className="text-primary">{targetStatus}</strong>?
                    {targetStatus === "Lost" && (
                        <div className="mt-4">
                            <label className="form-label text-danger fw-bold">Lý do mất khách (Bắt buộc):</label>
                            <CFormTextarea 
                                placeholder="Khách báo giá cao, khách đi chỗ khác, không liên lạc được..." 
                                rows="3"
                                value={statusForm.lostReason}
                                onChange={(e) => setStatusForm({...statusForm, lostReason: e.target.value})}
                            />
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setConfirmModalVisible(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={confirmStatusChange} disabled={targetStatus === "Lost" && !statusForm.lostReason.trim()}>Xác nhận</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default LeadDetailModal
