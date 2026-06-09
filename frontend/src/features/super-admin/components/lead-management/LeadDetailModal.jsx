import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CBadge, CFormSelect, CFormInput, CFormTextarea
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getLeadById, updateLead, updateLeadStatus, contactLead, mergeLeads } from "../../services/leadService"
import { getBranches, getBranchById } from "../../services/branchService"
import { getLeadSources } from "../../services/leadSourceService"
import moment from "moment"

function LeadDetailModal({ visible, setVisible, leadId, onRefresh, onConvert }) {
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

    const statusLabels = {
        "New": "Mới",
        "Contacted": "Đã liên hệ",
        "Qualified": "Tiềm năng",
        "Converted": "Đã chốt",
        "Lost": "Thất bại"
    }

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
            <div className="d-flex justify-content-between position-relative my-4 px-4" style={{ maxWidth: '680px', margin: '0 auto' }}>
                <div className="progress position-absolute" style={{ height: '4px', top: '18px', left: '10%', right: '10%', zIndex: 0 }}>
                    <div className="progress-bar bg-success" style={{ width: `${(currentIndex / 4) * 100}%` }}></div>
                </div>
                {statuses.map((status, index) => {
                    const isActive = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const isLost = status === "Lost"
                    
                    let colorClass = "bg-white text-muted border border-2"
                    if (isActive) colorClass = "bg-success text-white border-success"
                    if (isCurrent && !isLost) colorClass = "bg-warning text-white border-warning shadow-sm"
                    if (isActive && isLost) colorClass = "bg-danger text-white border-danger shadow-sm"

                    return (
                        <div key={status} className="text-center position-relative" style={{ zIndex: 1, cursor: 'pointer', width: '85px' }} onClick={() => handleStatusClick(status)}>
                            <div 
                                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${colorClass}`} 
                                style={{ width: '40px', height: '40px', transition: 'all 0.2s', fontWeight: '600' }}
                                title="Click để chuyển trạng thái"
                            >
                                {index + 1}
                            </div>
                            <div className={`mt-2 small fw-bold ${isCurrent ? 'text-dark' : 'text-muted'}`}>
                                {statusLabels[status]}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (!leadId) return null

    return (
        <>
            <CModal visible={visible} onClose={() => setVisible(false)} size="lg" backdrop="static">
                <CModalHeader>
                    <CModalTitle className="fw-bold">{isEditing ? "Chỉnh Sửa Lead" : "Hồ Sơ Khách Hàng Tiềm Năng"}</CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4" style={{ background: "#f9fafb" }}>
                    {loading ? (
                        <div className="text-center py-5">Đang tải dữ liệu...</div>
                    ) : detail && !isEditing ? (
                        <div>
                            {/* Header info */}
                            <div className="bg-white p-3 rounded-3 border shadow-sm mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold mb-1 text-dark">{detail.name}</h4>
                                    <div className="text-muted d-flex gap-4 mt-2" style={{ fontSize: "14px" }}>
                                        <span>SĐT: <strong className="text-dark">{detail.phone}</strong></span>
                                        {detail.email && <span>Email: <strong className="text-dark">{detail.email}</strong></span>}
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="mb-2">
                                        <CBadge color={
                                            detail.status === 'New' ? 'info' :
                                            detail.status === 'Contacted' ? 'primary' :
                                            detail.status === 'Qualified' ? 'warning' :
                                            detail.status === 'Converted' ? 'success' : 'danger'
                                        } className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>
                                            {statusLabels[detail.status]}
                                        </CBadge>
                                    </div>
                                    <div>
                                        <span className="small text-muted fw-semibold px-2 py-1 rounded bg-light border">Độ ưu tiên: {detail.score}</span>
                                    </div>
                                </div>
                            </div>

                            {/* STEPPER */}
                            <div className="bg-white p-3 rounded-3 border shadow-sm mb-3">
                                <h6 className="fw-bold mb-1 text-dark">Quy Trình Chăm Sóc</h6>
                                {renderStepper()}
                            </div>

                            <div className="row g-3 mb-3">
                                {/* Thông tin chi tiết */}
                                <div className="col-md-7">
                                    <div className="bg-white p-3 rounded-3 border shadow-sm h-100">
                                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                            <h6 className="fw-bold mb-0 text-dark">Thông Tin Chi Tiết</h6>
                                            <CButton color="warning" size="sm" className="fw-semibold text-white shadow-sm" onClick={handleEditClick}>
                                                Sửa thông tin
                                            </CButton>
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="text-muted small mb-1">Chi nhánh quan tâm</div>
                                                <div className="fw-semibold text-dark">{detail.branchName || "Chưa chọn"}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="text-muted small mb-1">Nguồn khách hàng</div>
                                                <div className="fw-semibold text-dark">{detail.sourceName || "Chưa chọn"}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="text-muted small mb-1">Sales phụ trách</div>
                                                <div className="fw-semibold text-dark">{detail.assignedToStaffName || "Chưa phân bổ"}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="text-muted small mb-1">Ngày tạo</div>
                                                <div className="fw-semibold text-dark">{moment(detail.createdAt).format("DD/MM/YYYY HH:mm")}</div>
                                            </div>
                                            <div className="col-12">
                                                <div className="text-muted small mb-1">Ghi chú</div>
                                                <div className="p-3 bg-light rounded-3 border text-dark" style={{ minHeight: '80px', fontSize: '13px', lineHeight: '1.5' }}>
                                                    {detail.note || <span className="text-muted fst-italic">Không có ghi chú.</span>}
                                                </div>
                                            </div>
                                            {detail.status === 'Lost' && (
                                                <div className="col-12">
                                                    <div className="text-danger small fw-semibold mb-1">Lý do thất bại (Lost)</div>
                                                    <div className="p-2 bg-danger-light text-danger rounded border border-danger-subtle fw-semibold" style={{ fontSize: '13px' }}>
                                                        {detail.lostReason}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Thao tác Sales */}
                                <div className="col-md-5">
                                    <div className="bg-white p-3 rounded-3 border shadow-sm h-100 d-flex flex-column">
                                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark">Tương Tác Sales</h6>
                                        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-3">
                                            <div className="display-4 fw-bold text-warning mb-1">{detail.contactCount}</div>
                                            <div className="text-muted small mb-3">Lần liên hệ chăm sóc</div>
                                            <div className="w-100 bg-light p-3 rounded-3 border text-center mb-4" style={{ fontSize: "13px" }}>
                                                <div className="text-muted small mb-1">Lần cuối liên hệ:</div>
                                                <strong className="text-dark">
                                                    {detail.lastContactedAt ? moment(detail.lastContactedAt).format("DD/MM/YYYY HH:mm") : "Chưa liên hệ"}
                                                </strong>
                                            </div>
                                        </div>
                                        <CButton color="warning" className="w-100 text-white fw-bold py-2 mt-auto shadow-sm" onClick={handleContact}>
                                            GHI NHẬN LIÊN HỆ
                                        </CButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : detail && isEditing ? (
                        <div className="container bg-white p-4 rounded-3 border shadow-sm" style={{ maxWidth: '800px' }}>
                            <h5 className="fw-bold mb-4 pb-2 border-bottom text-dark">Chỉnh Sửa Thông Tin Lead</h5>
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
                                    <CButton color="secondary" variant="outline" className="me-2" onClick={() => setIsEditing(false)}>Hủy</CButton>
                                    <CButton color="warning" className="text-white fw-semibold" onClick={handleSaveEdit}>Lưu Thay Đổi</CButton>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </CModalBody>
            </CModal>

            {/* Confirm Status Modal */}
            <CModal visible={confirmModalVisible} onClose={() => setConfirmModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle className="fw-bold">Xác nhận chuyển trạng thái</CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4">
                    Bạn có chắc chắn muốn chuyển trạng thái Lead này sang <strong className="text-warning">{statusLabels[targetStatus] || targetStatus}</strong>?
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
                    <CButton color="secondary" variant="outline" onClick={() => setConfirmModalVisible(false)}>Hủy</CButton>
                    <CButton color="warning" className="text-white fw-semibold" onClick={confirmStatusChange} disabled={targetStatus === "Lost" && !statusForm.lostReason.trim()}>Xác nhận</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default LeadDetailModal
