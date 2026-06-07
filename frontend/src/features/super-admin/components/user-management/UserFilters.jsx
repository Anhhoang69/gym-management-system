import { CFormInput, CButton } from "@coreui/react"

function UserFilters({
  search,
  setSearch,
  role,
  setRole,
  branch,
  setBranch,
  branches = [],
  selectedCount,
  onBulkEmail,
  onBulkSuspend,
  onClearSelection,
  hideBranchFilter = false,
}) {
  return (
    <>
      {/* Filters */}
      <div className="d-flex gap-3 flex-wrap">

        <CFormInput
          placeholder="Tìm theo tên, email..."
          style={{ maxWidth: 320 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ROLE */}
        <select
          className="form-select"
          style={{ width: 180 }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="SuperAdmin">Super Admin</option>
          <option value="GymOwner">Gym Owner</option>
          <option value="Staff">Staff</option>
          <option value="Member">Member</option>
        </select>

        {/* BRANCH */}
        {!hideBranchFilter && (
          <select
            className="form-select"
            style={{ width: 180 }}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Tất cả chi nhánh</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        {/* RESET */}
        <CButton
          color="light"
          size="sm"
          onClick={() => {
            setSearch("")
            setRole("")
            if (!hideBranchFilter) {
              setBranch("")
            }
          }}
        >
          Reset
        </CButton>

      </div>

      {/* Selection bar */}
      {selectedCount > 0 && (
        <div
          className="d-flex justify-content-between align-items-center mt-2 px-3 py-2"
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 8
          }}
        >
          <div className="small">
            <strong>Đã chọn {selectedCount}</strong> người dùng
            <button
              className="btn btn-link btn-sm ms-2 p-0"
              onClick={onClearSelection}
            >
              Bỏ chọn
            </button>
          </div>

          <div className="d-flex gap-2">
            <CButton color="secondary" size="sm" onClick={onBulkEmail}>
              Gửi Email
            </CButton>

            <CButton color="danger" size="sm" onClick={onBulkSuspend}>
              Tạm Ngưng
            </CButton>
          </div>
        </div>
      )}
    </>
  )
}

export default UserFilters