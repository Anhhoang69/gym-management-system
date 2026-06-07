import SalesTable from "../components/revenue-sales/SalesTable"

function RevenueSalesPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Doanh Thu & Bán Hàng</h3>
        <p className="text-muted mb-0">
          Theo dõi doanh thu và các giao dịch bán hàng
        </p>
      </div>

      {/* Table */}
      <div className="mt-4">
        <SalesTable />
      </div>

    </div>
  )
}

export default RevenueSalesPage