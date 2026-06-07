import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CBadge,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormInput,
    CAvatar
} from "@coreui/react"
import { useState, useEffect } from "react"
import { getClassMembers, checkInClassMember, updateSessionNote } from "../../super-admin/services/classService"
import moment from "moment"

function PtClassDetailModal({ visible, setVisible, classData, onRefresh }) {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [notes, setNotes] = useState({})
    const [savingNoteId, setSavingNoteId] = useState(null)

    useEffect(() => {
        if (visible && classData?.classId) {
            fetchMembers()
        }
    }, [visible, classData])

    const fetchMembers = async () => {
        setLoading(true)
        try {
            const data = await getClassMembers(classData.classId)
            setMembers(data || [])
            
            // Initialize notes state
            const initialNotes = {}
            if (data) {
                data.forEach(m => {
                    initialNotes[m.memberUserId] = m.sessionNote || ""
                })
            }
            setNotes(initialNotes)
        } catch (error) {
            console.error("Failed to fetch class members", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckIn = async (memberUserId) => {
        try {
            await checkInClassMember(classData.classId, memberUserId)
            // Update local state to reflect check-in without full reload
            setMembers(prev => prev.map(m => 
                m.memberUserId === memberUserId 
                ? { ...m, checkedInAt: new Date().toISOString() } 
                : m
            ))
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to check in", error)
            alert("Lỗi điểm danh.")
        }
    }

    const handleNoteChange = (memberUserId, value) => {
        setNotes(prev => ({ ...prev, [memberUserId]: value }))
    }

    const handleSaveNote = async (memberUserId) => {
        setSavingNoteId(memberUserId)
        try {
            await updateSessionNote(classData.classId, memberUserId, notes[memberUserId])
            // Update local state to reflect new note
            setMembers(prev => prev.map(m => 
                m.memberUserId === memberUserId 
                ? { ...m, sessionNote: notes[memberUserId] } 
                : m
            ))
        } catch (error) {
            console.error("Failed to save note", error)
            alert("Lỗi lưu ghi chú.")
        } finally {
            setSavingNoteId(null)
        }
    }

    if (!classData) return null

    return (
        <CModal visible={visible} onClose={() => setVisible(false)} size="xl" backdrop="static">
            <CModalHeader>
                <CModalTitle>Chi Tiết Lớp: {classData.title}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <p className="text-muted mb-1">{classData.classType} | Phòng: {classData.roomName || "N/A"}</p>
                        <p className="mb-0">
                            <strong>Thời gian:</strong> {moment(classData.date).format("DD/MM/YYYY")} | {classData.startTime} - {classData.endTime}
                        </p>
                    </div>
                    <CBadge color={
                        classData.status === 'Completed' ? 'success' :
                        classData.status === 'Cancelled' ? 'danger' :
                        classData.status === 'InProgress' ? 'warning' : 'primary'
                    } shape="rounded-pill">
                        {classData.status}
                    </CBadge>
                </div>

                <h5 className="mb-3 border-bottom pb-2">Danh sách hội viên ({members.length}/{classData.capacity})</h5>
                
                {loading ? (
                    <div className="text-center py-4">Đang tải danh sách...</div>
                ) : members.length === 0 ? (
                    <div className="text-center py-4 text-muted">Chưa có hội viên nào đăng ký lớp này.</div>
                ) : (
                    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <CTable hover align="middle">
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Hội viên</CTableHeaderCell>
                                    <CTableHeaderCell>Trạng thái Book</CTableHeaderCell>
                                    <CTableHeaderCell>Check-in</CTableHeaderCell>
                                    <CTableHeaderCell>Ghi chú buổi tập</CTableHeaderCell>
                                    <CTableHeaderCell>Thao tác</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {members.map((m) => (
                                    <CTableRow key={m.memberUserId}>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center">
                                                <CAvatar src={m.avatarUrl || "https://ui-avatars.com/api/?name=" + m.memberName} size="md" className="me-2" />
                                                <span className="fw-semibold">{m.memberName}</span>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color={m.bookingStatus === 'Booked' ? 'info' : 'secondary'}>
                                                {m.bookingStatus}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {m.checkedInAt ? (
                                                <span className="text-success fw-bold">✓ Đã đến ({moment(m.checkedInAt).format("HH:mm")})</span>
                                            ) : (
                                                <span className="text-muted">Chưa đến</span>
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center">
                                                <CFormInput 
                                                    size="sm"
                                                    value={notes[m.memberUserId] !== undefined ? notes[m.memberUserId] : ""}
                                                    onChange={(e) => handleNoteChange(m.memberUserId, e.target.value)}
                                                    placeholder="Ghi chú thể lực..."
                                                    style={{ minWidth: '200px' }}
                                                />
                                                <CButton 
                                                    size="sm" 
                                                    color="primary" 
                                                    variant="ghost"
                                                    className="ms-2 px-2"
                                                    onClick={() => handleSaveNote(m.memberUserId)}
                                                    disabled={savingNoteId === m.memberUserId || notes[m.memberUserId] === m.sessionNote}
                                                >
                                                    {savingNoteId === m.memberUserId ? "..." : "Lưu"}
                                                </CButton>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {!m.checkedInAt && (
                                                <CButton 
                                                    size="sm" 
                                                    color="success" 
                                                    className="text-white"
                                                    onClick={() => handleCheckIn(m.memberUserId)}
                                                >
                                                    Điểm danh
                                                </CButton>
                                            )}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>Đóng</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default PtClassDetailModal
