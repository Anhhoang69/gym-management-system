import { CCard, CCardBody } from "@coreui/react"
import { CChartDoughnut } from "@coreui/react-chartjs"

function LeadsSourceChart({ salesData }) {
  const sources = salesData?.leadsBySource || []
  
  // Group by sourceName
  const groupedSources = {}
  sources.forEach(item => {
    const name = item.sourceName || "Không rõ"
    groupedSources[name] = (groupedSources[name] || 0) + item.leadCount
  })
  
  // Convert to array and sort descending
  const sortedSources = Object.keys(groupedSources)
    .map(name => ({ name, count: groupedSources[name] }))
    .sort((a, b) => b.count - a.count)
    
  // Keep top 5, group rest into "Khác"
  let displayLabels = []
  let displayData = []
  
  if (sortedSources.length > 5) {
    const top5 = sortedSources.slice(0, 5)
    const restCount = sortedSources.slice(5).reduce((sum, item) => sum + item.count, 0)
    displayLabels = [...top5.map(item => item.name), "Khác"]
    displayData = [...top5.map(item => item.count), restCount]
  } else {
    displayLabels = sortedSources.map(item => item.name)
    displayData = sortedSources.map(item => item.count)
  }
  
  const colors = [
    "#22C55E",
    "#A855F7",
    "#0EA5E9",
    "#F59E0B",
    "#EF4444",
    "#6c757d"
  ]
  const backgroundColors = displayData.map((_, index) => colors[index % colors.length])

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Nguồn Leads (Source)
        </h5>
        
        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
          <CChartDoughnut
            data={{
              labels: displayLabels,
              datasets:[
                {
                  data: displayData,
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

export default LeadsSourceChart
