import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem
} from "@coreui/react"

function ContractsTable() {

  const contracts = [
    {
      id:1,
      member:"Nguyen Van A",
      package:"Gói 6 tháng",
      start:"2025-10-01",
      end:"2026-04-01",
      amount:"$549",
      status:"Active"
    },
    {
      id:2,
      member:"Tran Thi B",
      package:"Gói 1 năm",
      start:"2025-01-10",
      end:"2026-01-10",
      amount:"$999",
      status:"Active"
    },
    {
      id:3,
      member:"Le Van C",
      package:"Gói 3 tháng",
      start:"2025-07-01",
      end:"2025-10-01",
      amount:"$299",
      status:"Expired"
    }
  ]

  return (
    <CCard className="border-0 shadow-sm">

      <CCardBody>

        <table className="table align-middle">

          <thead>
            <tr>
              <th>Hội viên</th>
              <th>Gói tập</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {contracts.map(item=>(
              <tr key={item.id}>

                <td>{item.member}</td>

                <td>{item.package}</td>

                <td>{item.start}</td>

                <td>{item.end}</td>

                <td className="fw-bold">
                  {item.amount}
                </td>

                <td>
                  {item.status==="Active" ? (
                    <span className="badge bg-success">
                      Active
                    </span>
                  ):(
                    <span className="badge bg-danger">
                      Expired
                    </span>
                  )}
                </td>

                <td>
                  <button className="btn btn-light btn-sm">
                    Xem
                  </button>
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

export default ContractsTable