import { CCard, CCardBody } from "@coreui/react"

function FinancialStats() {

  const stats = [
    { title:"Doanh Thu", value:"$120,400" },
    { title:"Chi Phí", value:"$48,200" },
    { title:"Lợi Nhuận", value:"$72,200" },
    { title:"Tăng Trưởng", value:"+12%" }
  ]

  return (
    <div className="row g-4">

      {stats.map((item,index)=>(
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

export default FinancialStats