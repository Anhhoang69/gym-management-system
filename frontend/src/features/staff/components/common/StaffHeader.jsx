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

import { cilBell, cilSearch, cilUser, cilAccountLogout } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

import logo from "../../../../assets/LogoBlackText.svg"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMyProfile } from "../../services/profileService"
import { FaSun, FaMoon } from "react-icons/fa"
import NotificationDropdown from "../../../../shared/components/NotificationDropdown"

function StaffHeader() {

  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const [userProfile, setUserProfile] = useState(null)

  const fetchHeaderProfile = () => {
    // Get basic info from localStorage for immediate display
    const stored = localStorage.getItem("user")
    let defaultRole = "Staff"
    let defaultName = "Nhân viên"
    let defaultAvatar = ""
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.staffPosition) defaultRole = parsed.staffPosition
        if (parsed.email) defaultName = parsed.email.split("@")[0]
        if (parsed.avatarUrl) defaultAvatar = parsed.avatarUrl
      } catch (e) {}
    }
    
    setUserProfile(prev => ({
      fullName: prev?.fullName || defaultName,
      role: prev?.role || defaultRole,
      avatarUrl: prev?.avatarUrl || defaultAvatar
    }))

    // Fetch actual profile data
    getMyProfile().then(data => {
      if (data) {
        setUserProfile(prev => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          role: data.role || data.staffPosition || prev.role,
          avatarUrl: data.avatarUrl || data.avatar
        }))
      }
    }).catch(e => console.error("Error fetching profile", e))
  }

  useEffect(() => {
    fetchHeaderProfile()
    window.addEventListener('userProfileUpdated', fetchHeaderProfile)
    return () => {
      window.removeEventListener('userProfileUpdated', fetchHeaderProfile)
    }
  }, [])

  const toggleTheme = () => {

    document.documentElement.classList.toggle("dark")

    setIsDark(!isDark)

  }

  const handleLogout = () => {

    localStorage.clear()

    navigate("/login")

  }

  const goHome = () => {

    navigate("/staff")

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

          {/* REUSABLE NOTIFICATION DROPDOWN */}
          <NotificationDropdown />

          {/* AVATAR */}

          <CDropdown alignment="end" popper={false}>

            <CDropdownToggle caret={false}>

              <div className="d-flex align-items-center">

                <img
                  src={userProfile?.avatarUrl || "https://i.pravatar.cc/40"}
                  alt="Avatar"
                  className="me-2"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "white",
                    border: "1px solid #dee2e6"
                  }}
                />

                <div style={{ textAlign: "left" }}>

                  <div style={{ fontWeight: 500, maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {userProfile?.fullName || "Đang tải..."}
                  </div>

                  <small style={{ color: "#888" }}>
                    {userProfile?.role || "Staff"}
                  </small>

                </div>

              </div>

            </CDropdownToggle>

            <CDropdownMenu
              className="p-1 dropdown-menu-end"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "12px",
                minWidth: "180px",
                borderRadius: "0px", // sharp corners
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "1px solid var(--border, #dee2e6)",
                borderTop: "0px",
                backgroundColor: "var(--bg-secondary, #f5f5f5)",
                zIndex: 1050
              }}
            >
              <div>
                <CDropdownItem 
                  onClick={() => navigate("/staff/profile")}
                  className="d-flex align-items-center py-2 px-3"
                  style={{ cursor: "pointer", transition: "all 0.2s", borderRadius: "0" }}
                >
                  <CIcon icon={cilUser} className="me-3 text-secondary" size="lg" />
                  <span className="fw-semibold text-xs" style={{ color: "var(--text-primary)" }}>Hồ sơ cá nhân</span>
                </CDropdownItem>
                
                <div className="my-1 border-t border-(--border)" style={{ borderColor: "var(--border, #dee2e6)" }}></div>

                <CDropdownItem 
                  onClick={handleLogout}
                  className="d-flex align-items-center py-2 px-3 text-danger"
                  style={{ cursor: "pointer", transition: "all 0.2s", borderRadius: "0" }}
                >
                  <CIcon icon={cilAccountLogout} className="me-3" size="lg" />
                  <span className="fw-semibold text-xs">Đăng xuất</span>
                </CDropdownItem>
              </div>
            </CDropdownMenu>

          </CDropdown>

        </CHeaderNav>

      </CContainer>

    </CHeader>

  )

}

export default StaffHeader
