import { CCard, CCardBody } from "@coreui/react"
import { CChartDoughnut } from "@coreui/react-chartjs"

function RevenueBreakdown({ revenueData }) {
  const packages = revenueData?.revenueByPackage || []
  
  const labels = packages.length > 0 ? packages.map(p => p.packageName) : ["Membership", "PT Sessions", "Merchandise"]
  const data = packages.length > 0 ? packages.map(p => p.revenue) : [65, 25, 10]
  
  const colors = [
    "#ffc107",
    "#0d6efd",
    "#20c997",
    "#dc3545",
    "#6610f2",
    "#fd7e14"
  ]

  const backgroundColors = data.map((_, index) => colors[index % colors.length])

  return (
    <CCard className="border-0 shadow-sm h-100">

      <CCardBody>

        <h5 className="fw-bold mb-4">
          Cơ Cấu Doanh Thu (Gói Tập)
        </h5>

        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>

          <CChartDoughnut
            data={{
              labels: labels,
              datasets:[
                {
                  data: data,
                  backgroundColor: backgroundColors
                }
              ]
            }}
            options={{
              aspectRatio: 1.6,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12
                  }
                }
              }
            }}
          />

        </div>

      </CCardBody>

    </CCard>
  )
}

export default RevenueBreakdown