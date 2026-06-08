import {
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

function StaffSidebar() {
    return (
        <CSidebar
            visible
            className="no-scrollbar"
            style={{
                width: 240,
                height: "100%",
                borderRight: "1px solid #eee",
                overflowY: "auto"
            }}
        >

            {/* Menu */}
            <CSidebarNav>

                <CNavItem>
                    <NavLink to="/ai" className="nav-link flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500 flex-shrink-0" />
                        <span>Trợ Lý AI</span>
                    </NavLink>
                </CNavItem>

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

                <CNavItem>
                    <NavLink to="/staff/payroll" className="nav-link">
                        Bảng Lương
                    </NavLink>
                </CNavItem>

            </CSidebarNav>

        </CSidebar>
    )
}

export default StaffSidebar
