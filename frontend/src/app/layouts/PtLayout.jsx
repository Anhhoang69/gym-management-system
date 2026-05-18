import { Outlet } from "react-router-dom";

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
      {/* TODO: Add PtHeader */}
      <header style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, color: '#333' }}>PT Portal (Head PT & Trainers)</h2>
      </header>

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
              <li style={{ marginBottom: '12px' }}>Dashboard</li>
              {/* Add more PT routes here */}
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
