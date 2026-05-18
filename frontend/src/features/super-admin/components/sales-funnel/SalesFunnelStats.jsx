import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPeople, cilPhone, cilStar, cilLoopCircular } from "@coreui/icons"

function SalesFunnelStats({ salesData }) {
  const stats = [
    { 
      title: "Tổng Leads", 
      value: (salesData?.totalLeads || 0).toLocaleString(),
      icon: cilPeople,
      bg: "#F3E8FF",
      color: "#A855F7"
    },
    { 
      title: "Tỷ Lệ Tiếp Cận", 
      value: `${(salesData?.contactRate || 0).toFixed(1)}%`,
      icon: cilPhone,
      bg: "#E0F2FE",
      color: "#0EA5E9"
    },
    { 
      title: "Tỷ Lệ Chuyển Đổi", 
      value: `${(salesData?.conversionRate || 0).toFixed(1)}%`,
      icon: cilStar,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    { 
      title: "Tỷ Lệ Gia Hạn", 
      value: `${(salesData?.renewalRate || 0).toFixed(1)}% (${salesData?.renewalCount || 0})`,
      icon: cilLoopCircular,
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

export default SalesFunnelStats
