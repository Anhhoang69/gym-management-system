import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem
} from "@coreui/react"

function AttendanceTable() {

  const data = [
    {
      id:1,
      member:"Nguyen Van A",
      branch:"Downtown",
      checkin:"08:15",
      checkout:"09:40",
      duration:"1h25m",
      status:"Completed"
    },
    {
      id:2,
      member:"Tran Thi B",
      branch:"Westside",
      checkin:"09:00",
      checkout:"--",
      duration:"--",
      status:"In Gym"
    }
  ]

  return (
    <CCard className="shadow-sm border-0">

      <CCardBody>

        <table className="table align-middle">

          <thead>
            <tr>
              <th>Hội viên</th>
              <th>Chi nhánh</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Thời gian tập</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {data.map(item => (

              <tr key={item.id}>
                <td>{item.member}</td>
                <td>{item.branch}</td>
                <td>{item.checkin}</td>
                <td>{item.checkout}</td>
                <td>{item.duration}</td>

                <td>
                  {item.status === "Completed" ? (
                    <span className="badge bg-success">
                      Hoàn thành
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Đang tập
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

export default AttendanceTable