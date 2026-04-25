import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CFormCheck,
  CButton
} from "@coreui/react"

import { Dumbbell, Users, Calendar, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logo from "../../../assets/LogoBlackText.svg"
import { useState } from "react"
import api from "../api/api"

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await api.post("/api/auth/login", {
        emailOrPhone,
        password
      })

      const response = res.data

      if (!response.success) {
        setError(response.message || "Đăng nhập thất bại")
        return
      }

      const data = response.data

      // 👉 OTP
      if (data.requiresOtp) {
        navigate("/otp", {
          state: { userId: data.userId }
        })
        return
      }

      // 👉 SAVE TOKEN
      localStorage.setItem("token", data.token)

      // 👉 NORMALIZE ROLE (QUAN TRỌNG)
      const roles = (data.roles || []).map(r => r.toUpperCase())

      const user = {
        userId: data.userId,
        email: data.email,
        roles
      }

      localStorage.setItem("user", JSON.stringify(user))

      // 👉 TRIGGER NAVBAR UPDATE
      window.dispatchEvent(new Event("loginSuccess"))

      // 👉 ROUTE THEO ROLE
      if (roles.includes("SUPERADMIN")) {
        navigate("/admin")
      }
      else if (roles.includes("GYMOWNER")) {
        navigate("/owner")
      }
      else if (roles.includes("STAFF")) {
        navigate("/staff")
      }
      else if (roles.includes("MEMBER")) {
        navigate("/")
      }
      else {
        navigate("/login")
      }

    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        alignItems: "center"
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} md={10} lg={9} xl={8}>
            <CCard className="login-card">
              <CRow className="g-0">

                {/* LEFT PANEL */}
                <CCol
                  xs={12}
                  md={6}
                  lg={7}
                  className="left-panel"
                >
                  <div className="logo-container mb-md-4">
                    <img src={logo} alt="EnerGym" className="login-logo" />
                  </div>

                  <div className="left-panel-content d-none d-md-block">
                    <p className="text-muted mb-4">
                      Đăng nhập để tiếp tục hành trình thể dục của bạn.
                    </p>

                    <div className="d-flex align-items-center mb-3">
                      <span className="feature-icon"><Dumbbell size={16} /></span>
                      <span className="ms-3 text-muted">Tập Thông Minh. Luôn Khỏe Mạnh.</span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span className="feature-icon"><Users size={16} /></span>
                      <span className="ms-3 text-muted">Mọi vai trò, một nền tảng.</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="feature-icon"><Calendar size={16} /></span>
                      <span className="ms-3 text-muted">Quản lý phòng gym mọi lúc, mọi nơi.</span>
                    </div>
                  </div>
                </CCol>

                {/* RIGHT PANEL */}
                <CCol xs={12} md={6} lg={5}>
                  <CCardBody className="right-panel-body">
                    <h3 style={{ fontWeight: "bold" }}>
                      Chào Mừng Trở Lại
                    </h3>

                    <p className="text-muted italic">
                      Đăng nhập để tiếp tục hành trình thể dục của bạn.
                    </p>

                    {/* EMAIL */}
                    <div className="mt-4 position-relative">
                      <label style={{ fontWeight: 600 }}>
                        Số điện thoại hoặc Email
                      </label>

                      <Mail size={16} style={{
                        position: "absolute",
                        left: 12,
                        top: 38,
                        color: "#9ca3af"
                      }} />

                      <CFormInput
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Nhập email hoặc số điện thoại"
                        style={{ borderRadius: 8, paddingLeft: 36 }}
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-3 position-relative">
                      <label style={{ fontWeight: 600 }}>
                        Mật khẩu
                      </label>

                      <Lock size={16} style={{
                        position: "absolute",
                        left: 12,
                        top: 38,
                        color: "#9ca3af"
                      }} />

                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: 38,
                          cursor: "pointer",
                          color: "#9ca3af"
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>

                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{
                          borderRadius: 8,
                          paddingLeft: 36,
                          paddingRight: 36
                        }}
                      />
                    </div>

                    {/* ERROR */}
                    {error && (
                      <p style={{ color: "red", marginTop: 10 }}>
                        {error}
                      </p>
                    )}

                    {/* OPTIONS */}
                    <div className="d-flex justify-content-between mt-4">
                      <CFormCheck label="Ghi nhớ đăng nhập" />
                      <a href="#" style={{
                        fontSize: 14,
                        color: "#f4b400",
                        textDecoration: "none"
                      }}>
                        Quên mật khẩu?
                      </a>
                    </div>

                    {/* LOGIN BUTTON */}
                    <CButton
                      className="mt-4"
                      onClick={handleLogin}
                      disabled={loading}
                      style={{
                        width: "100%",
                        background: "#ffc107",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 600,
                        padding: "10px 0"
                      }}
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </CButton>

                    {/* REGISTER */}
                    <p className="text-center mt-3 italic">
                      Chưa có tài khoản?
                      <a href="#" style={{
                        marginLeft: 6,
                        color: "#f4b400",
                        textDecoration: "none"
                      }}>
                        Tạo tài khoản
                      </a>
                    </p>

                  </CCardBody>
                </CCol>

              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .feature-icon {
          width: 32px;
          height: 32px;
          background: #fff7e6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f4b400;
          flex-shrink: 0;
        }

        .btn:hover {
          background: #e0a800 !important;
        }

        .login-card {
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          overflow: hidden;
          margin: 20px 0;
        }

        .left-panel {
          background: linear-gradient(135deg, #f6e7a9 0%, #fcf9ee 45%, #ffffff 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .login-logo {
          height: 72px;
        }

        /* Mobile (Smartphones) */
        @media (max-width: 767px) {
          .left-panel {
            padding: 32px 24px;
            align-items: center;
            text-align: center;
          }
          .right-panel-body {
            padding: 32px 24px;
          }
          .login-logo {
            height: 56px;
          }
        }

        /* Tablet (iPads, etc) */
        @media (min-width: 768px) and (max-width: 991px) {
          .left-panel {
            padding: 32px;
          }
          .right-panel-body {
            padding: 32px;
          }
          .login-logo {
            height: 64px;
          }
        }

        /* Desktop */
        @media (min-width: 992px) {
          .left-panel {
            padding: 48px;
          }
          .right-panel-body {
            padding: 48px;
          }
          .login-logo {
            height: 72px;
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage