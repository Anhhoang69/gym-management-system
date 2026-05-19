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

import { FaSun, FaMoon, FaUserPlus } from "react-icons/fa"
import { CButton } from "@coreui/react"

import MembershipOnboardingModal from "./MembershipOnboardingModal"
import UnifiedPaymentDrawer from "./UnifiedPaymentDrawer"
import { getMyProfile } from "../../services/profileService"
import NotificationDropdown from "../../../../shared/components/NotificationDropdown"
import CreateNotificationModal from "./CreateNotificationModal"



function AdminHeader() {

  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const [userProfile, setUserProfile] = useState(null)

  const fetchHeaderProfile = () => {
    // Get basic info from localStorage first as fallback
    const stored = localStorage.getItem("user")
    let defaultRole = "Admin"
    let defaultName = "Quản Trị Viên"
    let defaultAvatar = ""
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.email) defaultName = parsed.email.split("@")[0]
        if (parsed.avatarUrl) defaultAvatar = parsed.avatarUrl
      } catch (e) {}
    }
    
    setUserProfile(prev => ({
      fullName: prev?.fullName || defaultName,
      role: prev?.role || defaultRole,
      avatarUrl: prev?.avatarUrl || defaultAvatar
    }))

    getMyProfile().then(data => {
      if (data) {
        setUserProfile(prev => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          role: data.role || prev.role,
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

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({})
  const [showCreateNotification, setShowCreateNotification] = useState(false)


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

          {/* CREATE NOTIFICATION */}
          <CButton 
            color="primary" 
            className="d-flex align-items-center gap-2 fw-medium text-white shadow-sm"
            style={{ borderRadius: '8px' }}
            onClick={() => setShowCreateNotification(true)}
          >
            <CIcon icon={cilBell} />
            <span className="d-none d-md-inline">Notification</span>
          </CButton>

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

                  <div style={{ fontWeight: 500 }}>
                    {userProfile?.fullName || "Quản Trị Viên"}
                  </div>

                  <small style={{ color: "#888" }}>
                    {userProfile?.role || "Administrator"}
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
                  onClick={() => navigate("/admin/profile")}
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

      {/* GLOBAL MODALS */}
      <MembershipOnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        mode="quick-register"
        onSuccess={(data) => {
          setShowOnboarding(false);
          setPaymentData(data);
          setShowPayment(true);
        }}
      />

      <UnifiedPaymentDrawer
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        invoiceId={paymentData.invoiceId}
        contractId={paymentData.contractId}
        totalAmountDue={paymentData.totalAmountDue}
        invoiceCode={paymentData.invoiceCode}
      />

      <CreateNotificationModal
        visible={showCreateNotification}
        setVisible={setShowCreateNotification}
      />

    </CHeader>

  )

}

export default AdminHeader