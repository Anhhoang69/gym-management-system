import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CFormInput, CFormSelect, CFormTextarea
} from "@coreui/react"
import { useState, useEffect } from "react"
import { createLead } from "../../services/leadService"
import { getBranches, getBranchById } from "../../services/branchService"
import { getLeadSources } from "../../services/leadSourceService"

function CreateLeadModal({ visible, setVisible, onRefresh }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        note: "",
        branchId: "",
        sourceId: "",
        assignedToStaffId: ""
    })

    const [branches, setBranches] = useState([])
    const [sources, setSources] = useState([])
    const [staffs, setStaffs] = useState([])

    useEffect(() => {
        if (visible) {
            loadInitialData()
            setFormData({
                name: "", phone: "", email: "", note: "",
                branchId: "", sourceId: "", assignedToStaffId: ""
            })
            setStaffs([])
        }
    }, [visible])

    const loadInitialData = async () => {
        try {
            const [branchData, sourceData] = await Promise.all([
                getBranches(),
                getLeadSources()
            ])
            setBranches(branchData || [])
            setSources(sourceData || [])
        } catch (error) {
            console.error("Failed to load initial data", error)
        }
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {
            await createLead(formData)
            setVisible(false)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to create lead", error)
            alert("Lỗi khi tạo Lead. Vui lòng kiểm tra lại thông tin.")
        }
    }

    return (
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg" backdrop="static">
            <CModalHeader>
                <CModalTitle>Thêm Lead Mới</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div className="row g-3">
                    <div className="col-md-6">
                        <CFormInput label="Họ tên (*)" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <CFormInput label="Số điện thoại (*)" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <CFormInput type="email" label="Email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <CFormSelect label="Nguồn Khách Hàng (*)" name="sourceId" value={formData.sourceId} onChange={handleChange}>
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
                        <CFormSelect label="Gán cho Sales (Tuỳ chọn)" name="assignedToStaffId" value={formData.assignedToStaffId} onChange={handleChange} disabled={!formData.branchId}>
                            <option value="">-- Tự động phân bổ hoặc Chọn --</option>
                            {staffs.map(s => (
                                <option key={s.userId || s.staffId || s.id} value={s.userId || s.staffId || s.id}>{s.fullName || s.name}</option>
                            ))}
                        </CFormSelect>
                    </div>

                    <div className="col-12">
                        <CFormTextarea label="Ghi chú" name="note" rows="3" value={formData.note} onChange={handleChange} placeholder="Nhu cầu, tình trạng thể chất..." />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
                <CButton color="warning" onClick={handleSubmit} disabled={!formData.name || !formData.phone || !formData.branchId || !formData.sourceId}>
                    Tạo Lead
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default CreateLeadModal
