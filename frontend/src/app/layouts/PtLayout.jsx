import { Outlet } from "react-router-dom";
import PtHeader from "../../features/pt/components/common/PtHeader";
import PtSidebar from "../../features/pt/components/common/PtSidebar";

function PtLayout() {
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
      <PtHeader />

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden"
        }}
      >
        <PtSidebar />

        <main
          className="no-scrollbar"
          style={{
            flex: 1,
            padding: 25,
            overflow: "auto"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PtLayout;
