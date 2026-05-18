import { CCard, CCardBody } from "@coreui/react"

function RecentActivities() {
  const activities = [
    {
      title: "Đăng ký thành viên mới",
      desc: "Sarah Johnson tham gia gói Premium",
      time: "2 phút trước",
    },
    {
      title: "Thanh toán đã nhận",
      desc: "$290 từ Mike Chen - gói 6 tháng",
      time: "15 phút trước",
    },
    {
      title: "Buổi PT đã đặt",
      desc: "Emma Davis đặt với HLV Alex",
      time: "32 phút trước",
    },
  ]

  return (
    <CCard style={{ width: "100%", height: "100%" }}>
      <CCardBody>

        <div className="d-flex justify-content-between mb-3">
          <h5>Hoạt Động Gần Đây</h5>
          <a href="#">Xem Tất Cả</a>
        </div>

        {activities.map((a, index) => (
          <div key={index} className="mb-3">
            <strong>{a.title}</strong>
            <div>{a.desc}</div>
            <small>{a.time}</small>
          </div>
        ))}

      </CCardBody>
    </CCard>
  )
}

export default RecentActivities