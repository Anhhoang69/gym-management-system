import {
  CHeader,
  CContainer,
  CFormInput,
  CHeaderNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar
} from "@coreui/react"

import { cilBell, cilSearch } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

import logo from "../../../assets/LogoBlackText.svg"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { FaSun, FaMoon } from "react-icons/fa"

function AdminHeader() {

  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const toggleTheme = () => {

    document.documentElement.classList.toggle("dark")

    setIsDark(!isDark)

  }

  const handleLogout = () => {

    localStorage.clear()

    navigate("/login")

  }

  const goHome = () => {

    navigate("/admin")

  }

  return (

    <CHeader className="border-bottom bg-white">

      <CContainer fluid className="d-flex align-items-center justify-content-between">

        {/* LOGO */}

        <img
          src={logo}
          alt="EnerGym"
          style={{ height: 50, cursor: "pointer" }}
          onClick={goHome}
        />

        {/* RIGHT MENU */}

        <CHeaderNav className="d-flex align-items-center gap-3">

          {/* SEARCH */}

          <div style={{ width: 260, position: "relative" }}>

            <CFormInput
              placeholder="Tìm kiếm..."
              style={{ paddingRight: 35 }}
            />

            <CIcon
              icon={cilSearch}
              size="sm"
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                cursor: "pointer"
              }}
            />

          </div>

          {/* THEME TOGGLE */}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 40,
              height: 40,
              border: "none",
              background: "transparent"
            }}
          >

            {isDark ? (
              <FaMoon size={18} />
            ) : (
              <FaSun size={18} />
            )}

          </button>

          {/* NOTIFICATIONS */}

          <CDropdown alignment="end">

            <CDropdownToggle caret={false}>

              <CIcon icon={cilBell} size="lg" />

            </CDropdownToggle>

            <CDropdownMenu style={{ width: 300 }}>

              <CDropdownItem>

                Thành viên mới đăng ký
                <br />
                <small>2 phút trước</small>

              </CDropdownItem>

              <CDropdownItem>

                Thanh toán đã nhận
                <br />
                <small>15 phút trước</small>

              </CDropdownItem>

              <CDropdownItem>

                PT session đã đặt
                <br />
                <small>32 phút trước</small>

              </CDropdownItem>

            </CDropdownMenu>

          </CDropdown>

          {/* AVATAR */}

          <CDropdown alignment="end">

            <CDropdownToggle caret={false}>

              <div className="d-flex align-items-center">

                <CAvatar
                  src="https://i.pravatar.cc/40"
                  size="md"
                  className="me-2"
                />

                <div style={{ textAlign: "left" }}>

                  <div style={{ fontWeight: 500 }}>
                    Quản Trị Viên
                  </div>

                  <small style={{ color: "#888" }}>
                    Administrator
                  </small>

                </div>

              </div>

            </CDropdownToggle>

            <CDropdownMenu>

              <CDropdownItem onClick={() => navigate("/admin/profile")}>
                Hồ sơ
              </CDropdownItem>

              <CDropdownItem onClick={() => navigate("/admin/settings")}>
                Cài đặt
              </CDropdownItem>

              <CDropdownItem onClick={handleLogout}>
                Đăng xuất
              </CDropdownItem>

            </CDropdownMenu>

          </CDropdown>

        </CHeaderNav>

      </CContainer>

    </CHeader>

  )

}

export default AdminHeader