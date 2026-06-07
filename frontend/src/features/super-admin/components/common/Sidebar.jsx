import {
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

function Sidebar() {
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
                    <NavLink to="/admin" className="nav-link" end>
                        Tổng Quan
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/reports" className="nav-link">
                        Báo Cáo
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/users" className="nav-link">
                        Quản Lý Người Dùng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/branches" className="nav-link">
                        Quản Lý Chi Nhánh
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/rooms" className="nav-link" style={{ paddingLeft: "2.5rem" }}>
                        -- Quản Lý Phòng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/classes" className="nav-link" style={{ paddingLeft: "2.5rem" }}>
                        -- Quản Lý Lớp Học
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/packages" className="nav-link">
                        Quản Lý Gói Tập
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/promo" className="nav-link">
                        Quản Lý Khuyến Mãi
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/leads" className="nav-link">
                        Quản Lý Leads
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/contracts" className="nav-link">
                        Quản Lý Hợp Đồng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/sales" className="nav-link">
                        Quản Lý Bán Hàng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/attendance" className="nav-link">
                        Quản Lý Điểm Danh
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/payroll" className="nav-link">
                        Quản Lý Lương
                    </NavLink>
                </CNavItem>
            </CSidebarNav>

        </CSidebar>
    )
}

export default Sidebar