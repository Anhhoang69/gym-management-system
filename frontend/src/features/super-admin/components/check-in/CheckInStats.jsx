import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCalendarCheck, cilGroup, cilCalendar, cilClock } from "@coreui/icons"

function CheckInStats({ checkInData }) {
  const totalCheckIns = checkInData?.totalCheckIns || 0
  const uniqueMembers = checkInData?.uniqueMembers || 0
  
  // Format peak day (e.g. 2026-05-17 -> 17/05)
  let peakDayStr = "N/A"
  if (checkInData?.peakDay) {
    const d = new Date(checkInData.peakDay)
    if (!isNaN(d)) {
      peakDayStr = d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })
    } else {
      peakDayStr = checkInData.peakDay
    }
  }

  // Format peak hour (e.g. 18 -> 18:00 - 19:00)
  let peakHourStr = "N/A"
  if (checkInData?.peakHour !== null && checkInData?.peakHour !== undefined) {
    const start = checkInData.peakHour.toString().padStart(2, '0') + ":00"
    const end = (checkInData.peakHour + 1).toString().padStart(2, '0') + ":00"
    peakHourStr = `${start} - ${end}`
  }

  const stats = [
    { 
      title: "Tổng Lượt Check-in", 
      value: totalCheckIns.toLocaleString(),
      icon: cilCalendarCheck,
      bg: "#E0F2FE",
      color: "#0EA5E9"
    },
    { 
      title: "Hội Viên (Unique)", 
      value: uniqueMembers.toLocaleString(),
      icon: cilGroup,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    { 
      title: "Ngày Đông Khách Nhất", 
      value: peakDayStr,
      icon: cilCalendar,
      bg: "#F3E8FF",
      color: "#A855F7"
    },
    { 
      title: "Giờ Cao Điểm", 
      value: peakHourStr,
      icon: cilClock,
      bg: "#FFF3CD",
      color: "#F59E0B"
    }
  ]

  return (
    <div className="row g-4">
      {stats.map((item, index) => (
        <div className="col-md-3" key={index}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <CCardBody className="d-flex justify-content-between align-items-center">
              
              <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <p className="mb-1 text-muted" style={{ fontSize: 14 }}>
                  {item.title}
                </p>
                <h5 className="fw-bold mb-0 text-truncate" title={item.value}>
                  {item.value}
                </h5>
              </div>

              <div
                style={{
                  background: item.bg,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <CIcon icon={item.icon} size="lg" style={{ color: item.color }} />
              </div>

            </CCardBody>
          </CCard>
        </div>
      ))}
    </div>
  )
}

export default CheckInStats
