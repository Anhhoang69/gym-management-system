import {
  CCard,
  CCardBody,
  CBadge,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react"

const roleColor = {
  SuperAdmin: "danger",
  GymOwner: "warning",
  Member: "primary",
  PT: "info",
  Receptionist: "info",
  Sales: "info",
  BranchAdmin: "info",
  HeadPT: "info",
}

const statusColor = {
  Active: "success",
  Inactive: "secondary",
  Suspended: "danger",
}

function formatDate(date) {
  if (!date) return "-"
  return new Date(date).toLocaleString("vi-VN")
}

function getDisplayRole(u) {
  return u.staffPosition || u.role
}

function UsersTable({
  users,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onSuspend,
  onDelete,
}) {
  const allChecked =
    users.length > 0 && users.every((u) => selectedIds.includes(u.userId))

  return (
    <CCard className="border-0 shadow-none">
      <CCardBody className="p-0">

        <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>

          {/* HEADER */}
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
              <th style={{ width: 48, padding: "12px 16px" }}>
                <CFormCheck
                  checked={allChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>

              <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Người dùng</th>
              <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Vai trò</th>
              <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Chi nhánh</th>
              <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Trạng thái</th>
              <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Lần đăng nhập</th>
              <th style={{ width: 50, padding: "12px 16px" }}></th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {users.map((u) => {
              const role = getDisplayRole(u)
              const isSelected = selectedIds.includes(u.userId)

              return (
                <tr
                  key={u.userId}
                  className={`user-row ${isSelected ? "selected-row" : ""}`}
                  onClick={() => onEdit(u)}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "14px 16px" }}>
                    <CFormCheck
                      checked={isSelected}
                      onChange={() => onToggleSelect(u.userId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  {/* USER INFO */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>
                      {u.fullName || "-"}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>
                      {u.email}
                    </div>
                  </td>

                  {/* ROLE */}
                  <td style={{ padding: "14px 16px" }}>
                    <CBadge color={roleColor[role] || "secondary"} className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>
                      {role || "-"}
                    </CBadge>
                  </td>

                  {/* BRANCH */}
                  <td style={{ padding: "14px 16px", color: "#4b5563", fontWeight: "500" }}>{u.branchName || "-"}</td>

                  {/* STATUS */}
                  <td style={{ padding: "14px 16px" }}>
                    <CBadge color={statusColor[u.status] || "secondary"} className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>
                      {u.status}
                    </CBadge>
                  </td>

                  {/* LAST LOGIN */}
                  <td style={{ padding: "14px 16px", color: "#4b5563" }}>{formatDate(u.lastLoginAt)}</td>

                  {/* ACTION */}
                  <td style={{ padding: "14px 16px" }}>
                    <CDropdown
                      alignment="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CDropdownToggle color="light" size="sm" caret={false} className="border shadow-sm" style={{ minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        ⋮
                      </CDropdownToggle>

                      <CDropdownMenu>
                        <CDropdownItem onClick={() => onEdit(u)}>
                          Chỉnh sửa
                        </CDropdownItem>

                        <CDropdownItem onClick={() => onSuspend(u)}>
                          Tạm ngưng
                        </CDropdownItem>

                        <CDropdownItem
                          className="text-danger"
                          onClick={() => onDelete(u)}
                        >
                          Xóa
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>

      </CCardBody>
    </CCard>
  )
}

export default UsersTable