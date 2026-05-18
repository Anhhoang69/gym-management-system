import { CCard, CCardBody } from "@coreui/react"

function RevenueStats() {

  const stats = [
    {
      title: "Doanh Thu Hôm Nay",
      value: "$4,230"
    },
    {
      title: "Doanh Thu Tháng",
      value: "$103,600"
    },
    {
      title: "Tổng Đơn Hàng",
      value: "847"
    },
    {
      title: "Giá Trị Đơn TB",
      value: "$122"
    }
  ]

  return (
    <div className="row g-4">

      {stats.map((item, index) => (

        <div className="col-md-3" key={index}>
          <CCard className="shadow-sm border-0">
            <CCardBody>

              <p className="text-muted mb-1">
                {item.title}
              </p>

              <h3 className="fw-bold">
                {item.value}
              </h3>

            </CCardBody>
          </CCard>
        </div>

      ))}

    </div>
  )
}

export default RevenueStats