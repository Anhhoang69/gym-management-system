import { CFormInput, CFormSelect, CButton } from "@coreui/react"
import { cilSearch } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

function RoomFilters({
  search,
  setSearch,
  status,
  setStatus,
  branch,
  setBranch,
  branches = [],
  hideBranchFilter = false
}) {
  return (
    <div className="row g-4">
      {/* SEARCH */}
      <div className="col-md-3">
        <CFormInput
          placeholder="Tìm tên hoặc mã phòng..."
          className="w-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          <option value="Maintenance">Bảo trì (Maintenance)</option>
          <option value="Inactive">Ngừng hoạt động (Inactive)</option>
        </select>
      </div>
    </div>
  )
}

export default RoomFilters
