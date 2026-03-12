import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput,
    CFormSelect,
    CFormCheck
} from "@coreui/react"

import { useState } from "react"

function CreatePromotionModal({
    visible,
    setVisible,
    onCreate
}) {

    const [form, setForm] = useState({
        name: "",
        code: "",
        type: "Percentage",
        value: "",
        start_date: "",
        end_date: "",
        status: "active",
        is_stackable: false
    })

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        })

    }

    const handleCreate = () => {

        const newPromo = {
            ...form,
            id: Date.now()
        }

        onCreate(newPromo)

        setVisible(false)

        setForm({
            name: "",
            code: "",
            type: "Percentage",
            value: "",
            start_date: "",
            end_date: "",
            status: "active",
            is_stackable: false
        })

    }

    return (

        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
        >

            <CModalHeader>
                <CModalTitle>
                    Tạo khuyến mãi mới
                </CModalTitle>
            </CModalHeader>

            <CModalBody>

                <div className="mb-3">

                    <CFormInput
                        label="Tên khuyến mãi"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <CFormInput
                        label="Mã khuyến mãi"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <CFormSelect
                        label="Loại giảm giá"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >

                        <option value="Percentage">
                            Percentage
                        </option>

                        <option value="Flat Discount">
                            Flat Discount
                        </option>

                    </CFormSelect>

                </div>

                <div className="mb-3">

                    <CFormInput
                        label="Giá trị"
                        name="value"
                        value={form.value}
                        onChange={handleChange}
                    />

                </div>

                <div className="row">

                    <div className="col-md-6">

                        <CFormInput
                            type="date"
                            label="Ngày bắt đầu"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6">

                        <CFormInput
                            type="date"
                            label="Ngày kết thúc"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="mt-3">

                    <CFormSelect
                        label="Trạng thái"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >

                        <option value="active">
                            Active
                        </option>

                        <option value="scheduled">
                            Scheduled
                        </option>

                        <option value="expired">
                            Expired
                        </option>

                    </CFormSelect>

                </div>

                <div className="mt-3">

                    <CFormCheck
                        label="Cho phép cộng dồn khuyến mãi"
                        name="is_stackable"
                        checked={form.is_stackable}
                        onChange={handleChange}
                    />

                </div>

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
                    onClick={handleCreate}
                >
                    Tạo khuyến mãi
                </CButton>

            </CModalFooter>

        </CModal>

    )

}

export default CreatePromotionModal