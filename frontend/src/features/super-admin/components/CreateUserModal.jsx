import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CButton,
    CInputGroup,
    CInputGroupText,
    CToast,
    CToastBody,
    CToaster
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import * as icons from "@coreui/icons"

import { useState } from "react"

function CreateUserModal({ visible, setVisible }) {

    const [showPassword, setShowPassword] = useState(false)

    const [toast, setToast] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        gender: "",
        birthday: "",
        address: "",
        status: "active",
        avatar: null
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {

        const { name, value, files } = e.target

        setForm({
            ...form,
            [name]: files ? files[0] : value
        })
    }

    const validate = () => {

        const newErrors = {}

        if (!form.name) newErrors.name = "Name is required"

        if (!form.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format"
        }

        if (!form.password) {
            newErrors.password = "Password is required"
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (!form.role) newErrors.role = "Role is required"

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        if (!validate()) return

        console.log("Create user payload:", form)

        // TODO: call API here

        setToast(true)

        setVisible(false)
    }

    return (
        <>
            <CModal visible={visible} onClose={() => setVisible(false)} size="lg">

                <CModalHeader>
                    <CModalTitle>Tạo Người Dùng Mới</CModalTitle>
                </CModalHeader>

                <CForm onSubmit={handleSubmit}>
                    <CModalBody>

                        <CRow className="g-3">

                            {/* Name */}
                            <CCol md={6}>
                                <CFormInput
                                    label={
                                        <>
                                            Họ và tên <span className="text-danger">*</span>
                                        </>
                                    }
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    invalid={!!errors.name}
                                    feedback={errors.name}
                                />
                            </CCol>

                            {/* Email */}
                            <CCol md={6}>
                                <CFormInput
                                    label={
                                        <>
                                            Email <span className="text-danger">*</span>
                                        </>
                                    }
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    invalid={!!errors.email}
                                    feedback={errors.email}
                                />
                            </CCol>

                            {/* Password */}
                            <CCol md={6}>
                                <label className="form-label">
                                    Mật khẩu <span className="text-danger">*</span>
                                </label>

                                <CInputGroup>
                                    <CFormInput
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        invalid={!!errors.password}
                                    />

                                    <CInputGroupText
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <CIcon icon={showPassword ? icons.cilViewOff : icons.cilView} />
                                    </CInputGroupText>
                                </CInputGroup>

                                {errors.password && (
                                    <div className="text-danger small mt-1">
                                        {errors.password}
                                    </div>
                                )}
                            </CCol>

                            {/* Phone */}
                            <CCol md={6}>
                                <CFormInput
                                    label="Số điện thoại"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </CCol>

                            {/* Role */}
                            <CCol md={6}>
                                <CFormSelect
                                    label={
                                        <>
                                            Vai trò <span className="text-danger">*</span>
                                        </>
                                    }
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    invalid={!!errors.role}
                                    feedback={errors.role}
                                >
                                    <option value="">Chọn vai trò</option>
                                    <option value="gym_owner">Gym Owner</option>
                                    <option value="branch_admin">Branch Admin</option>
                                    <option value="sales">Sales</option>
                                    <option value="pt">PT</option>
                                    <option value="head_pt">Head PT</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="member">Member</option>
                                </CFormSelect>
                            </CCol>

                            {/* Gender */}
                            <CCol md={6}>
                                <CFormSelect
                                    label="Giới tính"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                </CFormSelect>
                            </CCol>

                            {/* Birthday */}
                            <CCol md={6}>
                                <CFormInput
                                    label="Ngày sinh"
                                    type="date"
                                    name="birthday"
                                    value={form.birthday}
                                    onChange={handleChange}
                                />
                            </CCol>

                            {/* Avatar Upload */}
                            <CCol md={6}>
                                <CFormInput
                                    label="Avatar"
                                    type="file"
                                    name="avatar"
                                    onChange={handleChange}
                                />
                            </CCol>

                            {/* Address */}
                            <CCol md={12}>
                                <CFormInput
                                    label="Địa chỉ"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </CCol>

                        </CRow>

                    </CModalBody>

                    <CModalFooter>

                        <CButton
                            color="secondary"
                            variant="outline"
                            onClick={() => setVisible(false)}
                        >
                            Hủy
                        </CButton>

                        <CButton type="submit" color="warning">
                            Tạo Người Dùng
                        </CButton>

                    </CModalFooter>

                </CForm>

            </CModal>

            {/* Toast */}
            <CToaster placement="top-end">
                {toast && (
                    <CToast visible autohide={true} delay={2000}>
                        <CToastBody>
                            ✅ User created successfully
                        </CToastBody>
                    </CToast>
                )}
            </CToaster>
        </>
    )
}

export default CreateUserModal