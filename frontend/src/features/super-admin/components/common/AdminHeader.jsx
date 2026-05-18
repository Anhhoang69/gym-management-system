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

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { FaSun, FaMoon, FaUserPlus } from "react-icons/fa"
import { CButton } from "@coreui/react"

import MembershipOnboardingModal from "./MembershipOnboardingModal"
import UnifiedPaymentDrawer from "./UnifiedPaymentDrawer"


function AdminHeader() {

  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const toggleTheme = () => {

    document.documentElement.classList.toggle("dark")

    setIsDark(!isDark)

  }

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({})


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

          {/* QUICK REGISTER */}
          <CButton 
            color="primary" 
            className="d-flex align-items-center gap-2 fw-medium text-white shadow-sm"
            style={{ borderRadius: '8px' }}
            onClick={() => setShowOnboarding(true)}
          >
            <FaUserPlus />
            <span className="d-none d-md-inline">Đăng Ký Nhanh</span>
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

            <CDropdownMenu className="p-1" style={{ minWidth: "100%", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginTop: "8px" }}>
              <div>
                <CDropdownItem 
                  onClick={() => navigate("/admin/profile")}
                  className="d-flex align-items-center rounded py-2"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <CIcon icon={cilUser} className="me-3 text-secondary" size="lg" />
                  <span className="fw-medium">Hồ sơ cá nhân</span>
                </CDropdownItem>
                
                <div className="dropdown-divider my-1"></div>

                <CDropdownItem 
                  onClick={handleLogout}
                  className="d-flex align-items-center rounded py-2 text-danger"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <CIcon icon={cilAccountLogout} className="me-3" size="lg" />
                  <span className="fw-medium">Đăng xuất</span>
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

    </CHeader>

  )

}

export default AdminHeader