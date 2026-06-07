import SalesTable from "../../super-admin/components/revenue-sales/SalesTable"

function RevenueSalesPage() {
  const storedUser = localStorage.getItem("user")
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const myBranchId = currentUser?.branchId || ""

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
        <SalesTable fixedBranchId={myBranchId} hideBranchFilter={true} />
      </div>

    </div>
  )
}

export default RevenueSalesPage