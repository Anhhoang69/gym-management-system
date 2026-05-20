import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput,
    CFormSelect,
    CFormTextarea
} from "@coreui/react"
import { useState, useEffect } from "react"
import moment from "moment"
import { createClass } from "../../services/classService"
import { getBranches, getBranchById } from "../../services/branchService"

function CreateClassModal({ visible, setVisible, selectedSlot, onRefresh, fixedBranchId }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        classType: "Yoga",
        capacity: 20,
        minCapacity: 5,
        trainerStaffId: "",
        roomId: ""
    })

    const [branches, setBranches] = useState([])
    const [selectedBranchId, setSelectedBranchId] = useState("")
    const [rooms, setRooms] = useState([])
    const [trainers, setTrainers] = useState([])

    useEffect(() => {
        if (visible) {
            if (fixedBranchId) {
                setSelectedBranchId(fixedBranchId)
            } else {
                loadBranches()
            }
        }
    }, [visible, fixedBranchId])

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
                    setFormData(prev => ({ ...prev, roomId: "", trainerStaffId: "" }))
                } catch (error) {
                    console.error("Failed to load branch details", error)
                }
            }
            loadBranchDetails()
        } else {
            setRooms([])
            setTrainers([])
            setFormData(prev => ({ ...prev, roomId: "", trainerStaffId: "" }))
        }
    }, [selectedBranchId])

    useEffect(() => {
        if (selectedSlot && visible) {
            setFormData(prev => ({
                ...prev,
                date: moment(selectedSlot.start).format("YYYY-MM-DD"),
                startTime: moment(selectedSlot.start).format("HH:mm"),
                endTime: moment(selectedSlot.end).format("HH:mm")
            }))
        } else if (visible) {
            setFormData({
                title: "",
                description: "",
                date: moment().format("YYYY-MM-DD"),
                startTime: moment().format("HH:mm"),
                endTime: moment().add(1, 'hour').format("HH:mm"),
                classType: "Yoga",
                capacity: 20,
                minCapacity: 5,
                trainerStaffId: "",
                roomId: ""
            })
            setSelectedBranchId(fixedBranchId || "")
        }
    }, [selectedSlot, visible, fixedBranchId])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10) || 0,
                minCapacity: parseInt(formData.minCapacity, 10) || 0,
                // Đảm bảo format time là HH:mm:ss nếu backend yêu cầu chuẩn TimeSpan
                startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
                endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime
            }
            await createClass(payload)
            setVisible(false)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to create class", error)
            alert("Lỗi tạo lớp học: Kiểm tra lại dữ liệu hoặc xung đột lịch trùng HLV/Phòng.")
        }
    }

    return (
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg" backdrop="static">
            <CModalHeader>
                <CModalTitle>Tạo Lớp Học Mới</CModalTitle>
            </CModalHeader>
            <CModalBody>
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
                        <CFormSelect 
                            label="Chi nhánh" 
                            value={selectedBranchId} 
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            disabled={!!fixedBranchId}
                        >
                            <option value="">-- Chọn chi nhánh --</option>
                            {branches.map(b => (
                                <option key={b.branchId || b.id} value={b.branchId || b.id}>{b.name}</option>
                            ))}
                        </CFormSelect>
                    </div>

                    <div className="col-md-6">
                        <CFormSelect 
                            label="Huấn luyện viên" 
                            name="trainerStaffId" 
                            value={formData.trainerStaffId} 
                            onChange={handleChange}
                            disabled={!selectedBranchId}
                        >
                            <option value="">-- Chọn HLV --</option>
                            {trainers.map(t => (
                                <option key={t.userId || t.staffId || t.id} value={t.userId || t.staffId || t.id}>{t.fullName || t.name}</option>
                            ))}
                        </CFormSelect>
                    </div>
                    <div className="col-md-6">
                        <CFormSelect 
                            label="Phòng tập" 
                            name="roomId" 
                            value={formData.roomId} 
                            onChange={handleChange}
                            disabled={!selectedBranchId}
                        >
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
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
                <CButton color="warning" onClick={handleSubmit}>Tạo Lớp</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default CreateClassModal
