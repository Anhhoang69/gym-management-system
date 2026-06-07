import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"

function StaffSidebar() {
  return (
      <CSidebar
          visible
          style={{
              width: 240,
              height: "100vh",
              borderRight: "1px solid #eee"
          }}
      >

          {/* Menu */}
          <CSidebarNav>

              <CNavItem>
                  <NavLink to="/staff" className="nav-link" end>
                      Tổng Quan
                  </NavLink>
              </CNavItem>

              <CNavItem>
                  <NavLink to="/staff/attendance" className="nav-link">
                      Điểm Danh
                  </NavLink>
              </CNavItem>

              <CNavItem>
                  <NavLink to="/staff/contracts" className="nav-link">
                      Hợp Đồng
                  </NavLink>
              </CNavItem>

              <CNavItem>
                  <NavLink to="/staff/leads" className="nav-link">
                      Leads
                  </NavLink>
              </CNavItem>

              <CNavItem>
                  <NavLink to="/staff/payments" className="nav-link">
                      Thanh Toán
                  </NavLink>
              </CNavItem>

              <CNavItem>
                  <NavLink to="/staff/commissions" className="nav-link">
                      Hoa Hồng
                  </NavLink>
              </CNavItem>

          </CSidebarNav>

      </CSidebar>
  )
}

export default StaffSidebar
