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

function BranchDetailModal({ visible, setVisible, branch }) {

    const [editMode, setEditMode] = useState(false)

    const [form, setForm] = useState({})

    const [rooms, setRooms] = useState([])

    useEffect(() => {

        if (branch) {

            setForm(branch)

            setRooms([
                {
                    id: 1,
                    name: "Cardio Room",
                    room_number: "R1",
                    capacity: 40,
                    status: "active"
                },
                {
                    id: 2,
                    name: "Weight Room",
                    room_number: "R2",
                    capacity: 30,
                    status: "active"
                }
            ])

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
                room_number: "",
                capacity: "",
                status: "active"
            }
        ])

    }

    const deleteRoom = (index) => {

        setRooms(rooms.filter((_, i) => i !== index))

    }

    const handleSave = () => {

        console.log({
            branch: form,
            rooms
        })

        setEditMode(false)

    }

    return (

        <CModal
            visible={visible}
            size="xl"
            onClose={() => setVisible(false)}
        >

            <CModalHeader>

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
                            name="status"
                            value={form.status || "active"}
                            disabled={!editMode}
                            onChange={handleChange}
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

                </div>

                {/* Rooms */}

                <div className="mt-5">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h6 className="fw-bold">

                            Phòng thuộc chi nhánh

                        </h6>

                        {editMode && (

                            <CButton
                                color="warning"
                                size="sm"
                                onClick={addRoom}
                            >

                                + Thêm phòng

                            </CButton>

                        )}

                    </div>

                    <table className="table">

                        <thead>

                            <tr>

                                <th>Tên phòng</th>
                                <th>Số phòng</th>
                                <th>Sức chứa</th>
                                <th>Trạng thái</th>

                                {editMode && <th></th>}

                            </tr>

                        </thead>

                        <tbody>

                            {rooms.map((room, index) => (

                                <tr key={index}>

                                    <td>

                                        {editMode ? (
                                            <input
                                                className="form-control"
                                                name="name"
                                                value={room.name}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        ) : room.name}

                                    </td>

                                    <td>

                                        {editMode ? (
                                            <input
                                                className="form-control"
                                                name="room_number"
                                                value={room.room_number}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        ) : room.room_number}

                                    </td>

                                    <td>

                                        {editMode ? (
                                            <input
                                                className="form-control"
                                                name="capacity"
                                                value={room.capacity}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />
                                        ) : room.capacity}

                                    </td>

                                    <td>

                                        {editMode ? (
                                            <select
                                                className="form-select"
                                                name="status"
                                                value={room.status}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            >
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Tạm ngưng</option>
                                            </select>
                                        ) : (

                                            <CBadge color="success">

                                                Hoạt động

                                            </CBadge>

                                        )}

                                    </td>

                                    {editMode && (

                                        <td>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => deleteRoom(index)}
                                            >

                                                Xóa

                                            </button>

                                        </td>

                                    )}

                                </tr>

                            ))}

                        </tbody>

                    </table>

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

                <CButton
                    color="secondary"
                    onClick={() => setVisible(false)}
                >

                    Đóng

                </CButton>

            </CModalFooter>

        </CModal>

    )

}

export default BranchDetailModal