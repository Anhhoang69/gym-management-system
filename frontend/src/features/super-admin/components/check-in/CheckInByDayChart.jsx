import { CCard, CCardBody } from "@coreui/react"
import { CChartLine } from "@coreui/react-chartjs"

function CheckInByDayChart({ checkInData }) {
  const dayData = checkInData?.checkInsByDay || []
  
  const labels = dayData.map(item => {
    const d = new Date(item.date)
    return isNaN(d) ? item.date : `${d.getDate()}/${d.getMonth() + 1}`
  })
  const data = dayData.map(item => item.count)

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Lưu Lượng Theo Ngày (Trend)
        </h5>
        
        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
          <CChartLine
            data={{
              labels: labels,
              datasets:[
                {
                  label:"Số lượt Check-in",
                  backgroundColor:"rgba(14, 165, 233, 0.2)",
                  borderColor:"#0EA5E9",
                  pointBackgroundColor:"#0EA5E9",
                  data: data,
                  fill: true,
                  tension: 0.3
                }
              ]
            }}
            options={{
              aspectRatio: 2.5,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
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

export default CheckInByDayChart
