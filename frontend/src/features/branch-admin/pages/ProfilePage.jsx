import { useState, useEffect, useRef } from "react"
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CAvatar,
  CBadge,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CToast,
  CToastBody,
  CToaster
} from "@coreui/react"
import { cilLockLocked, cilUser, cilEnvelopeOpen, cilPhone, cilCameraControl, cilMonitor, cilX } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { getMyProfile, updateMyProfile, getLoginHistory, revokeSession, uploadImage } from "../../super-admin/services/profileService"

function ProfilePage() {
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState(1)
  const [toast, setToast] = useState(null)

  const showNotification = (message, color = "success") => {
    setToast(
      <CToast visible={true} autohide={true} delay={3000} color={color} className="text-white" onClose={() => setToast(null)}>
        <CToastBody className="fw-semibold">{message}</CToastBody>
      </CToast>
    )
  }
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    birthday: "",
    address: "",
    avatarUrl: "https://i.pravatar.cc/150",
    languagePreference: "Vietnamese",
    role: "Administrator"
  })
  
  const [sessions, setSessions] = useState([])

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (activeTab === 3) {
      fetchSessions()
    }
  }, [activeTab])

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile()
      if (data) {
        setUser(prev => ({
          ...prev,
          ...data,
          birthday: data.birthday ? data.birthday.split('T')[0] : "",
        }))
      }
    } catch (e) {
      console.error("Lỗi khi tải thông tin", e)
    }
  }

  const fetchSessions = async () => {
    try {
      const data = await getLoginHistory({ page: 1, pageSize: 20 })
      if (data && data.items) {
        setSessions(data.items)
      }
    } catch (e) {
      console.error("Lỗi khi tải phiên đăng nhập", e)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await updateMyProfile({
        fullName: user.fullName,
        gender: user.gender,
        birthday: user.birthday || null,
        address: user.address,
        avatarUrl: user.avatarUrl,
        languagePreference: user.languagePreference
      })
      showNotification("Cập nhật thông tin thành công!")
      window.dispatchEvent(new Event("userProfileUpdated"))
      fetchProfile()
    } catch (e) {
      showNotification("Lỗi khi cập nhật thông tin", "danger")
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const uploadedUrl = await uploadImage(file)
      if (uploadedUrl) {
        await updateMyProfile({
          fullName: user.fullName,
          gender: user.gender,
          birthday: user.birthday || null,
          address: user.address,
          avatarUrl: uploadedUrl,
          languagePreference: user.languagePreference
        })
        setUser(prev => ({
          ...prev,
          avatarUrl: uploadedUrl
        }))
        showNotification("Cập nhật ảnh đại diện thành công!")
        window.dispatchEvent(new Event("userProfileUpdated"))
      }
    } catch (err) {
      console.error("Lỗi upload ảnh", err)
      showNotification("Lỗi khi upload ảnh!", "danger")
    }
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp!", "danger")
      return
    }
    // TODO: implement change password API
    showNotification("Đổi mật khẩu thành công!")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }
  
  const handleRevokeSession = async (id) => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất thiết bị này?")) return
    try {
      await revokeSession(id)
      fetchSessions()
      showNotification("Đã thu hồi phiên đăng nhập.")
    } catch (e) {
      showNotification("Lỗi khi thu hồi phiên.", "danger")
    }
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
            <CCardBody className="text-center position-relative pb-4 d-flex flex-column">
              <div
                className="position-relative d-inline-block flex-shrink-0"
                style={{ marginTop: "-60px", marginBottom: "15px", width: "120px", height: "120px" }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <img
                  src={user.avatarUrl || user.avatar || "https://i.pravatar.cc/150"}
                  alt="Avatar"
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    borderRadius: "50%", 
                    border: "4px solid white", 
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)", 
                    objectFit: "cover", 
                    backgroundColor: "white",
                    display: "block"
                  }}
                />
                <button
                  className="btn btn-warning rounded-circle position-absolute bottom-0 end-0 p-2 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px", transform: "translate(10%, -10%)" }}
                  title="Thay đổi ảnh đại diện"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CIcon icon={cilCameraControl} className="text-white" />
                </button>
              </div>

              <h4 className="fw-bold mb-1 flex-shrink-0">{user.fullName || "Tên chưa cập nhật"}</h4>
              <p className="text-muted mb-3 flex-shrink-0">{user.email}</p>

              <div className="flex-shrink-0 mb-auto">
                <CBadge color="primary" shape="rounded-pill" className="px-3 py-2 fs-6">
                  {user.role}
                </CBadge>
              </div>

              <div className="d-flex justify-content-center gap-4 text-start mt-4 border-top pt-4 px-3 flex-shrink-0">
                <div>
                  <div className="text-muted small mb-1">Tình trạng</div>
                  <div className="fw-semibold text-success d-flex align-items-center gap-1">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2eb85c', display: 'inline-block' }}></span>
                    Đang hoạt động
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* RIGHT COLUMN: Forms */}
        <CCol md={8} className="h-100 d-flex flex-column p-0 ps-md-2 pe-1">
          <CNav variant="pills" className="mb-3">
            <CNavItem>
              <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} style={{ cursor: 'pointer' }}>
                <CIcon icon={cilUser} className="me-2" /> Thông tin chung
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)} style={{ cursor: 'pointer' }}>
                <CIcon icon={cilLockLocked} className="me-2" /> Bảo mật
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)} style={{ cursor: 'pointer' }}>
                <CIcon icon={cilMonitor} className="me-2" /> Phiên đăng nhập
              </CNavLink>
            </CNavItem>
          </CNav>

          <CCard className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
            <CCardBody className="p-4 overflow-auto custom-scrollbar h-100">
              <CTabContent>
                <CTabPane visible={activeTab === 1}>
                  <h5 className="fw-bold mb-4">Thông tin cá nhân</h5>
                  <CForm onSubmit={handleUpdateProfile}>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormInput
                          label="Họ và tên"
                          value={user.fullName || ""}
                          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect
                          label="Giới tính"
                          value={user.gender || "Male"}
                          onChange={(e) => setUser({ ...user, gender: e.target.value })}
                        >
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                          <option value="Other">Khác</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormInput
                          label="Ngày sinh"
                          type="date"
                          value={user.birthday || ""}
                          onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          label="Số điện thoại"
                          value={user.phoneNumber || ""}
                          disabled
                          readOnly
                          title="Không thể sửa đổi số điện thoại từ đây"
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-4">
                      <CCol md={6}>
                        <CFormInput
                          label="Địa chỉ"
                          value={user.address || ""}
                          onChange={(e) => setUser({ ...user, address: e.target.value })}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect
                          label="Ngôn ngữ ưu tiên"
                          value={user.languagePreference || "Vietnamese"}
                          onChange={(e) => setUser({ ...user, languagePreference: e.target.value })}
                        >
                          <option value="Vietnamese">Tiếng Việt</option>
                          <option value="English">Tiếng Anh</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <div className="text-end">
                      <CButton color="warning" type="submit" className="px-4 fw-semibold text-white">
                        Lưu Thay Đổi
                      </CButton>
                    </div>
                  </CForm>
                </CTabPane>

                <CTabPane visible={activeTab === 2}>
                  <h5 className="fw-bold mb-4">Đổi mật khẩu</h5>
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
                </CTabPane>
                
                <CTabPane visible={activeTab === 3}>
                  <h5 className="fw-bold mb-4">Phiên đăng nhập</h5>
                  <div className="d-flex flex-column gap-3">
                    {sessions.length === 0 ? (
                      <div className="text-muted text-center py-4">Chưa có dữ liệu phiên đăng nhập.</div>
                    ) : (
                      sessions.map(s => (
                        <div key={s.loginHistoryId} className="d-flex align-items-center justify-content-between p-3 border rounded">
                          <div>
                            <div className="fw-semibold">{s.deviceName || "Thiết bị không xác định"}</div>
                            <div className="small text-muted">
                              IP: {s.ipAddress} • Đăng nhập lúc: {new Date(s.loginAt).toLocaleString()}
                            </div>
                            {s.isRevoked && <div className="small text-danger mt-1">Đã thu hồi ({new Date(s.revokedAt).toLocaleString()})</div>}
                          </div>
                          {!s.isRevoked && (
                            <CButton color="danger" variant="ghost" size="sm" onClick={() => handleRevokeSession(s.loginHistoryId)}>
                              <CIcon icon={cilX} className="me-1"/> Đăng xuất
                            </CButton>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CTabPane>

              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #dee2e6;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #adb5bd;
        }
      `}</style>
      <CToaster placement="top-end">
        {toast}
      </CToaster>
    </div>
  )
}

export default ProfilePage
