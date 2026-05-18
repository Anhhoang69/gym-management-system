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
    <CCard>
      <CCardBody>

        <table className="table table-sm align-middle">

          {/* HEADER */}
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              zIndex: 2,
              boxShadow: "0 1px 0 #eee",
            }}
          >
            <tr>
              <th style={{ width: 36 }}>
                <CFormCheck
                  checked={allChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>

              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Chi nhánh</th>
              <th>Trạng thái</th>
              <th>Lần đăng nhập</th>
              <th style={{ width: 50 }}></th>
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
                  <td>
                    <CFormCheck
                      checked={isSelected}
                      onChange={() => onToggleSelect(u.userId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  {/* USER INFO */}
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {u.fullName || "-"}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>
                      {u.email}
                    </div>
                  </td>

                  {/* ROLE */}
                  <td>
                    <CBadge color={roleColor[role] || "secondary"}>
                      {role || "-"}
                    </CBadge>
                  </td>

                  {/* BRANCH */}
                  <td>{u.branchName || "-"}</td>

                  {/* STATUS */}
                  <td>
                    <CBadge color={statusColor[u.status] || "secondary"}>
                      {u.status}
                    </CBadge>
                  </td>

                  {/* LAST LOGIN */}
                  <td>{formatDate(u.lastLoginAt)}</td>

                  {/* ACTION */}
                  <td>
                    <CDropdown
                      alignment="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CDropdownToggle color="light" size="sm">
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