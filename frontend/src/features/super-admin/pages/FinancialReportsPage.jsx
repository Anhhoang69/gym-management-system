import FinancialStats from "../components/FinancialStats"
import RevenueExpenseChart from "../components/RevenueExpenseChart"
import RevenueBreakdown from "../components/RevenueBreakdown"
import FinancialTable from "../components/FinancialTable"

function FinancialReportsPage() {
  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Báo Cáo Tài Chính</h3>
          <p className="text-muted mb-0">
            Phân tích doanh thu, chi phí và lợi nhuận
          </p>
        </div>

        <select className="form-select" style={{ width: 200 }}>
          <option>Tháng này</option>
          <option>Quý này</option>
          <option>Năm nay</option>
        </select>

      </div>

      <FinancialStats />

      <div className="row mt-4 g-4">

        <div className="col-md-8">
          <RevenueExpenseChart />
        </div>

        <div className="col-md-4">
          <RevenueBreakdown />
        </div>

      </div>

      <div className="mt-4">
        <FinancialTable />
      </div>

    </div>
  )
}

export default FinancialReportsPage