import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CBadge,
    CFormSelect,
    CFormInput,
    CFormTextarea
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getClassById, updateClassStatus, deleteClass, updateClass } from "../../services/classService"
import { getBranches, getBranchById } from "../../services/branchService"
import moment from "moment"

function ClassDetailModal({ visible, setVisible, classData, onRefresh }) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Edit Form State
    const [formData, setFormData] = useState({})
    const [branches, setBranches] = useState([])
    const [selectedBranchId, setSelectedBranchId] = useState("")
    const [rooms, setRooms] = useState([])
    const [trainers, setTrainers] = useState([])

    useEffect(() => {
        if (visible && classData?.classId) {
            setIsEditing(false)
            fetchDetail()
        }
    }, [visible, classData])

    const fetchDetail = async () => {
        setLoading(true)
        try {
            const data = await getClassById(classData.classId)
            setDetail(data)
        } catch (error) {
            console.error("Failed to fetch class detail", error)
        } finally {
            setLoading(false)
        }
    }

    const loadBranches = async () => {
        try {
            const data = await getBranches()
            setBranches(data)
        } catch (error) {
            console.error("Failed to load branches", error)
        }
    }

    useEffect(() => {
        if (selectedBranchId) {
            const loadBranchDetails = async () => {
                try {
                    const data = await getBranchById(selectedBranchId)
                    setRooms(data.rooms || [])
                    setTrainers(data.staffs || [])
                } catch (error) {
                    console.error("Failed to load branch details", error)
                }
            }
            loadBranchDetails()
        } else {
            setRooms([])
            setTrainers([])
        }
    }, [selectedBranchId])

    const handleEditClick = () => {
        setFormData({
            title: detail.title || "",
            description: detail.description || "",
            date: moment(detail.date).format("YYYY-MM-DD"),
            startTime: detail.startTime,
            endTime: detail.endTime,
            classType: detail.classType || "Yoga",
            capacity: detail.capacity || 20,
            minCapacity: detail.minCapacity || 5,
            trainerStaffId: detail.trainerStaffId || "",
            roomId: detail.roomId || ""
        })
        setSelectedBranchId(detail.branchId || "")
        loadBranches()
        setIsEditing(true)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleBranchChange = (e) => {
        setSelectedBranchId(e.target.value)
        setFormData(prev => ({ ...prev, roomId: "", trainerStaffId: "" }))
    }

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10) || 0,
                minCapacity: parseInt(formData.minCapacity, 10) || 0,
                startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
                endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime
            }
            await updateClass(detail.classId, payload)
            setIsEditing(false)
            fetchDetail()
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to update class", error)
            alert("Lỗi cập nhật lớp học: Kiểm tra lại dữ liệu hoặc xung đột lịch.")
        }
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value
        try {
            await updateClassStatus(classData.classId, newStatus)
            fetchDetail()
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to update status", error)
        }
    }

    const handleDelete = async () => {
        if (confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
            try {
                await deleteClass(classData.classId)
                setVisible(false)
                if (onRefresh) onRefresh()
            } catch (error) {
                console.error("Failed to delete class", error)
                alert("Không thể xóa lớp học (có thể do đã có hội viên đăng ký hoặc đã hoàn thành).")
            }
        }
    }

    if (!classData) return null

    return (
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg" backdrop="static">
            <CModalHeader>
                <CModalTitle>{isEditing ? "Chỉnh Sửa Lớp Học" : "Chi Tiết Lớp Học"}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                ) : detail && !isEditing ? (
                    <div>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h4 className="fw-bold mb-1">{detail.title}</h4>
                                <p className="text-muted mb-0">{detail.classType}</p>
                            </div>
                            <CBadge color={
                                detail.status === 'Completed' ? 'success' :
                                detail.status === 'Cancelled' ? 'danger' :
                                detail.status === 'InProgress' ? 'warning' : 'primary'
                            } shape="rounded-pill">
                                {detail.status}
                            </CBadge>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <strong>Thời gian:</strong><br />
                                {moment(detail.date).format("DD/MM/YYYY")} | {detail.startTime} - {detail.endTime}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Phòng tập:</strong><br />
                                {detail.roomName || "N/A"} ({detail.branchName || "N/A"})
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Huấn luyện viên:</strong><br />
                                {detail.trainerName || "N/A"}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Sức chứa:</strong><br />
                                {detail.bookedCount} / {detail.capacity} (Tối thiểu: {detail.minCapacity})
                                {detail.isFull && <span className="text-danger ms-2 fw-bold">(Đã đầy)</span>}
                            </div>
                            <div className="col-12 mb-3">
                                <strong>Mô tả:</strong><br />
                                {detail.description || "Không có mô tả."}
                            </div>
                        </div>

                        <h5 className="mb-3 border-bottom pb-2">Đổi trạng thái</h5>
                        <div className="d-flex align-items-center mb-4">
                            <CFormSelect value={detail.status} onChange={handleStatusChange} style={{ maxWidth: '200px' }}>
                                <option value="Scheduled">Scheduled</option>
                                <option value="InProgress">InProgress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </CFormSelect>
                            <span className="ms-3 text-muted small">* Trạng thái sẽ cập nhật ngay lập tức.</span>
                        </div>
                    </div>
                ) : detail && isEditing ? (
                    <div className="row g-3">
                        <div className="col-md-8">
                            <CFormInput label="Tên lớp học" name="title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <CFormSelect label="Loại lớp" name="classType" value={formData.classType} onChange={handleChange}>
                                <option value="Yoga">Yoga</option>
                                <option value="Zumba">Zumba</option>
                                <option value="Pilates">Pilates</option>
                                <option value="Boxing">Boxing</option>
                                <option value="Crossfit">Crossfit</option>
                            </CFormSelect>
                        </div>
                        <div className="col-md-4">
                            <CFormInput type="date" label="Ngày" name="date" value={formData.date} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <CFormInput type="time" label="Giờ bắt đầu" name="startTime" value={formData.startTime} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <CFormInput type="time" label="Giờ kết thúc" name="endTime" value={formData.endTime} onChange={handleChange} />
                        </div>
                        <div className="col-12">
                            <CFormSelect label="Chi nhánh" value={selectedBranchId} onChange={handleBranchChange}>
                                <option value="">-- Chọn chi nhánh --</option>
                                {branches.map(b => (
                                    <option key={b.branchId || b.id} value={b.branchId || b.id}>{b.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="col-md-6">
                            <CFormSelect label="Huấn luyện viên" name="trainerStaffId" value={formData.trainerStaffId} onChange={handleChange} disabled={!selectedBranchId}>
                                <option value="">-- Chọn HLV --</option>
                                {trainers.map(t => (
                                    <option key={t.userId || t.staffId || t.id} value={t.userId || t.staffId || t.id}>{t.fullName || t.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="col-md-6">
                            <CFormSelect label="Phòng tập" name="roomId" value={formData.roomId} onChange={handleChange} disabled={!selectedBranchId}>
                                <option value="">-- Chọn Phòng --</option>
                                {rooms.map(r => (
                                    <option key={r.roomId || r.id} value={r.roomId || r.id}>{r.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="col-md-6">
                            <CFormInput type="number" label="Sức chứa tối đa" name="capacity" value={formData.capacity} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <CFormInput type="number" label="Tối thiểu để mở lớp" name="minCapacity" value={formData.minCapacity} onChange={handleChange} />
                        </div>
                        <div className="col-12">
                            <CFormTextarea label="Mô tả" name="description" rows="3" value={formData.description} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-danger">Không tìm thấy thông tin chi tiết.</div>
                )}
            </CModalBody>
            <CModalFooter>
                {!isEditing ? (
                    <>
                        <CButton color="danger" variant="outline" className="me-auto" onClick={handleDelete}>Xóa Lớp</CButton>
                        {detail?.status !== 'Completed' && (
                            <CButton color="warning" onClick={handleEditClick}>Sửa thông tin</CButton>
                        )}
                        <CButton color="secondary" onClick={() => setVisible(false)}>Đóng</CButton>
                    </>
                ) : (
                    <>
                        <CButton color="secondary" onClick={() => setIsEditing(false)}>Hủy</CButton>
                        <CButton color="success" className="text-white" onClick={handleSave}>Lưu Thay Đổi</CButton>
                    </>
                )}
            </CModalFooter>
        </CModal>
    )
}

export default ClassDetailModal
