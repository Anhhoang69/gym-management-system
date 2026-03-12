import { CCard, CCardBody } from "@coreui/react"
import { CChartLine } from "@coreui/react-chartjs"

function RevenueChart() {
  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <h5>Xu Hướng Doanh Thu</h5>

        <CChartLine
          data={{
            labels: ["T1", "T2", "T3", "T4", "T5"],
            datasets: [
              {
                label: "Revenue",
                backgroundColor: "rgba(255,193,7,0.3)",
                borderColor: "#ffc107",
                data: [20000, 30000, 42000, 36000, 55000],
                fill: true,
              },
            ],
          }}
        />

      </CCardBody>
    </CCard>
  )
}

export default RevenueChart