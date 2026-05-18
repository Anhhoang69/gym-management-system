import { CCard, CCardBody } from "@coreui/react"

function PtPerformanceTable({ ptData }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h5 className="fw-bold mb-4">
          Chi Tiết Hiệu Suất Cá Nhân (PT)
        </h5>
        
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tên PT</th>
              <th>Chi Nhánh</th>
              <th>Tổng Buổi Dạy</th>
              <th>Hội Viên (Đang Dạy)</th>
              <th>Buổi Cá Nhân</th>
              <th>Buổi Nhóm</th>
              <th>Thưởng KPI</th>
            </tr>
          </thead>
          <tbody>
            {ptData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">Không có dữ liệu</td>
              </tr>
            )}
            {ptData.map(item => (
              <tr key={item.ptStaffId}>
                <td className="fw-semibold">{item.ptName}</td>
                <td>{item.branchName}</td>
                <td className="fw-bold text-primary">{item.totalSessions}</td>
                <td>{item.totalMembers}</td>
                <td>{item.privatePtCount}</td>
                <td>{item.groupPtCount}</td>
                <td className="fw-bold text-success">
                  {formatCurrency(item.kpiBonus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  )
}

export default PtPerformanceTable
