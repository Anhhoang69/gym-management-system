import PackageCard from "./PackageCard"

function PackageGrid({ onEdit }) {

  const packages = [
    {
      id: 1,
      name: "Gói Cơ Bản 3 Tháng",
      duration: "3 tháng",
      price: 299,
      popularity: 88,
      members: 847,
      features: [
        "Sử dụng thiết bị phòng gym",
        "Sử dụng phòng locker",
        "Đánh giá thể lực miễn phí",
        "Truy cập ứng dụng di động"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Gói Tiêu Chuẩn 6 Tháng",
      duration: "6 tháng",
      price: 549,
      popularity: 76,
      members: 625,
      features: [
        "Tất cả tính năng cơ bản",
        "2 buổi tập PT cá nhân",
        "Truy cập nhóm lớp học",
        "Tư vấn dinh dưỡng"
      ]
    },
    {
      id: 3,
      name: "Gói Cao Cấp 1 Năm",
      duration: "12 tháng",
      price: 999,
      popularity: 65,
      members: 412,
      features: [
        "Tất cả tính năng tiêu chuẩn",
        "Tập PT không giới hạn",
        "Ưu tiên đặt lớp",
        "Guest passes"
      ]
    },
    {
      id: 4,
      name: "Gói Dùng Thử 1 Tháng",
      duration: "1 tháng",
      price: 99,
      popularity: 52,
      members: 289,
      features: [
        "Truy cập cơ bản",
        "Phòng locker",
        "1 buổi đánh giá thể lực",
        "Ứng dụng di động"
      ]
    }
  ]

  return (
    <div className="row g-4">

      {packages.map(pkg => (
        <div className="col-md-3" key={pkg.id}>
          <PackageCard
            pkg={pkg}
            onEdit={onEdit}
          />
        </div>
      ))}

    </div>
  )
}

export default PackageGrid