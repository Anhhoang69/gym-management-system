import { CCard, CCardBody } from "@coreui/react"
import { CChartPie } from "@coreui/react-chartjs"

function RevenueBreakdown() {

  return (
    <CCard className="border-0 shadow-sm">

      <CCardBody>

        <h5 className="fw-bold mb-3">
          Cơ Cấu Doanh Thu
        </h5>

        <div style={{ height:300 }}>

          <CChartPie
            data={{
              labels:[
                "Membership",
                "PT Sessions",
                "Merchandise"
              ],
              datasets:[
                {
                  data:[65,25,10],
                  backgroundColor:[
                    "#ffc107",
                    "#0d6efd",
                    "#20c997"
                  ]
                }
              ]
            }}
            options={{
              maintainAspectRatio:false
            }}
          />

        </div>

      </CCardBody>

    </CCard>
  )
}

export default RevenueBreakdown