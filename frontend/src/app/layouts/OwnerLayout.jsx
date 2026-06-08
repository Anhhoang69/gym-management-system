import { Outlet } from "react-router-dom"
import OwnerSidebar from "../../features/gym-owner/components/common/OwnerSidebar"
import OwnerHeader from "../../features/gym-owner/components/common/OwnerHeader"

function OwnerLayout() {
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
      <OwnerHeader />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden"
        }}
      >
        {/* SIDEBAR */}
        <OwnerSidebar />

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

export default OwnerLayout
