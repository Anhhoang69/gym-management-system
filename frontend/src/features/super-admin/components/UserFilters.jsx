import { CFormInput, CButton } from "@coreui/react"

function UserFilters({
  search,
  setSearch,
  role,
  setRole,
  branch,
  setBranch,
  selectedCount,
  onBulkEmail,
  onBulkSuspend,
  onClearSelection,
}) {
  return (
    <>
      {/* Filters */}
      <div className="d-flex gap-3 flex-wrap">
        <CFormInput
          placeholder="Tìm theo tên, email hoặc vai trò..."
          style={{ maxWidth: 320 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select"
          style={{ width: 180 }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Trainer">Trainer</option>
          <option value="Staff">Staff</option>
          <option value="Member">Member</option>
        </select>

        <select
          className="form-select"
          style={{ width: 180 }}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Tất cả chi nhánh</option>
          <option>Downtown</option>
          <option>Westside</option>
          <option>Eastside</option>
        </select>

        <CButton color="secondary" onClick={onBulkEmail} disabled={!selectedCount}>
          Gửi Email
        </CButton>

        <CButton color="danger" onClick={onBulkSuspend} disabled={!selectedCount}>
          Tạm Ngưng
        </CButton>
      </div>

      {/* Selection bar */}
      {selectedCount > 0 && (
        <div className="mt-2 small text-muted">
          Đã chọn {selectedCount} người dùng •{" "}
          <button
            className="btn btn-link btn-sm p-0 align-baseline"
            onClick={onClearSelection}
          >
            Bỏ chọn
          </button>
        </div>
      )}
    </>
  )
}

export default UserFilters