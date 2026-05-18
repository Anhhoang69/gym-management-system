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
  branches
}) {
  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
      <div className="position-relative" style={{ width: 250 }}>
        <CIcon
          icon={cilSearch}
          className="position-absolute text-muted"
          style={{ left: 12, top: "50%", transform: "translateY(-50%)" }}
        />
        <CFormInput
          placeholder="Tìm tên hoặc mã phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 35 }}
        />
      </div>

      <div style={{ width: 200 }}>
        <CFormSelect value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">Tất cả chi nhánh</option>
          {branches.map((b) => (
            <option key={b.branchId} value={b.branchId}>
              {b.name}
            </option>
          ))}
        </CFormSelect>
      </div>

      <div style={{ width: 180 }}>
        <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Hoạt động</option>
          <option value="Maintenance">Bảo trì</option>
          <option value="Inactive">Ngừng hoạt động</option>
        </CFormSelect>
      </div>

    </div>
  )
}

export default RoomFilters
