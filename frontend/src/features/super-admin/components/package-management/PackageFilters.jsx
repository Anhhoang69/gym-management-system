import { CFormSelect, CButton } from "@coreui/react"

function PackageFilters() {
  return (
    <div className="d-flex gap-3">

      <CFormSelect style={{ width: 200 }}>
        <option>Tất cả thời hạn</option>
        <option>1 tháng</option>
        <option>3 tháng</option>
        <option>6 tháng</option>
        <option>12 tháng</option>
      </CFormSelect>

      <CFormSelect style={{ width: 200 }}>
        <option>Tất cả trạng thái</option>
        <option>Active</option>
        <option>Inactive</option>
      </CFormSelect>

      <CButton color="light">
        ≡ Sắp Xếp
      </CButton>

    </div>
  )
}

export default PackageFilters