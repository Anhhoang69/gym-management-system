import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput,
    CFormSelect,
    CBadge
} from "@coreui/react"

import { useState, useEffect } from "react"

function BranchDetailModal({
    visible,
    setVisible,
    branch,
    onUpdate,
    onDelete
}) {

    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({})
    const [rooms, setRooms] = useState([])
    const [staffs, setStaffs] = useState([])

    useEffect(() => {


        if (branch) {

            setForm({ ...branch })
            setRooms(branch.rooms || [])
            setStaffs(branch.staffs || [])

        }


    }, [branch])

    if (!branch) return null

    const handleChange = (e) => {


        setForm({
            ...form,
            [e.target.name]: e.target.value
        })


    }

    const handleRoomChange = (index, e) => {


        const newRooms = [...rooms]

        newRooms[index][e.target.name] = e.target.value

        setRooms(newRooms)


    }

    const addRoom = () => {


        setRooms([
            ...rooms,
            {
                name: "",
                capacity: "",
                status: "Active"
            }
        ])


    }

    const deleteRoom = (index) => {


        setRooms(rooms.filter((_, i) => i !== index))


    }

    const handleSave = () => {


        const payload = {
            name: form.name,
            address: form.address,
            email: form.email,
            hotline: form.hotline,
            images: form.images || []
        }

        console.log("UPDATE BRANCH ID:", form.id)
        console.log("PAYLOAD:", payload)

        onUpdate(form.id, payload)

        setEditMode(false)


    }

    return (


        <CModal
            visible={visible}
            fullscreen={true}
            backdrop="static"
            keyboard={false}
            onClose={() => {
                setVisible(false)
                setEditMode(false)
            }}
        >

            <CModalHeader closeButton>

                <CModalTitle>
                    Chi tiết chi nhánh
                </CModalTitle>

            </CModalHeader>

            <CModalBody>

                <img
                    src={branch.image}
                    style={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 12
                    }}
                />

                {/* Branch info */}

                <div className="row mt-4">

                    <div className="col-md-6">

                        <CFormInput
                            label="Tên chi nhánh"
                            name="name"
                            value={form.name || ""}
                            disabled={!editMode}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6">

                        <CFormSelect
                            label="Trạng thái"
                            value={form.status || "active"}
                            disabled
                        >

                            <option value="active">Hoạt động</option>
                            <option value="inactive">Tạm ngưng</option>

                        </CFormSelect>

                    </div>

                    <div className="col-md-12 mt-3">

                        <CFormInput
                            label="Địa chỉ"
                            name="address"
                            value={form.address || ""}
                            disabled={!editMode}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mt-3">

                        <CFormInput
                            label="Email"
                            name="email"
                            value={form.email || ""}
                            disabled={!editMode}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mt-3">

                        <CFormInput
                            label="Hotline"
                            name="hotline"
                            value={form.hotline || ""}
                            disabled={!editMode}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                {/* Stats */}

                <div className="row mt-4">

                    <div className="col-md-4">
                        <p><b>Tổng phòng:</b> {branch.totalRooms}</p>
                    </div>

                    <div className="col-md-4">
                        <p><b>Nhân viên:</b> {branch.totalStaff}</p>
                    </div>

                    <div className="col-md-4">
                        <p><b>Checkin hôm nay:</b> {branch.totalCheckinsToday}</p>
                    </div>

                </div>

                {/* Rooms */}

                <div className="mt-5">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold">
                            Phòng thuộc chi nhánh
                        </h6>
                        <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
                            (Quản lý phòng ở mục riêng)
                        </span>
                    </div>

                    {rooms.length === 0 ? (
                        <p className="text-muted">Không có phòng nào.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Tên phòng</th>
                                    <th>Sức chứa</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room, index) => (
                                    <tr key={room.roomId || index}>
                                        <td>{room.name}</td>
                                        <td>{room.capacity} người</td>
                                        <td>
                                            <CBadge
                                                color={
                                                    room.status === "Active"
                                                        ? "success"
                                                        : room.status === "Maintenance"
                                                        ? "warning"
                                                        : "danger"
                                                }
                                            >
                                                {room.status === "Active" ? "Hoạt động" : room.status === "Maintenance" ? "Bảo trì" : "Ngừng hoạt động"}
                                            </CBadge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Staff */}

                <div className="mt-5">

                    <h6 className="fw-bold mb-3">
                        Nhân viên
                    </h6>

                    {staffs.length === 0 ? (

                        <p className="text-muted">
                            Không có nhân viên
                        </p>

                    ) : (

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Vị trí</th>

                                </tr>

                            </thead>

                            <tbody>

                                {staffs.map(s => (

                                    <tr key={s.userId}>

                                        <td>{s.fullName}</td>
                                        <td>{s.email}</td>
                                        <td>{s.position}</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

                {/* System info */}

                <div className="mt-5">

                    <h6 className="fw-bold mb-3">
                        Thông tin hệ thống
                    </h6>

                    <p>

                        <b>Ngày tạo:</b>{" "}
                        {branch.createdAt &&
                            branch.createdAt !== "0001-01-01T00:00:00"
                            ? new Date(branch.createdAt).toLocaleString()
                            : "Chưa có"}

                    </p>

                </div>

            </CModalBody>

            <CModalFooter>

                {!editMode && (

                    <CButton
                        color="warning"
                        onClick={() => setEditMode(true)}
                    >
                        Chỉnh sửa
                    </CButton>

                )}

                {editMode && (

                    <CButton
                        color="success"
                        onClick={handleSave}
                    >
                        Lưu thay đổi
                    </CButton>

                )}

                {!editMode && (

                    <CButton
                        color="danger"
                        onClick={() => onDelete(branch)}
                    >
                        Xóa chi nhánh
                    </CButton>

                )}

                <CButton
                    color="secondary"
                    onClick={() => {
                        setVisible(false)
                        setEditMode(false)
                    }}
                >
                    Đóng
                </CButton>

            </CModalFooter>

        </CModal>


    )

}

export default BranchDetailModal
