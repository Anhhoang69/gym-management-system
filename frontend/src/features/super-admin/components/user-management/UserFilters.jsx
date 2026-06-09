import { CFormInput, CButton } from "@coreui/react"

function UserFilters({
  search,
  setSearch,
  role,
  setRole,
  branch,
  setBranch,
  status,
  setStatus,
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
      <div className="row g-4">

        {/* SEARCH */}
        <div className="col-md-3">
          <CFormInput
            placeholder="Tìm theo tên, email..."
            className="w-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ROLE */}
        <div className="col-md-3">
          <select
            className="form-select w-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="SuperAdmin">Super Admin</option>
            <option value="GymOwner">Gym Owner</option>
            <option value="Staff">Staff</option>
            <option value="Member">Member</option>
          </select>
        </div>

        {/* BRANCH */}
        {!hideBranchFilter && (
          <div className="col-md-3">
            <select
              className="form-select w-100"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map((b) => (
                <option key={b.branchId || b.id} value={b.branchId || b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* STATUS */}
        <div className="col-md-3">
          <select
            className="form-select w-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động (Active)</option>
            <option value="Inactive">Không hoạt động (Inactive)</option>
            <option value="Suspended">Tạm ngưng (Suspended)</option>
          </select>
        </div>

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