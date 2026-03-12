import {
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CNavItem
} from "@coreui/react"

import { NavLink } from "react-router-dom"

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
                    <NavLink to="/admin" className="nav-link">
                        Tổng Quan
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
                    <NavLink to="/admin/packages" className="nav-link">
                        Gói & Giá
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/promo" className="nav-link">
                        Khuyến Mãi
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/sales" className="nav-link">
                        Doanh Thu & Bán Hàng
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/contracts" className="nav-link">
                        Hợp Đồng & Hóa Đơn
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/trainers" className="nav-link">
                        Huấn Luyện Viên
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/attendance" className="nav-link">
                        Điểm Danh
                    </NavLink>
                </CNavItem>

                <CNavItem>
                    <NavLink to="/admin/reports" className="nav-link">
                        Báo Cáo Tài Chính
                    </NavLink>
                </CNavItem>

            </CSidebarNav>

        </CSidebar>
    )
}

export default Sidebar