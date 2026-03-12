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
  Admin: "danger",
  Trainer: "warning",
  Staff: "info",
  Member: "primary",
}

const statusColor = {
  active: "success",
  pending: "warning",
  suspended: "danger",
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
  const allChecked = users.length && users.every((u) => selectedIds.includes(u.id))

  return (
    <CCard>
      <CCardBody>
        <table className="table align-middle">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <CFormCheck
                  checked={allChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>
              <th>Người Dùng</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Chi Nhánh</th>
              <th>Trạng Thái</th>
              <th>Lần Đăng Nhập Cuối</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <CFormCheck
                    checked={selectedIds.includes(u.id)}
                    onChange={() => onToggleSelect(u.id)}
                  />
                </td>

                <td className="d-flex align-items-center gap-2">
                  <img
                    src={u.avatar}
                    width="36"
                    height="36"
                    style={{ borderRadius: "50%" }}
                  />
                  {u.name}
                </td>

                <td>{u.email}</td>

                <td>
                  <CBadge color={roleColor[u.role]}>{u.role}</CBadge>
                </td>

                <td>{u.branch}</td>

                <td>
                  <CBadge color={statusColor[u.status]}>
                    {u.status === "active"
                      ? "Hoạt động"
                      : u.status === "pending"
                      ? "Chờ duyệt"
                      : "Tạm ngưng"}
                  </CBadge>
                </td>

                <td>{u.lastLogin}</td>

                <td>
                  <CDropdown alignment="end">
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
                      <CDropdownItem className="text-danger" onClick={() => onDelete(u)}>
                        Xóa
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  )
}

export default UsersTable