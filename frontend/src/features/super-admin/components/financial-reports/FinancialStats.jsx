import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilDollar, cilCart, cilChartPie, cilStar } from "@coreui/icons"

function FinancialStats({ financialData }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

  // Find top branch by revenue
  const branches = financialData?.revenueByBranch || []
  let topBranch = null
  if (branches.length > 0) {
    topBranch = branches.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current)
  }

  const stats = [
    { 
      title: "Tổng Doanh Thu", 
      value: formatCurrency(financialData?.totalRevenue),
      icon: cilDollar,
      bg: "#F3E8FF",
      color: "#A855F7"
    },
    { 
      title: "Tổng Số Hóa Đơn", 
      value: (financialData?.totalInvoices || 0).toLocaleString(),
      icon: cilCart,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    { 
      title: "Doanh Thu TB / HĐ", 
      value: formatCurrency(financialData?.averageRevenuePerInvoice),
      icon: cilChartPie,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    { 
      title: "Chi Nhánh Dẫn Đầu", 
      value: topBranch ? topBranch.branchName : "N/A",
      icon: cilStar,
      bg: "#E0F2FE",
      color: "#0EA5E9"
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

export default FinancialStats