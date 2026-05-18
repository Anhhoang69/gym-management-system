import { CBadge, CButton } from "@coreui/react"
import { cilPencil, cilTrash } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

function RoomTable({ rooms, onEdit, onDelete, onStatusChange }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted mb-0">Không tìm thấy phòng nào.</p>
      </div>
    )
  }

  return (
    <table className="table table-hover mb-0 align-middle">
      <thead className="table-light sticky-top">
        <tr>
          <th>Tên Phòng</th>
          <th>Mã Phòng</th>
          <th>Sức Chứa</th>
          <th>Chi Nhánh</th>
          <th>Trạng Thái</th>
          <th className="text-end">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((r) => (
          <tr key={r.roomId}>
            <td>
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
                  <div className="fw-semibold">{r.name}</div>
                </div>
              </div>
            </td>
            <td>{r.roomNumber || "-"}</td>
            <td>{r.capacity} người</td>
            <td>{r.branchName || "-"}</td>
            <td>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto", display: "inline-block" }}
                value={r.status}
                onChange={(e) => onStatusChange(r.roomId, e.target.value)}
              >
                <option value="Active">Hoạt động</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Inactive">Ngừng hoạt động</option>
              </select>
            </td>
            <td className="text-end">
              <CButton
                color="light"
                size="sm"
                className="me-2"
                onClick={() => onEdit(r)}
              >
                <CIcon icon={cilPencil} />
              </CButton>
              <CButton
                color="danger"
                variant="outline"
                size="sm"
                onClick={() => onDelete(r)}
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RoomTable
