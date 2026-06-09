import { CFormInput, CFormSelect } from "@coreui/react"

function ContractFilters() {
  return (
    <div className="row g-4 align-items-center">
      <div className="col-md-3">
        <CFormInput
          placeholder="Tìm theo tên hội viên..."
        />
      </div>

      <div className="col-md-3">
        <CFormSelect>
          <option>Tất cả trạng thái</option>
          <option>Active</option>
          <option>Expired</option>
          <option>Pending</option>
        </CFormSelect>
      </div>

      <div className="col-md-3">
        <CFormSelect>
          <option>Tất cả chi nhánh</option>
          <option>Downtown</option>
          <option>Westside</option>
        </CFormSelect>
      </div>
    </div>
  )
}

export default ContractFilters