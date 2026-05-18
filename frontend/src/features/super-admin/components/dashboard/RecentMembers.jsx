import { CCard, CCardBody, CBadge } from "@coreui/react"

function RecentMembers() {
  const members = [
    {
      name: "Sarah Johnson",
      email: "sarah@gympro.com",
      package: "Premium 12M",
      status: "Hoạt động",
    },
    {
      name: "Mike Chen",
      email: "mike@gympro.com",
      package: "Basic 6M",
      status: "Đang chờ",
    },
    {
      name: "Emma Davis",
      email: "emma@gympro.com",
      package: "Standard 3M",
      status: "Hoạt động",
    },
  ]

  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <div className="d-flex justify-content-between mb-3">
          <h5>Thành Viên Gần Đây</h5>
          <a href="#">Xem Tất Cả</a>
        </div>

        {members.map((m, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div>
              <div>{m.name}</div>
              <small>{m.email}</small>
            </div>

            <div>
              <small>{m.package}</small>
            </div>

            <CBadge color={m.status === "Hoạt động" ? "success" : "warning"}>
              {m.status}
            </CBadge>
          </div>
        ))}

      </CCardBody>
    </CCard>
  )
}

export default RecentMembers