import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CButton
} from "@coreui/react"
import { Dumbbell, Users, Calendar, Mail, Sun, Moon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoBlack from "../../../assets/LogoBlackText.svg"
import logoWhite from "../../../assets/LogoWhiteText.svg"
import { useState, useEffect } from "react"
import { forgotPassword } from "../services/authService"

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"))

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const handleForgot = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const res = await forgotPassword({ emailOrPhone })

      if (!res.success) {
        setError(res.message || "Yêu cầu thất bại")
        return
      }

      setSuccess("Mã OTP đã được gửi đến email/số điện thoại của bạn.")
      
      // Đợi 2 giây rồi chuyển sang trang reset password
      setTimeout(() => {
        navigate("/reset-password", {
          state: { emailOrPhone }
        })
      }, 2000)

    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi gửi yêu cầu. Vui lòng kiểm tra lại thông tin.")
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
                        Quên Mật Khẩu
                      </h3>
                      <button
                        onClick={() => document.documentElement.classList.toggle("dark")}
                        className="theme-toggle-btn"
                      >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
                    </div>

                    <p className="italic" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 8 }}>
                      Nhập email hoặc số điện thoại đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                    </p>

                    {/* EMAIL OR PHONE */}
                    <div className="mt-4 position-relative">
                      <label style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        Email hoặc Số điện thoại
                      </label>

                      <Mail size={16} style={{
                        position: "absolute",
                        left: 12,
                        top: 38,
                        color: "var(--text-secondary)"
                      }} />

                      <CFormInput
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Nhập email hoặc SĐT"
                        className="custom-input"
                        style={{ borderRadius: 8, paddingLeft: 36 }}
                      />
                    </div>

                    {/* ERROR */}
                    {error && (
                      <p style={{ color: "red", marginTop: 10, fontSize: "0.9rem" }}>
                        {error}
                      </p>
                    )}

                    {/* SUCCESS */}
                    {success && (
                      <p style={{ color: "green", marginTop: 10, fontSize: "0.9rem" }}>
                        {success}
                      </p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <CButton
                      className="mt-4 login-submit-btn"
                      onClick={handleForgot}
                      disabled={loading || !emailOrPhone}
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
                      {loading ? "Đang gửi..." : "Gửi mã OTP"}
                    </CButton>
                    
                    <div className="text-center mt-3">
                      <a onClick={() => navigate('/login')} style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        cursor: "pointer"
                      }}>
                        Quay lại đăng nhập
                      </a>
                    </div>

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

export default ForgotPasswordPage
