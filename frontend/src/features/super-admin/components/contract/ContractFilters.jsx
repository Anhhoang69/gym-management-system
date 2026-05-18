import { CFormInput, CFormSelect } from "@coreui/react"

function ContractFilters() {
  return (
    <div className="d-flex gap-3">

      <CFormInput
        placeholder="Tìm theo tên hội viên..."
        style={{width:250}}
      />

      <CFormSelect style={{width:200}}>
        <option>Tất cả trạng thái</option>
        <option>Active</option>
        <option>Expired</option>
        <option>Pending</option>
      </CFormSelect>

      <CFormSelect style={{width:200}}>
        <option>Tất cả chi nhánh</option>
        <option>Downtown</option>
        <option>Westside</option>
      </CFormSelect>

    </div>
  )
}

export default ContractFilters