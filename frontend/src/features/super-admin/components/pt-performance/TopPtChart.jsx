import { CCard, CCardBody } from "@coreui/react"
import { CChartBar } from "@coreui/react-chartjs"

function TopPtChart({ ptData }) {
  // Sort by totalSessions descending and take top 5
  const topPts = [...ptData].sort((a, b) => b.totalSessions - a.totalSessions).slice(0, 5)
  
  const labels = topPts.map(pt => pt.ptName)
  const data = topPts.map(pt => pt.totalSessions)

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Top 5 PT Dạy Nhiều Nhất
        </h5>
        
        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
          <CChartBar
            data={{
              labels: labels,
              datasets:[
                {
                  label:"Số Buổi Dạy",
                  backgroundColor:"#22C55E",
                  data: data
                }
              ]
            }}
            options={{
              aspectRatio: 2.5,
              indexAxis: 'y', // Make it horizontal
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
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

export default TopPtChart
