import { CCard, CCardBody } from "@coreui/react"
import { CChartPie } from "@coreui/react-chartjs"

function MemberDistribution() {
  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <h5>Phân Bố Thành Viên</h5>

        <CChartPie style={{ width: "50%", height: "100%" }}
          data={{
            labels: ["Premium", "Standard", "Basic", "Trả Ngày"],
            datasets: [
              {
                data: [45, 30, 10, 15],
                backgroundColor: [
                  "#ffc107",
                  "#28a745",
                  "#0d6efd",
                  "#dc3545",
                ],
              },
            ],
          }}
        />

      </CCardBody>
    </CCard>
  )
}

export default MemberDistribution