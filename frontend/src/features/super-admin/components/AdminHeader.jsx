import {
  CHeader,
  CContainer,
  CFormInput,
  CHeaderNav,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar
} from "@coreui/react"

import { cilMoon, cilSun, cilBell, cilSearch } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import logo from "../../../assets/LogoBlackText.svg"

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';

function AdminHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const location = useLocation();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };
  return (
    <CHeader className="border-bottom bg-white">

      <CContainer fluid className="d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <img
          src={logo}
          alt="EnerGym"
          style={{ height: 50 }}
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-primary) transition-all hover:bg-(--brand) hover:text-(--on-brand)"
          >
            {isDark ? (
              <FaMoon size={18} className="rotate-0 transition-transform duration-300" />
            ) : (
              <FaSun size={18} className="rotate-90 transition-transform duration-300" />
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

              <CDropdownItem>
                Hồ sơ
              </CDropdownItem>

              <CDropdownItem>
                Cài đặt
              </CDropdownItem>

              <CDropdownItem>
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