import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilTask, cilGift, cilUser, cilChartLine } from "@coreui/icons"

function PtPerformanceStats({ ptData }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

  // Aggregate stats
  const totalSessions = ptData.reduce((sum, pt) => sum + pt.totalSessions, 0)
  const totalKpiBonus = ptData.reduce((sum, pt) => sum + pt.kpiBonus, 0)
  const totalMembers = ptData.reduce((sum, pt) => sum + pt.totalMembers, 0)
  const avgSessionsPerPt = ptData.length > 0 ? (totalSessions / ptData.length).toFixed(1) : 0

  const stats = [
    { 
      title: "Tổng Buổi Dạy", 
      value: totalSessions.toLocaleString(),
      icon: cilTask,
      bg: "#E0F2FE",
      color: "#0EA5E9"
    },
    { 
      title: "Tổng Thưởng KPI", 
      value: formatCurrency(totalKpiBonus),
      icon: cilGift,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    { 
      title: "Trung Bình Buổi / PT", 
      value: avgSessionsPerPt,
      icon: cilChartLine,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    { 
      title: "Tổng HV Đang Dạy", 
      value: totalMembers.toLocaleString(),
      icon: cilUser,
      bg: "#F3E8FF",
      color: "#A855F7"
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

export default PtPerformanceStats
