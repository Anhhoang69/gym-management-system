import {
    CSidebar,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

function PtSidebar() {
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
                    <NavLink to="/ai" className="nav-link flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500 flex-shrink-0" />
                        <span>Trợ Lý AI</span>
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/pt/classes" className="nav-link">
                        Lớp Của Tôi
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/pt/leads" className="nav-link">
                        Khách Hàng Tiềm Năng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/pt/payroll" className="nav-link">
                        Lương Cá Nhân
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/pt/commissions" className="nav-link">
                        Hoa Hồng Cá Nhân
                    </NavLink>
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    )
}

export default PtSidebar
