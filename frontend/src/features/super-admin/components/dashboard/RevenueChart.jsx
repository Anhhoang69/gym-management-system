import { CCard, CCardBody } from "@coreui/react"
import { CChartBar } from "@coreui/react-chartjs"

function RevenueChart({ revenueData }) {
  const labels = revenueData?.revenueByMonth?.map(item => item.label) || ["T1", "T2", "T3", "T4", "T5"]
  const data = revenueData?.revenueByMonth?.map(item => item.revenue) || [20000, 30000, 42000, 36000, 55000]

  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <h5>Xu Hướng Doanh Thu</h5>

        <CChartBar
          data={{
            labels: labels,
            datasets: [
              {
                label: "Doanh Thu",
                backgroundColor: "rgba(255, 193, 7, 0.85)",
                borderColor: "#ffc107",
                borderWidth: 1,
                data: data,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString("vi-VN") + " đ";
                  }
                }
              }
            }
          }}
        />

      </CCardBody>
    </CCard>
  )
}

export default RevenueChart