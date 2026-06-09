import { useState } from "react"
import { NavLink } from "react-router-dom"
import { 
    Sparkles, 
    LayoutDashboard, 
    BarChart3, 
    Users, 
    Building2, 
    DoorOpen, 
    BookOpen, 
    Package, 
    Tag, 
    UserCheck, 
    FileText, 
    CheckSquare, 
    Coins,
    ChevronLeft,
    ChevronRight
} from "lucide-react"

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        try {
            return localStorage.getItem("admin-sidebar-collapsed") === "true"
        } catch {
            return false
        }
    })

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const next = !prev
            try {
                localStorage.setItem("admin-sidebar-collapsed", String(next))
            } catch (e) {}
            return next
        })
    }

    const menuItems = [
        { to: "/ai", icon: <Sparkles size={16} className="text-yellow-500 flex-shrink-0" />, label: "Trợ Lý AI", title: "Trợ Lý AI" },
        { to: "/admin", icon: <LayoutDashboard size={16} className="text-slate-500 flex-shrink-0" />, label: "Tổng Quan", title: "Tổng Quan", end: true },
        { to: "/admin/reports", icon: <BarChart3 size={16} className="text-slate-500 flex-shrink-0" />, label: "Báo Cáo", title: "Báo Cáo" },
        { to: "/admin/users", icon: <Users size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Người Dùng", title: "Quản Lý Người Dùng" },
        { to: "/admin/branches", icon: <Building2 size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Chi Nhánh", title: "Quản Lý Chi Nhánh" },
        { to: "/admin/rooms", icon: <DoorOpen size={16} className="text-slate-500 flex-shrink-0" />, label: "-- Quản Lý Phòng", title: "Quản Lý Phòng", isSubItem: true },
        { to: "/admin/classes", icon: <BookOpen size={16} className="text-slate-500 flex-shrink-0" />, label: "-- Quản Lý Lớp Học", title: "Quản Lý Lớp Học", isSubItem: true },
        { to: "/admin/packages", icon: <Package size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Gói Tập", title: "Quản Lý Gói Tập" },
        { to: "/admin/promo", icon: <Tag size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Khuyến Mãi", title: "Quản Lý Khuyến Mãi" },
        { to: "/admin/leads", icon: <UserCheck size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Leads", title: "Quản Lý Leads" },
        { to: "/admin/contracts", icon: <FileText size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Hợp Đồng", title: "Quản Lý Hợp Đồng" },
        { to: "/admin/attendance", icon: <CheckSquare size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Điểm Danh", title: "Quản Lý Điểm Danh" },
        { to: "/admin/payroll", icon: <Coins size={16} className="text-slate-500 flex-shrink-0" />, label: "Quản Lý Lương", title: "Quản Lý Lương" }
    ]

    return (
        <div
            style={{
                width: isCollapsed ? 64 : 240,
                height: "100%",
                position: "relative",
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                borderRight: "1px solid #eee"
            }}
        >
            {/* Floating Toggle Button */}
            <button
                onClick={toggleCollapse}
                title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                style={{
                    position: "absolute",
                    top: "14px",
                    right: "-12px", // Overlaps the right border
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "1px solid #dee2e6",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748b",
                    zIndex: 10,
                    transition: "transform 0.2s, background-color 0.2s"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc"
                    e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff"
                    e.currentTarget.style.transform = "scale(1)"
                }}
            >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Scrollable Menu Container */}
            <div
                className="no-scrollbar"
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px 8px"
                }}
            >
                <nav 
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                    }}
                >
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-decoration-none ${
                                    isActive 
                                        ? "bg-slate-100 text-slate-900 font-semibold" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                            style={{
                                justifyContent: isCollapsed ? "center" : "flex-start",
                                paddingLeft: isCollapsed ? "0" : (item.isSubItem ? "2.5rem" : "0.75rem"),
                                paddingRight: isCollapsed ? "0" : "0.75rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden"
                            }}
                            title={isCollapsed ? item.title : undefined}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default Sidebar