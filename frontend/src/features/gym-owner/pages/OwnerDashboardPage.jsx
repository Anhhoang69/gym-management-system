import { useState, useEffect } from "react"
import StatsCards from "../../super-admin/components/common/StatsCards"
import RevenueChart from "../../super-admin/components/dashboard/RevenueChart"
import MemberDistribution from "../../super-admin/components/dashboard/MemberDistribution"
import RecentMembers from "../../super-admin/components/dashboard/RecentMembers"
import RecentActivities from "../../super-admin/components/dashboard/RecentActivities"
import SystemAlerts from "../../super-admin/components/dashboard/SystemAlerts"
import { getOverview, getRevenueReport } from "../../super-admin/services/reportService"

import {
  cilPeople,
  cilCreditCard,
  cilDollar,
  cilClock
} from "@coreui/icons"

function OwnerDashboardPage() {
  const [overviewData, setOverviewData] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const currentYear = new Date().getFullYear()
        const fromDate = `${currentYear}-01-01T00:00:00Z`
        const toDate = `${currentYear}-12-31T23:59:59Z`

        const [overview, revenue] = await Promise.all([
          getOverview(),
          getRevenueReport({ fromDate, toDate })
        ])
        setOverviewData(overview)
        setRevenueData(revenue)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = overviewData ? [
    {
      title: "Tổng Số Thành Viên",
      value: overviewData.activeMembersTotal?.toLocaleString("vi-VN") || "0",
      change: `${overviewData.newMembersMtd > 0 ? '+' : ''}${overviewData.newMembersMtd} trong tháng này`,
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B",
      positive: overviewData.newMembersMtd >= 0
    },
    {
      title: "Tỷ Lệ Chuyển Đổi (Lead)",
      value: `${overviewData.leadConversionRateMtd || 0}%`,
      change: "Hiệu suất Sales tháng này",
      icon: cilCreditCard,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true
    },
    {
      title: "Doanh Thu Tháng",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overviewData.totalRevenueMtd || 0),
      change: `${overviewData.revenueGrowthPercent > 0 ? '+' : ''}${overviewData.revenueGrowthPercent}% so với tháng trước`,
      icon: cilDollar,
      bg: "#F3E8FF",
      color: "#A855F7",
      positive: overviewData.revenueGrowthPercent >= 0
    },
    {
      title: "Check-in Hôm Nay",
      value: overviewData.checkInsTodayTotal?.toLocaleString("vi-VN") || "0",
      change: "Lượt khách đến phòng tập",
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: true
    }
  ] : []

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Tổng Quan Dashboard (Owner)</h3>
          <p className="text-muted mb-0">
            Chào mừng bạn quay lại hệ thống quản lý EnerGym!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">Đang tải dữ liệu...</div>
      ) : (
        <>
          <StatsCards stats={stats} />

          {/* Charts */}
          <div className="row mt-4 g-4 align-items-stretch">
            <div className="col-md-6">
              <RevenueChart revenueData={revenueData} />
            </div>
            <div className="col-md-6">
              <MemberDistribution revenueData={revenueData} />
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
        </>
      )}
    </div>
  )
}

export default OwnerDashboardPage
