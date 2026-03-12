import StatsCards from "../components/StatsCards"
import RevenueChart from "../components/RevenueChart"
import MemberDistribution from "../components/MemberDistribution"
import RecentMembers from "../components/RecentMembers"
import RecentActivities from "../components/RecentActivities"
import SystemAlerts from "../components/SystemAlerts"

import {
  cilPeople,
  cilCreditCard,
  cilDollar,
  cilClock
} from "@coreui/icons"

function DashboardPage() {

  const stats = [
    {
      title: "Tổng Số Thành Viên",
      value: "2,847",
      change: "+12% so với tháng trước",
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B",
      positive: true
    },
    {
      title: "Gói Đang Hoạt Động",
      value: "1,923",
      change: "+8% so với tháng trước",
      icon: cilCreditCard,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true
    },
    {
      title: "Doanh Thu Tháng",
      value: "$89,420",
      change: "+15% so với tháng trước",
      icon: cilDollar,
      bg: "#F3E8FF",
      color: "#A855F7",
      positive: true
    },
    {
      title: "Điểm Danh Hôm Nay",
      value: "421",
      change: "-3% so với hôm qua",
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: false
    }
  ]

  return (
    <div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Tổng Quan Dashboard</h3>
          <p className="text-muted mb-0">
            Chào mừng bạn quay lại!
          </p>
        </div>

      </div>

      <StatsCards stats={stats} />

      {/* Charts */}
      <div className="row mt-4 g-4 align-items-stretch">

        <div className="col-md-6">
          <RevenueChart />
        </div>

        <div className="col-md-6">
          <MemberDistribution />
        </div>

      </div>

      {/* Members + Activities */}
      <div className="row mt-4">

        <div className="col-md-6">
          <RecentMembers />
        </div>

        <div className="col-md-6">
          <RecentActivities />
        </div>

      </div>

      {/* Alerts */}
      <div className="row mt-4">

        <div className="col-md-6">
          <SystemAlerts />
        </div>

      </div>

    </div>
  )
}

export default DashboardPage