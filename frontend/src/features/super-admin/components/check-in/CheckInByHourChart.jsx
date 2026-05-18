import { CCard, CCardBody } from "@coreui/react"
import { CChartBar } from "@coreui/react-chartjs"

function CheckInByHourChart({ checkInData }) {
  const hourData = checkInData?.checkInsByHour || []
  
  // Create 24-hour labels (0h -> 23h)
  const full24Hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
  
  // Merge API data with full 24-hour frame
  hourData.forEach(item => {
    if (item.hour >= 0 && item.hour < 24) {
      full24Hours[item.hour].count = item.count
    }
  })

  const labels = full24Hours.map(item => `${item.hour}h`)
  const data = full24Hours.map(item => item.count)
  
  // Highlight the peak hour by giving it a different color
  const peakHour = checkInData?.peakHour
  const backgroundColors = full24Hours.map(item => 
    item.hour === peakHour ? "#EF4444" : "#F59E0B"
  )

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Mật Độ Khách Theo Giờ (Peak Hour)
        </h5>
        
        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
          <CChartBar
            data={{
              labels: labels,
              datasets:[
                {
                  label:"Số lượt Check-in",
                  backgroundColor: backgroundColors,
                  data: data,
                  borderRadius: 4
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

export default CheckInByHourChart
