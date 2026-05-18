import {
  CButton,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBadge
} from "@coreui/react"
import { useState, useEffect } from "react"

function EditUserModal({ visible, setVisible, user, onUpdate }) {

  const [form, setForm] = useState({})
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    if (user) {
      setForm(user)
      setAvatarPreview(user.avatarUrl)
    }
  }, [user])

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleTrainerChange = (e) => {
    setForm(prev => ({
      ...prev,
      trainerProfile: {
        ...(prev.trainerProfile || {}), // FIX null crash
        [e.target.name]: e.target.value
      }
    }))
  }

  const handleSubmit = () => {
    onUpdate(form)
    setVisible(false)
  }

  if (!user) return null

  const isTrainer = ["PT", "HeadPT"].includes(form.staffPosition)

  const renderBranch = () => {
    if (!form.branchName) return "—"

    if (Array.isArray(form.branchName)) {
      return form.branchName.map((b, i) => (
        <CBadge key={i} color="info" className="me-1">{b}</CBadge>
      ))
    }

    return form.branchName
  }

  return (
    <>
      {/* Overlay */}
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

      {/* Drawer */}
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
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* HEADER */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">Chỉnh sửa người dùng</div>
            <div className="text-muted small">{form.role || "—"}</div>
          </div>
          <button onClick={() => setVisible(false)}>×</button>
        </div>

        {/* BODY */}
        <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>

          {/* Avatar */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <img
              src={avatarPreview || "https://i.pravatar.cc/100"}
              style={{ width: 60, height: 60, borderRadius: "50%" }}
            />
            <div>
              <div className="fw-semibold">{form.fullName || "—"}</div>
              <div className="text-muted small">{form.email || "—"}</div>
            </div>
          </div>

          {/* ===== GENERAL ===== */}
          <h6 className="fw-bold mt-3 mb-2">Thông tin cá nhân</h6>
          <CRow className="g-2">

            <CCol md={12}>
              <CFormInput label="Họ tên" name="fullName" value={form.fullName || ""} onChange={handleChange} />
            </CCol>

            <CCol md={12}>
              <CFormInput label="Email" name="email" value={form.email || ""} onChange={handleChange} />
            </CCol>

            <CCol md={12}>
              <CFormInput label="SĐT" name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
            </CCol>

            <CCol md={12}>
              <CFormSelect label="Giới tính" name="gender" value={form.gender || ""} onChange={handleChange}>
                <option value="">Chọn</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </CFormSelect>
            </CCol>

            <CCol md={12}>
              <CFormInput type="date" label="Ngày sinh" name="birthday" value={form.birthday || ""} onChange={handleChange} />
            </CCol>

            <CCol md={12}>
              <CFormInput label="Địa chỉ" name="address" value={form.address || ""} onChange={handleChange} />
            </CCol>

          </CRow>

          {/* ===== SYSTEM ===== */}
          <h6 className="fw-bold mt-4 mb-2">Thông tin hệ thống</h6>
          <CRow className="g-2">

            <CCol md={12}>
              <CFormInput label="Role" value={form.role || "—"} disabled />
            </CCol>

            <CCol md={12}>
              <CFormSelect label="Trạng thái" name="status" value={form.status || ""} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </CFormSelect>
            </CCol>

          </CRow>

          {/* ===== STAFF ===== */}
          {form.isStaff && (
            <>
              <h6 className="fw-bold mt-4 mb-2">Thông tin nhân viên</h6>
              <CRow className="g-2">

                <CCol md={12}>
                  <label className="form-label">Chi nhánh</label>
                  <div>{renderBranch()}</div>
                </CCol>

                <CCol md={12}>
                  <CFormInput label="Chi nhánh ban đầu" value={form.initialBranchId || "—"} disabled />
                </CCol>

                <CCol md={12}>
                  <CFormInput label="Chức vụ" value={form.staffPosition || "—"} disabled />
                </CCol>

              </CRow>
            </>
          )}

          {/* ===== TRAINER ===== */}
          {form.isStaff && isTrainer && (
            <>
              <h6 className="fw-bold mt-4 mb-2">Thông tin PT</h6>
              <CRow className="g-2">

                <CCol md={12}>
                  <CFormInput label="Kinh nghiệm (năm)" name="experienceYears"
                    value={form.trainerProfile?.experienceYears || ""}
                    onChange={handleTrainerChange}
                  />
                </CCol>

                <CCol md={12}>
                  <CFormInput label="Chuyên môn" name="specialization"
                    value={form.trainerProfile?.specialization || ""}
                    onChange={handleTrainerChange}
                  />
                </CCol>

                <CCol md={12}>
                  <CFormInput label="Chứng chỉ" name="certificate"
                    value={form.trainerProfile?.certificate || ""}
                    onChange={handleTrainerChange}
                  />
                </CCol>

                <CCol md={12}>
                  <CFormInput label="Mô tả" name="bioDescription"
                    value={form.trainerProfile?.bioDescription || ""}
                    onChange={handleTrainerChange}
                  />
                </CCol>

              </CRow>
            </>
          )}

          {/* ===== META ===== */}
          <div className="mt-4 text-muted small">
            <div>Tạo: {form.createdAt || "—"}</div>
            <div>Cập nhật: {form.updatedAt || "—"}</div>
            <div>Login: {form.lastLoginAt || "—"}</div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3 border-top d-flex justify-content-end gap-2">
          <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
          <CButton color="warning" onClick={handleSubmit}>Lưu</CButton>
        </div>

      </div>
    </>
  )
}

export default EditUserModal