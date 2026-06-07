import {
    CSidebar,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"

function BranchAdminSidebar() {
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
                    <NavLink to="/branch-admin" className="nav-link" end>
                        Tổng Quan
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/reports" className="nav-link">
                        Báo Cáo
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/branch-admin/users" className="nav-link">
                        Quản Lý Người Dùng
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
