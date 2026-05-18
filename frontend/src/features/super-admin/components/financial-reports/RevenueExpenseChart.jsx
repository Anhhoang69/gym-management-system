import { CCard, CCardBody } from "@coreui/react"
import { CChartBar } from "@coreui/react-chartjs"

function RevenueExpenseChart({ revenueData }) {
  const branches = revenueData?.revenueByBranch || []
  const labels = branches.length > 0 ? branches.map(item => item.branchName) : ["Chi nhánh A", "Chi nhánh B"]
  const data = branches.length > 0 ? branches.map(item => item.revenue) : [1000000, 2000000]

  return (
    <CCard className="border-0 shadow-sm h-100">

      <CCardBody>

        <h5 className="fw-bold mb-4">
          Doanh Thu Theo Chi Nhánh
        </h5>

        <div style={{ position: "relative", width: "100%" }}>

          <CChartBar
            data={{
              labels: labels,
              datasets:[
                {
                  label:"Doanh Thu (VND)",
                  backgroundColor:"#A855F7",
                  data: data
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
                  ticks: {
                    callback: function(value) {
                      if (value >= 1000000) {
                        return (value / 1000000) + 'M';
                      }
                      return value;
                    }
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

export default RevenueExpenseChart