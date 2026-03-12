import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem
} from "@coreui/react"

function SalesTable() {

  const sales = [
    {
      id:1,
      member:"Nguyen Van A",
      package:"Gói 6 tháng",
      amount:"$549",
      date:"2026-03-15",
      status:"Paid"
    },
    {
      id:2,
      member:"Tran Thi B",
      package:"Gói 1 năm",
      amount:"$999",
      date:"2026-03-14",
      status:"Paid"
    },
    {
      id:3,
      member:"Le Van C",
      package:"Gói 3 tháng",
      amount:"$299",
      date:"2026-03-13",
      status:"Pending"
    }
  ]

  return (
    <CCard className="border-0 shadow-sm">

      <CCardBody>

        <h5 className="fw-bold mb-3">
          Giao Dịch Gần Đây
        </h5>

        <table className="table align-middle">

          <thead>
            <tr>
              <th>Hội viên</th>
              <th>Gói tập</th>
              <th>Số tiền</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>

            {sales.map(item => (

              <tr key={item.id}>

                <td>{item.member}</td>

                <td>{item.package}</td>

                <td className="fw-bold">
                  {item.amount}
                </td>

                <td>{item.date}</td>

                <td>
                  {item.status === "Paid" ? (
                    <span className="badge bg-success">
                      Paid
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Pagination */}

        <div className="d-flex justify-content-end mt-3">

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

export default SalesTable