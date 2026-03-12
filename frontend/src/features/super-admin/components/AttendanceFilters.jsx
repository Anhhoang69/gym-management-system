import { CFormInput, CFormSelect } from "@coreui/react"

function AttendanceFilters() {
  return (
    <div className="d-flex gap-3">

      <CFormInput
        placeholder="Tìm theo tên hội viên..."
        style={{ width: 250 }}
      />

      <CFormSelect style={{ width: 200 }}>
        <option>Tất cả chi nhánh</option>
        <option>Downtown</option>
        <option>Westside</option>
      </CFormSelect>

      <CFormSelect style={{ width: 200 }}>
        <option>Hôm nay</option>
        <option>Tuần này</option>
        <option>Tháng này</option>
      </CFormSelect>

    </div>
  )
}

export default AttendanceFilters