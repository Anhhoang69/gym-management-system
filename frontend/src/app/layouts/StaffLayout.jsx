import { Outlet } from "react-router-dom"
import StaffSidebar from "../../features/staff/components/common/StaffSidebar"
import StaffHeader from "../../features/staff/components/common/StaffHeader"

function StaffLayout() {
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
      <StaffHeader />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex"
        }}
      >

        {/* SIDEBAR */}
        <StaffSidebar />

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

export default StaffLayout
