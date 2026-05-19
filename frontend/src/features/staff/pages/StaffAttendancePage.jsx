import { useState, useEffect, useRef } from "react"
import { CCard, CCardBody, CFormInput, CButton, CAlert } from "@coreui/react"
import AttendanceTable from "../../super-admin/components/attendance/AttendanceTable.jsx"
import { getBranches } from "../../super-admin/services/branchService"
import { getBranchAttendance, checkin, checkout } from "../../../shared/services/attendanceService"
import { FaQrcode, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"

export default function StaffAttendancePage() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [cardNumber, setCardNumber] = useState("")
  const [scanMessage, setScanMessage] = useState(null) // { type: 'success' | 'danger', text: '' }
  
  const inputRef = useRef(null)

  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (selectedBranch) {
      fetchAttendance()
    } else {
      setAttendanceData([])
    }
    // Auto focus on input when branch changes
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedBranch])

  const fetchBranches = async () => {
    try {
      const data = await getBranches()
      setBranches(data || [])
      if (data && data.length > 0) {
        setSelectedBranch(data[0].branchId)
      }
    } catch (e) {
      console.error("Failed to fetch branches", e)
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const data = await getBranchAttendance(selectedBranch, today)
      setAttendanceData(data || [])
      setCurrentPage(1)
    } catch (e) {
      console.error("Failed to fetch attendance", e)
      setAttendanceData([])
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async (action) => {
    if (!cardNumber.trim()) {
      setScanMessage({ type: 'danger', text: 'Vui lòng nhập/quẹt mã thẻ!' })
      return
    }
    if (!selectedBranch) {
      setScanMessage({ type: 'danger', text: 'Vui lòng chọn chi nhánh trước khi điểm danh!' })
      return
    }

    try {
      let res;
      if (action === 'checkin') {
        res = await checkin(cardNumber, selectedBranch)
      } else {
        res = await checkout(cardNumber, selectedBranch)
      }

      if (res && res.success) {
        setScanMessage({ type: 'success', text: `Thành công! ${action === 'checkin' ? 'Check-in' : 'Check-out'} hội viên.` })
        setCardNumber("")
        fetchAttendance() // Refresh list
      } else {
        setScanMessage({ type: 'danger', text: res?.message || 'Có lỗi xảy ra!' })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Có lỗi xảy ra khi gọi API!'
      setScanMessage({ type: 'danger', text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) })
    }
    
    // Refocus input for next scan
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleScan('checkin') // Default to checkin on enter, or we can look at the card status
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Điểm Danh (Reception)</h3>
        <p className="text-muted mb-0">
          Quẹt thẻ hội viên để Check-in hoặc Check-out
        </p>
      </div>

      <CCard className="mb-4 shadow-sm border-0">
        <CCardBody>
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Chi nhánh điểm danh</label>
              <select 
                className="form-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map(b => (
                  <option key={b.branchId} value={b.branchId}>{b.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-5">
              <label className="form-label fw-semibold">Mã thẻ hội viên (Quẹt thẻ)</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaQrcode className="text-muted" />
                </span>
                <CFormInput 
                  ref={inputRef}
                  placeholder="Nhập hoặc quẹt mã thẻ..."
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label d-none d-md-block">&nbsp;</label>
              <div className="d-flex gap-2">
                <CButton color="primary" onClick={() => handleScan('checkin')} className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                  <FaSignInAlt /> Check-in
                </CButton>
                <CButton color="warning" className="text-white flex-grow-1 d-flex align-items-center justify-content-center gap-2" onClick={() => handleScan('checkout')}>
                  <FaSignOutAlt /> Check-out
                </CButton>
              </div>
            </div>
          </div>

          {scanMessage && (
            <div className="mt-3">
              <CAlert color={scanMessage.type} dismissible onClose={() => setScanMessage(null)} className="mb-0">
                {scanMessage.text}
              </CAlert>
            </div>
          )}
        </CCardBody>
      </CCard>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-semibold">Danh sách đang tập hôm nay</h5>
      </div>
      
      <AttendanceTable 
        data={attendanceData}
        loading={loading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={10}
      />
      
    </div>
  )
}
