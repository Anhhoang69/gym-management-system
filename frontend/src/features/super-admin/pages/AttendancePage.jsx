import AttendanceFilters from "../components/attendance/AttendanceFilters.jsx"
import AttendanceTable from "../components/attendance/AttendanceTable.jsx"

function AttendancePage() {
  return (
    <div>

      <div className="mb-4">
        <h3 className="fw-bold mb-1">Điểm Danh Hội Viên</h3>
        <p className="text-muted mb-0">
          Theo dõi lịch sử check-in và check-out của hội viên
        </p>
      </div>

      <AttendanceFilters />

      <div className="mt-4">
        <AttendanceTable />
      </div>

    </div>
  )
}

export default AttendancePage