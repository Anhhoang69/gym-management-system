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

import logo from "../../../assets/LogoBlackText.svg"

function LoginPage() {
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

          <CCol md={10}>
            <CCard
              style={{
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                overflow: "hidden"
              }}
            >

              <CRow className="g-0">

                {/* LEFT PANEL */}
                <CCol
                  md={7}
                  style={{
                    background: "linear-gradient(100deg,#f6e7a9 0%,#ffffff 100%)",
                    padding: 48,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >

                  {/* LOGO */}
                  <div className="mb-4">
                    <img
                      src={logo}
                      alt="EnerGym"
                      style={{ height: 72 }}
                    />
                  </div>

                  <p className="text-muted mb-4">
                    Đăng nhập để tiếp tục hành trình thể dục của bạn.
                  </p>

                  {/* FEATURES */}

                  <div className="d-flex align-items-center mb-3">
                    <span className="feature-icon">★</span>
                    <span className="ms-3">
                      Tập Thông Minh. Luôn Khỏe Mạnh.
                    </span>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <span className="feature-icon">★</span>
                    <span className="ms-3">
                      Mọi vai trò, một nền tảng.
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="feature-icon">★</span>
                    <span className="ms-3">
                      Quản lý phòng gym mọi lúc, mọi nơi.
                    </span>
                  </div>

                </CCol>

                {/* RIGHT PANEL */}
                <CCol md={5}>
                  <CCardBody style={{ padding: 40 }}>

                    <h3 style={{ fontWeight: "bold" }}>
                      Chào Mừng Trở Lại
                    </h3>

                    <p className="text-muted">
                      Đăng nhập để tiếp tục hành trình thể dục của bạn.
                    </p>

                    {/* EMAIL */}

                    <div className="mt-4">
                      <label>Số điện thoại hoặc Email</label>

                      <CFormInput
                        placeholder="Nhập email hoặc số điện thoại"
                        style={{ borderRadius: 8 }}
                      />
                    </div>

                    {/* PASSWORD */}

                    <div className="mt-3">
                      <label>Mật khẩu</label>

                      <CFormInput
                        type="password"
                        placeholder="Nhập mật khẩu"
                        style={{ borderRadius: 8 }}
                      />
                    </div>

                    {/* OPTIONS */}

                    <div className="d-flex justify-content-between mt-3">

                      <CFormCheck label="Ghi nhớ đăng nhập" />

                      <a
                        href="#"
                        style={{
                          fontSize: 14,
                          color: "#f4b400",
                          textDecoration: "none"
                        }}
                      >
                        Quên mật khẩu?
                      </a>

                    </div>

                    {/* BUTTON */}

                    <CButton
                      className="mt-4"
                      style={{
                        width: "100%",
                        background: "#ffc107",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 600,
                        padding: "10px 0"
                      }}
                    >
                      Đăng nhập
                    </CButton>

                    {/* REGISTER */}

                    <p className="text-center mt-3">

                      Chưa có tài khoản?
                      <a
                        href="#"
                        style={{
                          marginLeft: 6,
                          color: "#f4b400",
                          textDecoration: "none"
                        }}
                      >
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

      {/* STYLE */}

      <style>{`
        .feature-icon{
          width:32px;
          height:32px;
          background:#fff3cd;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#f4b400;
          font-size:14px;
        }

        .btn:hover{
          background:#e0a800 !important;
        }
      `}</style>

    </div>
  )
}

export default LoginPage