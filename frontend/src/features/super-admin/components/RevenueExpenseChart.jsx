import { CCard, CCardBody } from "@coreui/react"
import { CChartLine } from "@coreui/react-chartjs"

function RevenueExpenseChart() {

  return (
    <CCard className="border-0 shadow-sm">

      <CCardBody>

        <h5 className="fw-bold mb-3">
          Doanh Thu vs Chi Phí
        </h5>

        <div style={{ height: 320 }}>

          <CChartLine
            data={{
              labels:["Jan","Feb","Mar","Apr","May","Jun"],
              datasets:[
                {
                  label:"Revenue",
                  borderColor:"#ffc107",
                  backgroundColor:"rgba(255,193,7,0.2)",
                  data:[20000,24000,26000,30000,28000,32000]
                },
                {
                  label:"Expense",
                  borderColor:"#dc3545",
                  backgroundColor:"rgba(220,53,69,0.2)",
                  data:[12000,14000,15000,16000,17000,18000]
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

export default RevenueExpenseChart