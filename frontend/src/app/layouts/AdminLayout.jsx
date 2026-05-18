import { Outlet } from "react-router-dom"
import Sidebar from "../../features/super-admin/components/common/Sidebar"
import AdminHeader from "../../features/super-admin/components/common/AdminHeader"

function AdminLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* HEADER */}
      <AdminHeader />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex"
        }}
      >

        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            padding: 25,
            overflow: "auto"
          }}
        >
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default AdminLayout