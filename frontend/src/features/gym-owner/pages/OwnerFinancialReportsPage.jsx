import { useState, useEffect } from "react"
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from "@coreui/react"

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
import { getBranches } from "../../super-admin/services/branchService"

function OwnerFinancialReportsPage() {
  const [activeTab, setActiveTab] = useState(1)
  const [financialData, setFinancialData] = useState(null)
  const [salesData, setSalesData] = useState(null)
  const [ptData, setPtData] = useState([])
  const [checkInData, setCheckInData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filter States
  const [branches, setBranches] = useState([])
  const [selectedBranchId, setSelectedBranchId] = useState("")
  const [timeType, setTimeType] = useState("period") // period, monthYear, custom
  const [period, setPeriod] = useState("month") // month, quarter, year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Modal Temp States (for applying changes only when user clicks Apply)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [tempBranchId, setTempBranchId] = useState("")
  const [tempTimeType, setTempTimeType] = useState("period")
  const [tempPeriod, setTempPeriod] = useState("month")
  const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1)
  const [tempYear, setTempYear] = useState(new Date().getFullYear())
  const [tempFromDate, setTempFromDate] = useState("")
  const [tempToDate, setTempToDate] = useState("")

  // Fetch branches on mount
  useEffect(() => {
    const loadBranchesList = async () => {
      try {
        const data = await getBranches()
        setBranches(data || [])
      } catch (err) {
        console.error("Failed to load branches", err)
      }
    }
    loadBranchesList()
  }, [])

  const getFilterParams = () => {
    const params = {}
    
    if (selectedBranchId) {
      params.branchId = selectedBranchId
    }

    if (timeType === "period") {
      const now = new Date()
      if (period === "month") {
        params.month = now.getMonth() + 1
        params.year = now.getFullYear()
      } else if (period === "quarter") {
        const fromMonth = Math.floor(now.getMonth() / 3) * 3 + 1
        params.fromDate = new Date(now.getFullYear(), fromMonth - 1, 1).toISOString()
        params.toDate = new Date(now.getFullYear(), fromMonth + 2, 0).toISOString()
      } else if (period === "year") {
        params.year = now.getFullYear()
      }
    } else if (timeType === "monthYear") {
      if (selectedMonth !== "all") {
        params.month = parseInt(selectedMonth)
      }
      params.year = parseInt(selectedYear)
    } else if (timeType === "custom") {
      if (fromDate) {
        params.fromDate = new Date(fromDate).toISOString()
      }
      if (toDate) {
        params.toDate = new Date(toDate).toISOString()
      }
    }
    
    return params
  }

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const params = getFilterParams()

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
  }, [selectedBranchId, timeType, period, selectedMonth, selectedYear, fromDate, toDate])

  const handleExport = async () => {
    try {
      const params = getFilterParams()
      
      let reportType = "revenue"
      if (activeTab === 2) reportType = "sales-funnel"
      if (activeTab === 3) reportType = "pt-performance"
      if (activeTab === 4) reportType = "check-in"

      const blob = await exportReport(reportType, params)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${reportType}-report.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export failed", error)
    }
  }

  const handleOpenFilterModal = () => {
    setTempBranchId(selectedBranchId)
    setTempTimeType(timeType)
    setTempPeriod(period)
    setTempMonth(selectedMonth)
    setTempYear(selectedYear)
    setTempFromDate(fromDate)
    setTempToDate(toDate)
    setShowFilterModal(true)
  }

  const handleApplyFilters = () => {
    setSelectedBranchId(tempBranchId)
    setTimeType(tempTimeType)
    setPeriod(tempPeriod)
    setSelectedMonth(tempMonth)
    setSelectedYear(tempYear)
    setFromDate(tempFromDate)
    setToDate(tempToDate)
    setShowFilterModal(false)
  }

  const getTimeFilterLabel = () => {
    if (timeType === "period") {
      if (period === "month") return "Tháng này"
      if (period === "quarter") return "Quý này"
      if (period === "year") return "Đầu năm đến nay"
    } else if (timeType === "monthYear") {
      const monthLabel = selectedMonth === "all" ? "Tất cả các tháng" : `Tháng ${selectedMonth}`
      return `${monthLabel} / Năm ${selectedYear}`
    } else if (timeType === "custom") {
      const from = fromDate ? new Date(fromDate).toLocaleDateString("vi-VN") : "..."
      const to = toDate ? new Date(toDate).toLocaleDateString("vi-VN") : "..."
      return `${from} - ${to}`
    }
    return "Tất cả"
  }

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>
      
      {/* HEADER & TABS (Fixed at top) */}
      <div className="flex-shrink-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-bold mb-1">Hệ Thống Báo Cáo (Owner)</h3>
            <div className="d-flex flex-wrap gap-2 align-items-center" style={{ fontSize: "13px" }}>
              <span className="text-muted">Bộ lọc hiện tại:</span>
              <span className="fw-semibold text-secondary">
                {branches.find(b => (b.branchId || b.id) === selectedBranchId)?.name || "Tất cả chi nhánh"}
              </span>
              <span className="text-muted">•</span>
              <span className="fw-semibold text-secondary">
                {getTimeFilterLabel()}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <CDropdown alignment="end">
              <CDropdownToggle color="light" caret={false} className="border shadow-sm py-1 px-2 fw-semibold" style={{ minWidth: "40px" }}>
                ⋮
              </CDropdownToggle>
              <CDropdownMenu style={{ minWidth: "200px" }}>
                <CDropdownItem onClick={handleOpenFilterModal} style={{ cursor: "pointer" }}>
                  Cấu hình bộ lọc
                </CDropdownItem>
                <CDropdownItem onClick={handleExport} style={{ cursor: "pointer" }}>
                  Xuất báo cáo (CSV)
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
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

      {/* Modal Cấu hình bộ lọc */}
      <CModal visible={showFilterModal} onClose={() => setShowFilterModal(false)} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle className="fw-bold">Cấu hình bộ lọc báo cáo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Branch filter */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Chi Nhánh</label>
            <select
              className="form-select"
              value={tempBranchId}
              onChange={(e) => setTempBranchId(e.target.value)}
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map(b => (
                <option key={b.branchId || b.id} value={b.branchId || b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Type filter */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Loại bộ lọc thời gian</label>
            <select
              className="form-select"
              value={tempTimeType}
              onChange={(e) => setTempTimeType(e.target.value)}
            >
              <option value="period">Theo chu kỳ mặc định</option>
              <option value="monthYear">Theo tháng & năm</option>
              <option value="custom">Khoảng ngày tùy chọn</option>
            </select>
          </div>

          {/* Dynamic inputs based on timeType */}
          {tempTimeType === "period" && (
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted">Chu kỳ</label>
              <select
                className="form-select"
                value={tempPeriod}
                onChange={(e) => setTempPeriod(e.target.value)}
              >
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Đầu năm đến nay</option>
              </select>
            </div>
          )}

          {tempTimeType === "monthYear" && (
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Tháng</label>
                <select
                  className="form-select"
                  value={tempMonth}
                  onChange={(e) => setTempMonth(e.target.value)}
                >
                  <option value="all">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Năm</label>
                <select
                  className="form-select"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tempTimeType === "custom" && (
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Từ ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={tempFromDate}
                  onChange={(e) => setTempFromDate(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Đến ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={tempToDate}
                  onChange={(e) => setTempToDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setShowFilterModal(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleApplyFilters}>
            Áp dụng
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default OwnerFinancialReportsPage
