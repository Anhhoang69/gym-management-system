import {
    CSidebar,
    CSidebarNav,
    CNavItem
} from "@coreui/react"
import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

function OwnerSidebar() {
    return (
        <CSidebar
            visible
            style={{
                width: 240,
                height: "100vh",
                borderRight: "1px solid #eee",
                background: "var(--bg-third, #fff)"
            }}
        >
            {/* Menu */}
            <CSidebarNav>
                <CNavItem>
                    <NavLink to="/owner" className="nav-link" end>
                        Tổng Quan (Dashboard)
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/owner/requests" className="nav-link">
                        Duyệt Yêu Cầu (Requests)
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/owner/reports" className="nav-link">
                        Báo Cáo Thống Kê
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/owner/payroll" className="nav-link">
                        Quản Lý Lương (Payroll)
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/owner/contracts" className="nav-link">
                        Hợp Đồng (Contracts)
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/owner/profile" className="nav-link">
                        Hồ Sơ Cá Nhân
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/ai" className="nav-link flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500 flex-shrink-0" />
                        <span>Trợ Lý AI</span>
                    </NavLink>
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    )
}

export default OwnerSidebar
