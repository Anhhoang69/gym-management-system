import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CFormSelect,
    CButton,
    CCard,
    CCardBody
} from "@coreui/react"

import { useState } from "react"

function CreateBranchModal({ visible, setVisible }) {

    const [branch, setBranch] = useState({
        name: "",
        address: "",
        status: "active",
        image: null
    })

    const [rooms, setRooms] = useState([
        {
            name: "",
            room_number: "",
            capacity: "",
            status: "active"
        }
    ])

    const handleBranchChange = (e) => {

        setBranch({
            ...branch,
            [e.target.name]: e.target.value
        })

    }

    const handleImage = (e) => {

        setBranch({
            ...branch,
            image: e.target.files[0]
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

    const removeRoom = (index) => {

        setRooms(rooms.filter((_, i) => i !== index))

    }

    const handleSubmit = () => {

        const payload = {
            branch,
            rooms
        }

        console.log(payload)

        setVisible(false)

    }

    return (

        <CModal visible={visible} size="xl" onClose={() => setVisible(false)}>

            <CModalHeader>
                <CModalTitle>Tạo Chi Nhánh</CModalTitle>
            </CModalHeader>

            <CModalBody>

                {/* Branch image */}

                <div className="mb-4 text-center">

                    <img
                        src="https://placehold.co/120x120"
                        style={{

                            height: 120,
                            borderRadius: 12,
                            objectFit: "cover"
                        }}
                    />

                    <div className="mt-2">

                        <input
                            type="file"
                            onChange={handleImage}
                        />

                    </div>

                </div>

                {/* Branch info */}

                <CCard className="mb-4">

                    <CCardBody>

                        <h6 className="mb-3">Thông tin chi nhánh</h6>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <CFormInput
                                    label="Tên chi nhánh"
                                    name="name"
                                    value={branch.name}
                                    onChange={handleBranchChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <CFormSelect
                                    label="Trạng thái"
                                    name="status"
                                    value={branch.status}
                                    onChange={handleBranchChange}
                                >

                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Tạm ngưng</option>

                                </CFormSelect>

                            </div>

                            <div className="col-md-12">

                                <CFormInput
                                    label="Địa chỉ"
                                    name="address"
                                    value={branch.address}
                                    onChange={handleBranchChange}
                                />

                            </div>

                        </div>

                    </CCardBody>

                </CCard>

                {/* Rooms */}

                <CCard>

                    <CCardBody>

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h6 className="mb-0">Phòng thuộc chi nhánh</h6>

                            <CButton
                                color="warning"
                                size="sm"
                                onClick={addRoom}
                            >
                                + Thêm phòng
                            </CButton>

                        </div>

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>Tên phòng</th>
                                    <th>Số phòng</th>
                                    <th>Sức chứa</th>
                                    <th>Trạng thái</th>
                                    <th></th>

                                </tr>

                            </thead>

                            <tbody>

                                {rooms.map((room, index) => (

                                    <tr key={index}>

                                        <td>

                                            <input
                                                className="form-control"
                                                name="name"
                                                value={room.name}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />

                                        </td>

                                        <td>

                                            <input
                                                className="form-control"
                                                name="room_number"
                                                value={room.room_number}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />

                                        </td>

                                        <td>

                                            <input
                                                className="form-control"
                                                name="capacity"
                                                value={room.capacity}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            />

                                        </td>

                                        <td>

                                            <select
                                                className="form-select"
                                                name="status"
                                                value={room.status}
                                                onChange={(e) => handleRoomChange(index, e)}
                                            >

                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Tạm ngưng</option>

                                            </select>

                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeRoom(index)}
                                            >
                                                Xóa
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </CCardBody>

                </CCard>

            </CModalBody>

            <CModalFooter>

                <CButton
                    color="secondary"
                    onClick={() => setVisible(false)}
                >
                    Hủy
                </CButton>

                <CButton
                    color="warning"
                    onClick={handleSubmit}
                >
                    Tạo chi nhánh
                </CButton>

            </CModalFooter>

        </CModal>

    )

}

export default CreateBranchModal