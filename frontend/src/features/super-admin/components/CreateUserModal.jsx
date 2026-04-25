import {
  CButton,
  CFormInput,
  CFormSelect,
  CRow,
  CCol
} from "@coreui/react"

import { useState, useEffect } from "react"
import { createUser } from "../services/userService"
import { getBranches } from "../services/branchService"

function CreateUserModal({ visible, setVisible, onCreated }) {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    staffPosition: "",
    branchId: "",
    gender: "",
    birthday: "",
    address: "",

    trainerProfile: {
      experienceYears: "",
      specialization: "",
      certificate: "",
      bioDescription: ""
    }
  })

  const [errors, setErrors] = useState({})
  const [branches, setBranches] = useState([])

  // ================= FETCH BRANCH =================
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getBranches("", "")
        setBranches(res.items || res)
      } catch (e) {
        console.error("Fetch branches error:", e)
      }
    }

    fetchBranches()
  }, [])

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,

      // chỉ reset staffPosition khi KHÔNG phải staff
      ...(name === "role" && value !== "Staff"
        ? { staffPosition: "" }
        : {})
    }))
  }

  const handleTrainerChange = (e) => {
    setForm(prev => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        [e.target.name]: e.target.value
      }
    }))
  }

  const isStaff = form.role && form.role !== "Member"
  const isTrainer = ["PT", "HeadPT"].includes(form.staffPosition)

  // ================= VALIDATION =================
  const validate = () => {
    const err = {}

    if (!form.fullName) err.fullName = "Required"
    if (!form.email) err.email = "Required"
    if (!form.password) err.password = "Required"
    if (!form.role) err.role = "Required"

    // 🔥 branch luôn required
    if (!form.branchId) err.branchId = "Required"

    if (isStaff && !form.staffPosition) {
      err.staffPosition = "Required"
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        role: form.role === "Member" ? "Member" : form.staffPosition,
        branchId: form.branchId, // 🔥 không cho null nữa
        gender: form.gender || null,
        birthday: form.birthday || null,
        address: form.address || null
      }

      console.log("CREATE USER PAYLOAD:", payload)

      const user = await createUser(payload)

      onCreated?.(user)
      setVisible(false)

    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {visible && (
        <div
          onClick={() => setVisible(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1040
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "40vw",
          minWidth: "420px",
          height: "100vh",
          background: "#fff",
          zIndex: 1050,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "0.3s",
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* HEADER */}
        <div className="p-3 border-bottom d-flex justify-content-between">
          <div className="fw-bold">Tạo người dùng</div>
          <button onClick={() => setVisible(false)}>×</button>
        </div>

        {/* BODY */}
        <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>

          {/* GENERAL */}
          <h6 className="fw-bold mb-2">Thông tin cá nhân</h6>
          <CRow className="g-2">

            <CCol md={12}>
              <CFormInput label="Họ tên" name="fullName"
                value={form.fullName}
                onChange={handleChange}
                invalid={!!errors.fullName}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput label="Email" name="email"
                value={form.email}
                onChange={handleChange}
                invalid={!!errors.email}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput type="password" label="Mật khẩu"
                name="password"
                value={form.password}
                onChange={handleChange}
                invalid={!!errors.password}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput label="SĐT" name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormSelect label="Giới tính" name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Chọn</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </CFormSelect>
            </CCol>

            <CCol md={12}>
              <CFormInput type="date" label="Ngày sinh"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput label="Địa chỉ"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          {/* ROLE */}
          <h6 className="fw-bold mt-4 mb-2">Phân quyền</h6>
          <CRow className="g-2">

            <CCol md={12}>
              <CFormSelect label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                invalid={!!errors.role}
              >
                <option value="">Chọn</option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="BranchAdmin">Branch Admin</option>
                <option value="Member">Member</option>
                <option value="Staff">Staff</option>
              </CFormSelect>
            </CCol>

            {/* 🔥 LUÔN HIỂN THỊ BRANCH */}
            <CCol md={12}>
              <CFormSelect
                label="Chi nhánh"
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                invalid={!!errors.branchId}
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map((b) => (
                  <option key={b.branchId} value={b.branchId}>
                    {b.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {isStaff && (
              <CCol md={12}>
                <CFormSelect label="Chức vụ"
                  name="staffPosition"
                  value={form.staffPosition}
                  onChange={handleChange}
                  invalid={!!errors.staffPosition}
                >
                  <option value="">Chọn</option>
                  <option value="BranchAdmin">Branch Admin</option>
                  <option value="PT">PT</option>
                  <option value="HeadPT">Head PT</option>
                  <option value="Sales">Sales</option>
                  <option value="Receptionist">Receptionist</option>
                </CFormSelect>
              </CCol>
            )}

          </CRow>

        </div>

        {/* FOOTER */}
        <div className="p-3 border-top d-flex justify-content-end gap-2">
          <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
          <CButton color="warning" onClick={handleSubmit}>Tạo</CButton>
        </div>

      </div>
    </>
  )
}

export default CreateUserModal