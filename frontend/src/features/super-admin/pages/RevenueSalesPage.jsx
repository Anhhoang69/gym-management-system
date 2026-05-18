import StatsCards from "../components/common/StatsCards"
import RevenueChart from "../components/dashboard/RevenueChart"
import SalesTable from "../components/revenue-sales/SalesTable"

import {
  cilDollar,
  cilCart,
  cilChartLine,
  cilLoopCircular
} from "@coreui/icons"

function RevenueSalesPage() {

  const stats = [
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
      title: "Tổng Giao Dịch",
      value: "1,284",
      change: "+8% so với tháng trước",
      icon: cilCart,
      bg: "#DBEAFE",
      color: "#3B82F6",
      positive: true
    },
    {
      title: "Giá Trị Đơn TB",
      value: "$69",
      change: "+5% so với tháng trước",
      icon: cilChartLine,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: true
    },
    {
      title: "Hoàn Tiền",
      value: "$1,240",
      change: "-2% so với tháng trước",
      icon: cilLoopCircular,
      bg: "#FEE2E2",
      color: "#EF4444",
      positive: false
    }
  ]

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Doanh Thu & Bán Hàng</h3>
        <p className="text-muted mb-0">
          Theo dõi doanh thu và các giao dịch bán hàng
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Chart */}
      <div className="mt-4">
        <RevenueChart />
      </div>

      {/* Table */}
      <div className="mt-4">
        <SalesTable />
      </div>

    </div>
  )
}

export default RevenueSalesPage