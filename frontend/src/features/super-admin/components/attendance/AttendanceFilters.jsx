import { CFormInput, CFormSelect } from "@coreui/react"

function AttendanceFilters({
  branches = [],
  selectedBranch,
  onBranchChange,
  selectedDate,
  onDateChange,
  searchName,
  onSearchChange
}) {
  return (
    <div className="d-flex gap-3 flex-wrap">

      <CFormInput
        placeholder="Tìm theo tên hội viên..."
        style={{ width: 250 }}
        value={searchName}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <CFormSelect 
        style={{ width: 200 }} 
        value={selectedBranch} 
        onChange={(e) => onBranchChange(e.target.value)}
      >
        <option value="">Tất cả chi nhánh</option>
        {branches.map(branch => (
          <option key={branch.branchId} value={branch.branchId}>
            {branch.name}
          </option>
        ))}
      </CFormSelect>

      <CFormInput
        type="date"
        style={{ width: 200 }}
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />

    </div>
  )
}

export default AttendanceFilters