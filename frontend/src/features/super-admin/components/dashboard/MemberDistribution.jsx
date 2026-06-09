import { CCard, CCardBody } from "@coreui/react"
import { CChartPie } from "@coreui/react-chartjs"

function MemberDistribution({ revenueData }) {
  const packageItems = revenueData?.revenueByPackage || []
  
  const labels = packageItems.length > 0 
    ? packageItems.map(item => item.packageName) 
    : ["Premium", "Standard", "Basic", "Trả Ngày"]

  const data = packageItems.length > 0 
    ? packageItems.map(item => item.contractCount) 
    : [45, 30, 10, 15]

  const backgroundColors = [
    "#ffc107", // Amber
    "#28a745", // Green
    "#0d6efd", // Blue
    "#dc3545", // Red
    "#17a2b8", // Cyan
    "#6f42c1", // Purple
    "#fd7e14", // Orange
  ]

  const colors = labels.map((_, index) => backgroundColors[index % backgroundColors.length])

  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <h5>Phân Bố Thành Viên</h5>

        <CChartPie style={{ width: "50%", height: "100%" }}
          data={{
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: colors,
              },
            ],
          }}
        />

      </CCardBody>
    </CCard>
  )
}

export default MemberDistribution