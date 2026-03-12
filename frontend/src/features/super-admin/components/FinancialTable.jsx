import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem
} from "@coreui/react"

function FinancialTable() {

  const data = [
    {
      id:1,
      date:"2026-03-01",
      type:"Membership",
      description:"6 Month Package",
      amount:"$549"
    },
    {
      id:2,
      date:"2026-03-02",
      type:"PT Session",
      description:"Personal Training",
      amount:"$120"
    },
    {
      id:3,
      date:"2026-03-03",
      type:"Merchandise",
      description:"Gym Shirt",
      amount:"$35"
    }
  ]

  return (
    <CCard className="shadow-sm border-0">

      <CCardBody>

        <h5 className="fw-bold mb-3">
          Giao Dịch Tài Chính
        </h5>

        <table className="table">

          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
            </tr>
          </thead>

          <tbody>

            {data.map(item=>(
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td className="fw-bold">
                  {item.amount}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

        <div className="d-flex justify-content-end">

          <CPagination>

            <CPaginationItem disabled>
              ‹
            </CPaginationItem>

            <CPaginationItem active>
              1
            </CPaginationItem>

            <CPaginationItem>
              2
            </CPaginationItem>

            <CPaginationItem>
              ›
            </CPaginationItem>

          </CPagination>

        </div>

      </CCardBody>

    </CCard>
  )
}

export default FinancialTable