import { CCard, CCardBody } from "@coreui/react"
import { CChartDoughnut } from "@coreui/react-chartjs"

function PtTypeChart({ ptData }) {
  const totalGroup = ptData.reduce((sum, pt) => sum + pt.groupPtCount, 0)
  const totalPrivate = ptData.reduce((sum, pt) => sum + pt.privatePtCount, 0)

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Loại Hình Buổi Tập (Private vs Group)
        </h5>
        
        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
          <CChartDoughnut
            data={{
              labels: ["Private PT", "Group PT"],
              datasets:[
                {
                  data: [totalPrivate, totalGroup],
                  backgroundColor: ["#A855F7", "#0EA5E9"]
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

export default PtTypeChart
