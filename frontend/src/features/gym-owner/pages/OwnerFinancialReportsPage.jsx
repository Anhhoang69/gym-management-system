import { useState, useEffect } from "react"
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from "@coreui/react"

// Financial Components
import FinancialStats from "../../super-admin/components/financial-reports/FinancialStats"
import RevenueExpenseChart from "../../super-admin/components/financial-reports/RevenueExpenseChart"
import RevenueBreakdown from "../../super-admin/components/revenue-sales/RevenueBreakdown"
import FinancialTable from "../../super-admin/components/financial-reports/FinancialTable"

// Sales Funnel Components
import SalesFunnelStats from "../../super-admin/components/sales-funnel/SalesFunnelStats"
import LeadsStatusChart from "../../super-admin/components/sales-funnel/LeadsStatusChart"
import LeadsSourceChart from "../../super-admin/components/sales-funnel/LeadsSourceChart"
import SalesPerformanceTable from "../../super-admin/components/sales-funnel/SalesPerformanceTable"

// PT Performance Components
import PtPerformanceStats from "../../super-admin/components/pt-performance/PtPerformanceStats"
import PtTypeChart from "../../super-admin/components/pt-performance/PtTypeChart"
import TopPtChart from "../../super-admin/components/pt-performance/TopPtChart"
import PtPerformanceTable from "../../super-admin/components/pt-performance/PtPerformanceTable"

// Check-in & Traffic Components
import CheckInStats from "../../super-admin/components/check-in/CheckInStats"
import CheckInByDayChart from "../../super-admin/components/check-in/CheckInByDayChart"
import CheckInByHourChart from "../../super-admin/components/check-in/CheckInByHourChart"

import { getRevenueReport, getSalesFunnelReport, getPtPerformanceReport, getCheckInReport, exportReport } from "../../super-admin/services/reportService"

function OwnerFinancialReportsPage() {
  const [activeTab, setActiveTab] = useState(1)
  const [financialData, setFinancialData] = useState(null)
  const [salesData, setSalesData] = useState(null)
  const [ptData, setPtData] = useState([])
  const [checkInData, setCheckInData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("month") // month, quarter, year

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        let params = {}
        const now = new Date()
        if (filter === "month") {
          params = { month: now.getMonth() + 1, year: now.getFullYear() }
        } else if (filter === "quarter") {
          const fromMonth = Math.floor(now.getMonth() / 3) * 3 + 1
          params = { fromDate: new Date(now.getFullYear(), fromMonth - 1, 1).toISOString(), toDate: new Date(now.getFullYear(), fromMonth + 2, 0).toISOString() }
        } else if (filter === "year") {
          params = { year: now.getFullYear() }
        }

        const [revenueRes, salesRes, ptRes, checkInRes] = await Promise.all([
          getRevenueReport(params),
          getSalesFunnelReport(params),
          getPtPerformanceReport(params),
          getCheckInReport(params)
        ])

        setFinancialData(revenueRes)
        setSalesData(salesRes)
        setPtData(ptRes || [])
        setCheckInData(checkInRes)
      } catch (error) {
        console.error("Failed to fetch reports", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [filter])

  const handleExport = async () => {
    try {
      let params = {}
      const now = new Date()
      if (filter === "month") {
        params = { month: now.getMonth() + 1, year: now.getFullYear() }
      } else if (filter === "year") {
        params = { year: now.getFullYear() }
      }
      // Export based on active tab
      let reportType = 'revenue'
      if (activeTab === 2) reportType = 'sales-funnel'
      if (activeTab === 3) reportType = 'pt-performance'
      if (activeTab === 4) reportType = 'check-in'

      const blob = await exportReport(reportType, params)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}-report.csv`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error("Export failed", error)
    }
  }

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>
      
      {/* HEADER & TABS (Fixed at top) */}
      <div className="flex-shrink-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1">Hệ Thống Báo Cáo (Owner)</h3>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "160px" }}
            >
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Đầu năm đến nay</option>
            </select>
            <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
              Xuất CSV
            </button>
          </div>
        </div>

        <CNav variant="tabs" className="mb-3">
          <CNavItem>
            <CNavLink
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
              style={{ cursor: "pointer", fontWeight: activeTab === 1 ? "bold" : "normal" }}
            >
              Tài Chính & Doanh Thu
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
              style={{ cursor: "pointer", fontWeight: activeTab === 2 ? "bold" : "normal" }}
            >
              Sales Funnel & Leads
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 3}
              onClick={() => setActiveTab(3)}
              style={{ cursor: "pointer", fontWeight: activeTab === 3 ? "bold" : "normal" }}
            >
              Hiệu Suất PT
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 4}
              onClick={() => setActiveTab(4)}
              style={{ cursor: "pointer", fontWeight: activeTab === 4 ? "bold" : "normal" }}
            >
              Check-in & Traffic
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      {/* TAB CONTENT (Scrollable Area) */}
      <div className="flex-grow-1 pe-2" style={{ overflowY: "scroll", overflowX: "hidden", paddingBottom: "20px" }}>

      {loading ? (
        <div className="text-center my-5">Đang tải báo cáo...</div>
      ) : (
        <CTabContent>
          {/* TAB 1: FINANCIAL */}
          <CTabPane visible={activeTab === 1}>
            <FinancialStats financialData={financialData} />
            <div className="row mt-3 g-3">
              <div className="col-md-8">
                <RevenueExpenseChart revenueData={financialData} />
              </div>
              <div className="col-md-4">
                <RevenueBreakdown revenueData={financialData} />
              </div>
            </div>
            <div className="mt-3">
              <FinancialTable revenueData={financialData} />
            </div>
          </CTabPane>

          {/* TAB 2: SALES FUNNEL */}
          <CTabPane visible={activeTab === 2}>
            <SalesFunnelStats salesData={salesData} />
            <div className="row mt-3 g-3">
              <div className="col-md-8">
                <LeadsStatusChart salesData={salesData} />
              </div>
              <div className="col-md-4">
                <LeadsSourceChart salesData={salesData} />
              </div>
            </div>
            <div className="mt-3">
              <SalesPerformanceTable salesData={salesData} />
            </div>
          </CTabPane>
          
          {/* TAB 3: PT PERFORMANCE */}
          <CTabPane visible={activeTab === 3}>
            <PtPerformanceStats ptData={ptData} />
            <div className="row mt-3 g-3">
              <div className="col-md-4">
                <PtTypeChart ptData={ptData} />
              </div>
              <div className="col-md-8">
                <TopPtChart ptData={ptData} />
              </div>
            </div>
            <div className="mt-3">
              <PtPerformanceTable ptData={ptData} />
            </div>
          </CTabPane>
          
          {/* TAB 4: CHECK-IN & TRAFFIC */}
          <CTabPane visible={activeTab === 4}>
            <CheckInStats checkInData={checkInData} />
            <div className="row mt-3 g-3">
              <div className="col-md-7">
                <CheckInByDayChart checkInData={checkInData} />
              </div>
              <div className="col-md-5">
                <CheckInByHourChart checkInData={checkInData} />
              </div>
            </div>
          </CTabPane>
        </CTabContent>
      )}

      </div>
    </div>
  )
}

export default OwnerFinancialReportsPage
