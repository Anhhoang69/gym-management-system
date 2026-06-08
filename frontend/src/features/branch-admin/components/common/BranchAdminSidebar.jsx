import {
    CSidebar,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"
import { Sparkles } from "lucide-react"

function BranchAdminSidebar() {
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
                    <NavLink to="/branch-admin" className="nav-link" end>
                        Tổng Quan
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/users" className="nav-link">
                        Quản Lý Nhân Viên
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/rooms" className="nav-link">
                        Quản Lý Phòng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/classes" className="nav-link">
                        Quản Lý Lớp Học
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/packages" className="nav-link">
                        Quản Lý Gói Tập
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/promo" className="nav-link">
                        Quản Lý Khuyến Mãi
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/leads" className="nav-link">
                        Quản Lý Leads
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/contracts" className="nav-link">
                        Quản Lý Hợp Đồng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/sales" className="nav-link">
                        Quản Lý Bán Hàng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/reports" className="nav-link">
                        Báo Cáo Tài Chính
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/attendance" className="nav-link">
                        Quản Lý Điểm Danh
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/payroll" className="nav-link">
                        Quản Lý Lương
                    </NavLink>
                </CNavItem>

            </CSidebarNav>
        </CSidebar>
    )
}

export default BranchAdminSidebar
