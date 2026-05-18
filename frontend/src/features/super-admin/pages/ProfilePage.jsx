import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CAvatar,
  CBadge
} from "@coreui/react"
import { cilLockLocked, cilUser, cilEnvelopeOpen, cilPhone, cilCameraControl } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

function ProfilePage() {
  const [user, setUser] = useState({
    fullName: "Quản Trị Viên",
    email: "admin@energym.vn",
    phone: "0987654321",
    role: "Administrator",
    avatar: "https://i.pravatar.cc/150"
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Simulated effect to grab from localStorage if it exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser({
          ...user,
          ...parsed
        })
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    alert("Cập nhật thông tin thành công!")
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!")
      return
    }
    alert("Đổi mật khẩu thành công!")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  return (
    <div className="container-fluid p-0 d-flex flex-column" style={{ height: "calc(100vh - 120px)" }}>
      <div className="mb-3 flex-shrink-0">
        <h3 className="fw-bold mb-1">Hồ Sơ Cá Nhân</h3>
      </div>

      <CRow className="flex-grow-1 overflow-hidden m-0">
        {/* LEFT COLUMN: Avatar & Quick Info */}
        <CCol md={4} className="mb-0 h-100 p-0 pe-md-3">
          <CCard className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div
              style={{
                height: "120px",
                background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
              }}
            ></div>
            <CCardBody className="text-center position-relative pb-4">
              <div
                className="position-relative d-inline-block"
                style={{ marginTop: "-60px", marginBottom: "15px" }}
              >
                <CAvatar
                  src={user.avatar}
                  size="xl"
                  style={{ width: "120px", height: "120px", border: "4px solid white", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                />
                <button
                  className="btn btn-warning rounded-circle position-absolute bottom-0 end-0 p-2 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px", transform: "translate(10%, -10%)" }}
                  title="Thay đổi ảnh đại diện"
                >
                  <CIcon icon={cilCameraControl} className="text-white" />
                </button>
              </div>

              <h4 className="fw-bold mb-1">{user.fullName}</h4>
              <p className="text-muted mb-3">{user.email}</p>

              <CBadge color="primary" shape="rounded-pill" className="px-3 py-2 fs-6 mb-4">
                {user.role}
              </CBadge>

              <div className="d-flex justify-content-center gap-4 text-start mt-2 border-top pt-4 px-3">
                <div>
                  <div className="text-muted small mb-1">Tình trạng</div>
                  <div className="fw-semibold text-success d-flex align-items-center gap-1">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2eb85c', display: 'inline-block' }}></span>
                    Đang hoạt động
                  </div>
                </div>
                <div>
                  <div className="text-muted small mb-1">Ngày tham gia</div>
                  <div className="fw-semibold">12/04/2026</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* RIGHT COLUMN: Forms */}
        <CCol md={8} className="h-100 overflow-auto p-0 ps-md-2 pe-1" style={{ paddingBottom: '20px' }}>
          {/* General Info Form */}
          <CCard className="border-0 shadow-sm rounded-4 mb-4">
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-2 d-flex align-items-center gap-1">
                <CIcon icon={cilUser} className="text-warning" />
                Thông tin chung
              </h5>

              <CForm onSubmit={handleUpdateProfile}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      label="Họ và tên"
                      value={user.fullName}
                      onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label="Vai trò"
                      value={user.role}
                      disabled
                      readOnly
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormInput
                      label={
                        <span className="d-flex align-items-center gap-2">
                          <CIcon icon={cilEnvelopeOpen} size="sm" /> Email
                        </span>
                      }
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      label={
                        <span className="d-flex align-items-center gap-2">
                          <CIcon icon={cilPhone} size="sm" /> Số điện thoại
                        </span>
                      }
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </CCol>
                </CRow>

                <div className="text-end">
                  <CButton color="warning" type="submit" className="px-4 fw-semibold">
                    Cập nhật thông tin
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>

          {/* Security Form */}
          <CCard className="border-0 shadow-sm rounded-4 mb-3">
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <CIcon icon={cilLockLocked} className="text-danger" />
                Bảo mật & Mật khẩu
              </h5>

              <CForm onSubmit={handleUpdatePassword}>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="password"
                      label="Mật khẩu hiện tại"
                      placeholder="Nhập mật khẩu cũ..."
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormInput
                      type="password"
                      label="Mật khẩu mới"
                      placeholder="Nhập mật khẩu mới..."
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="password"
                      label="Xác nhận mật khẩu mới"
                      placeholder="Nhập lại mật khẩu mới..."
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </CCol>
                </CRow>

                <div className="text-end">
                  <CButton color="dark" type="submit" className="px-4 fw-semibold">
                    Đổi mật khẩu
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ProfilePage
