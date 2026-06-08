import { Outlet } from "react-router-dom"
import StaffSidebar from "../../features/staff/components/common/StaffSidebar"
import StaffHeader from "../../features/staff/components/common/StaffHeader"

function StaffLayout() {
  return (
    <div
      style={{
        height: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >

      {/* HEADER */}
      <StaffHeader />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden"
        }}
      >

        {/* SIDEBAR */}
        <StaffSidebar />

        {/* CONTENT */}
        <div
          className="no-scrollbar"
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
