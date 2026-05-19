import { Outlet, NavLink } from "react-router-dom";
import PtHeader from "../../features/pt/components/common/PtHeader";

function PtLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <PtHeader />

      <div
        style={{
          flex: 1,
          display: "flex"
        }}
      >
        {/* TODO: Add PtSidebar */}
        <aside style={{ width: '250px', background: '#34495e', color: '#fff', padding: '16px' }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <NavLink to="/pt" end style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
                  Tổng Quan (Dashboard)
                </NavLink>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <NavLink to="/pt/payroll" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
                  Lương Cá Nhân (Payroll)
                </NavLink>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <NavLink to="/pt/classes" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
                  Lớp Học (Classes)
                </NavLink>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <NavLink to="/pt/leads" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
                  Quản lý Leads
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main
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
