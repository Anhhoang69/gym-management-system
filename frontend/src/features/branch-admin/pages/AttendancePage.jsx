import { useState, useEffect } from "react"
import AttendanceFilters from "../../super-admin/components/attendance/AttendanceFilters.jsx"
import AttendanceTable from "../../super-admin/components/attendance/AttendanceTable.jsx"
import { getBranches } from "../../super-admin/services/branchService"
import { getBranchAttendance } from "../../../shared/services/attendanceService"

function AttendancePage() {
  const storedUser = localStorage.getItem("user")
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const myBranchId = currentUser?.branchId || ""

  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(myBranchId)
  
  // Default to today
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [searchName, setSearchName] = useState("")
  
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 10

  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (selectedBranch) {
      fetchAttendance()
    } else {
      setAttendanceData([])
    }
  }, [selectedBranch, selectedDate])

  const fetchBranches = async () => {
    try {
      const data = await getBranches()
      setBranches(data || [])
      if (!selectedBranch && data && data.length > 0) {
        setSelectedBranch(data[0].branchId)
      }
    } catch (e) {
      console.error("Failed to fetch branches", e)
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const data = await getBranchAttendance(selectedBranch, selectedDate)
      setAttendanceData(data || [])
      setCurrentPage(1)
    } catch (e) {
      console.error("Failed to fetch attendance", e)
      setAttendanceData([])
    } finally {
      setLoading(false)
    }
  }

  // Filter local by name
  const filteredData = attendanceData.filter(item => 
    !searchName || (item.memberName || "").toLowerCase().includes(searchName.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Điểm Danh Hội Viên</h3>
        <p className="text-muted mb-0">
          Theo dõi lịch sử check-in và check-out của hội viên
        </p>
      </div>

      <AttendanceFilters 
        branches={branches}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchName={searchName}
        onSearchChange={setSearchName}
        hideBranchSelect={true}
      />

      <div className="mt-4">
        <AttendanceTable 
          data={filteredData}
          loading={loading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  )
}

export default AttendancePage