import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from "@coreui/react"

function RoomTable({ rooms, onEdit, onDelete, onStatusChange }) {
  return (
    <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
      <thead
        style={{
          position: "sticky",
          top: 0,
          background: "#f9fafb",
          zIndex: 2,
          boxShadow: "0 1px 0 #e5e7eb",
        }}
      >
        <tr>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Tên Phòng</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Mã Phòng</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Sức Chứa</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Chi Nhánh</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Trạng Thái</th>
          <th style={{ width: 80, padding: "12px 16px" }}></th>
        </tr>
      </thead>
      <tbody>
        {(!rooms || rooms.length === 0) ? (
          <tr>
            <td colSpan="6" className="text-center text-muted py-4">
              Không tìm thấy phòng nào.
            </td>
          </tr>
        ) : (
          rooms.map((r) => (
            <tr key={r.roomId} className="user-row">
              <td style={{ padding: "14px 16px" }}>
                <div className="d-flex align-items-center">
                  {r.images && r.images.length > 0 ? (
                    <img
                      src={r.images[0]}
                      alt={r.name}
                      className="rounded me-3"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  ) : (
                    <div 
                      className="rounded me-3 bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {r.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="fw-semibold text-dark">{r.name}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "14px 16px", color: "#4b5563", fontWeight: "500" }}>{r.roomNumber || "-"}</td>
              <td style={{ padding: "14px 16px", color: "#4b5563" }}>{r.capacity} người</td>
              <td style={{ padding: "14px 16px", color: "#4b5563", fontWeight: "500" }}>{r.branchName || "-"}</td>
              <td style={{ padding: "14px 16px" }}>
                <CBadge
                  color={r.status === "Active" ? "success" : r.status === "Maintenance" ? "warning" : "danger"}
                  className="px-2 py-1.5"
                  style={{ fontSize: "11px", fontWeight: "600" }}
                >
                  {r.status === "Active" ? "Hoạt động" : r.status === "Maintenance" ? "Bảo trì" : "Ngừng hoạt động"}
                </CBadge>
              </td>
              <td style={{ padding: "14px 16px", textAlign: "right" }}>
                <CDropdown
                  alignment="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CDropdownToggle color="light" size="sm" caret={false} className="border shadow-sm" style={{ minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justify: "center" }}>
                    ⋮
                  </CDropdownToggle>

                  <CDropdownMenu>
                    <CDropdownItem onClick={() => onEdit(r)}>
                      Chỉnh sửa
                    </CDropdownItem>
                    {r.status !== "Active" && (
                      <CDropdownItem onClick={() => onStatusChange(r.roomId, "Active")}>
                        Đổi sang Hoạt động
                      </CDropdownItem>
                    )}
                    {r.status !== "Maintenance" && (
                      <CDropdownItem onClick={() => onStatusChange(r.roomId, "Maintenance")}>
                        Đổi sang Bảo trì
                      </CDropdownItem>
                    )}
                    {r.status !== "Inactive" && (
                      <CDropdownItem onClick={() => onStatusChange(r.roomId, "Inactive")}>
                        Đổi sang Ngừng hoạt động
                      </CDropdownItem>
                    )}
                    <CDropdownItem
                      className="text-danger border-top"
                      onClick={() => onDelete(r)}
                    >
                      Xóa
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default RoomTable
