import { Outlet } from "react-router-dom";

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
      {/* TODO: Add StaffHeader */}
      <header style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Staff Portal (Sales & Receptionist)</h2>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex"
        }}
      >
        {/* TODO: Add StaffSidebar */}
        <aside style={{ width: '250px', background: '#2c3e50', color: '#fff', padding: '16px' }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}>Dashboard</li>
              {/* Add more staff routes here */}
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

export default StaffLayout;
