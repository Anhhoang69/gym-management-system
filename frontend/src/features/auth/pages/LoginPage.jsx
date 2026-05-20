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

import { Dumbbell, Users, Calendar, Mail, Lock, Eye, EyeOff, Sun, Moon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoBlack from "../../../assets/LogoBlackText.svg"
import logoWhite from "../../../assets/LogoWhiteText.svg"
import { useState, useEffect } from "react"
import api from "../../../shared/api/api"

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"))

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

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

      // 👉 NORMALIZE ROLE & STAFF POSITION (QUAN TRỌNG)
      const roles = (data.roles || []).map(r => {
        let roleStr = r.toUpperCase()
        if (roleStr.startsWith("ROLE_")) {
          roleStr = roleStr.substring(5)
        }
        return roleStr
      })

      const staffPosition = data.staffPosition ? data.staffPosition.trim() : null

      let user = {
        userId: data.userId,
        email: data.email,
        roles,
        staffPosition,
        branchId: data.branchId || ""
      }

      localStorage.setItem("user", JSON.stringify(user))

      // 👉 TRIGGER NAVBAR UPDATE
      window.dispatchEvent(new Event("loginSuccess"))

      // 👉 ROUTE THEO ROLE & STAFF POSITION
      if (roles.includes("SUPERADMIN")) {
        navigate("/admin")
      }
      else if (roles.includes("GYMOWNER")) {
        navigate("/owner")
      }
      else if (roles.includes("MEMBER")) {
        navigate("/")
      }
      else {
        // Có thể là STAFF hoặc PT hoặc BRANCHADMIN
        // Vì /api/auth/login đôi khi không trả về chuẩn xác staffPosition, ta gọi /api/me để chắc chắn
        try {
          const meRes = await api.get("/api/me")
          const meData = meRes.data.data || {}

          const meRole = meData.role ? meData.role.toUpperCase() : ""
          const mePos = meData.staffPosition ? meData.staffPosition.toUpperCase() : ""
          const loginPos = staffPosition ? staffPosition.toUpperCase() : ""

          user = {
            ...user,
            branchId: meData.branchId || user.branchId || "",
            fullName: meData.fullName || meData.name || ""
          }
          localStorage.setItem("user", JSON.stringify(user))

          if (meRole === "PT" || meRole === "HEADPT" || mePos === "PT" || mePos === "HEADPT" || loginPos === "PT" || loginPos === "HEADPT" || roles.includes("PT") || roles.includes("HEADPT")) {
            navigate("/pt")
          } else if (mePos === "BRANCHADMIN" || loginPos === "BRANCHADMIN" || roles.includes("BRANCHADMIN") || meRole === "BRANCHADMIN") {
            navigate("/branch-admin")
          } else if (roles.includes("STAFF") || meRole === "STAFF" || mePos === "RECEPTIONIST" || mePos === "SALES") {
            navigate("/staff")
          } else {
            navigate("/login")
          }
        } catch (e) {
          console.error("Failed to verify exact role, fallback to login data", e)
          const loginPos = staffPosition ? staffPosition.toUpperCase() : ""
          if (roles.includes("PT") || roles.includes("HEADPT") || loginPos === "PT" || loginPos === "HEADPT") {
            navigate("/pt")
          } else if (loginPos === "BRANCHADMIN" || roles.includes("BRANCHADMIN")) {
            navigate("/branch-admin")
          } else if (roles.includes("STAFF")) {
            navigate("/staff")
          } else {
            navigate("/login")
          }
        }
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
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        transition: "background 0.3s ease"
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
                  lg={6}
                  className="left-panel"
                >
                  <div className="logo-container mb-md-4">
                    <img src={isDark ? logoWhite : logoBlack} alt="EnerGym" className="login-logo" />
                  </div>

                  <div className="left-panel-content d-none d-md-block">

                    <div className="d-flex align-items-center mb-3">
                      <span className="feature-icon"><Dumbbell size={16} /></span>
                      <span className="ms-3" style={{ color: "var(--text-secondary)" }}>Tập Thông Minh. Luôn Khỏe Mạnh.</span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span className="feature-icon"><Users size={16} /></span>
                      <span className="ms-3" style={{ color: "var(--text-secondary)" }}>Mọi vai trò, một nền tảng.</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="feature-icon"><Calendar size={16} /></span>
                      <span className="ms-3" style={{ color: "var(--text-secondary)" }}>Quản lý phòng gym mọi lúc, mọi nơi.</span>
                    </div>
                  </div>
                </CCol>

                {/* RIGHT PANEL */}
                <CCol xs={12} md={6} lg={6}>
                  <CCardBody className="right-panel-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h3 style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
                        Chào Mừng Trở Lại
                      </h3>
                      <button
                        onClick={() => document.documentElement.classList.toggle("dark")}
                        className="theme-toggle-btn"
                      >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
                    </div>

                    <p className="italic" style={{ color: "var(--text-secondary)" }}>
                      Đăng nhập để tiếp tục hành trình thể dục của bạn.
                    </p>

                    {/* EMAIL */}
                    <div className="mt-4 position-relative">
                      <label style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        Số điện thoại hoặc Email
                      </label>

                      <Mail size={16} style={{
                        position: "absolute",
                        left: 12,
                        top: 38,
                        color: "var(--text-secondary)"
                      }} />

                      <CFormInput
                        data-testid="login-email-input"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Nhập email hoặc số điện thoại"
                        className="custom-input"
                        style={{ borderRadius: 8, paddingLeft: 36 }}
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-3 position-relative">
                      <label style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        Mật khẩu
                      </label>

                      <Lock size={16} style={{
                        position: "absolute",
                        left: 12,
                        top: 38,
                        color: "var(--text-secondary)"
                      }} />

                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: 38,
                          cursor: "pointer",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>

                      <CFormInput
                        data-testid="login-password-input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="custom-input"
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
                      <CFormCheck label={<span style={{ color: "var(--text-primary)" }}>Ghi nhớ đăng nhập</span>} />
                      <a onClick={() => navigate('/forgot-password')} style={{
                        fontSize: 14,
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        cursor: "pointer"
                      }}>
                        Quên mật khẩu?
                      </a>
                    </div>

                    {/* LOGIN BUTTON */}
                    <CButton
                      data-testid="login-submit-button"
                      className="mt-4 login-submit-btn"
                      onClick={handleLogin}
                      disabled={loading}
                      style={{
                        width: "100%",
                        background: "var(--brand)",
                        color: "var(--on-brand)",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 600,
                        padding: "10px 0"
                      }}
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </CButton>

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
          background: var(--brand);
          opacity: 0.1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
          flex-shrink: 0;
        }
        
        /* Correction for opacity above - make icon itself fully opaque */
        .feature-icon svg {
          opacity: 1;
        }

        .login-submit-btn:hover {
          filter: brightness(0.9);
          background: var(--brand) !important;
        }

        .login-card {
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
          margin: 20px 0;
          background: var(--bg-third);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .left-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-third);
          opacity: 0.85;
          z-index: 0;
        }

        .logo-container, .left-panel-content {
          position: relative;
          z-index: 1;
        }

        .login-logo {
          height: 72px;
          transition: all 0.3s ease;
        }

        .custom-input {
          background: var(--bg) !important;
          border-color: var(--border) !important;
          color: var(--text-primary) !important;
        }

        .custom-input:focus {
          border-color: var(--brand) !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25) !important;
        }

        .theme-toggle-btn {
          background: var(--hover);
          border: none;
          color: var(--text-primary);
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          background: var(--border);
        }

        /* Hide native password reveal button in Edge/IE */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        /* Mobile (Smartphones) */
        @media (max-width: 767px) {
          .left-panel {
            padding: 40px 24px;
            align-items: center;
            text-align: center;
          }
          .right-panel-body {
            padding: 40px 24px;
          }
          .login-logo {
            height: 56px;
          }
        }

        /* Tablet (iPads, etc) */
        @media (min-width: 768px) and (max-width: 1024px) {
          .left-panel {
            padding: 40px;
          }
          .right-panel-body {
            padding: 40px;
          }
          .login-logo {
            height: 64px;
          }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .left-panel {
            padding: 60px;
          }
          .right-panel-body {
            padding: 60px;
          }
          .login-logo {
            height: 80px;
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage