import { CCard, CCardBody } from "@coreui/react"

function SalesPerformanceTable({ salesData }) {
  const staffData = salesData?.salesByStaff || []

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Hiệu Suất Nhân Viên Sales
        </h5>
        
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tên Nhân Viên</th>
              <th>Leads Được Giao</th>
              <th>Số Lượng Chốt Deal</th>
              <th>Tỷ Lệ Chốt</th>
              <th>Hoa Hồng</th>
            </tr>
          </thead>
          <tbody>
            {staffData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">Không có dữ liệu</td>
              </tr>
            )}
            {staffData.map(item => {
              const conversionRate = item.leadsAssigned > 0 
                ? ((item.conversionCount / item.leadsAssigned) * 100).toFixed(1) 
                : 0
                
              return (
                <tr key={item.staffId}>
                  <td className="fw-semibold">{item.staffName}</td>
                  <td>{item.leadsAssigned}</td>
                  <td>{item.conversionCount}</td>
                  <td>{conversionRate}%</td>
                  <td className="fw-bold text-success">
                    {formatCurrency(item.totalSalesCommission)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  )
}

export default SalesPerformanceTable
