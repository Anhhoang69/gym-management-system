import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from "@coreui/react"
import { useState } from "react"

function FinancialTable({ revenueData }) {
  const [activeKey, setActiveKey] = useState(1)
  const packages = revenueData?.revenueByPackage || []
  const branches = revenueData?.revenueByBranch || []

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <CNav variant="pills" className="mb-4">
          <CNavItem>
            <CNavLink
              active={activeKey === 1}
              onClick={() => setActiveKey(1)}
              style={{ cursor: "pointer" }}
            >
              Doanh Thu Theo Chi Nhánh
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeKey === 2}
              onClick={() => setActiveKey(2)}
              style={{ cursor: "pointer" }}
            >
              Doanh Thu Theo Gói Tập
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeKey === 1}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID Chi Nhánh</th>
                  <th>Tên Chi Nhánh</th>
                  <th>Số Lượng Hóa Đơn</th>
                  <th>Tổng Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {branches.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">Không có dữ liệu</td>
                  </tr>
                )}
                {branches.map(item => (
                  <tr key={item.branchId}>
                    <td>{item.branchId.substring(0, 8)}...</td>
                    <td>{item.branchName}</td>
                    <td>{item.invoiceCount}</td>
                    <td className="fw-bold text-primary">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CTabPane>

          <CTabPane visible={activeKey === 2}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID Gói</th>
                  <th>Tên Gói</th>
                  <th>Số Lượng Hợp Đồng</th>
                  <th>Tổng Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">Không có dữ liệu</td>
                  </tr>
                )}
                {packages.map(item => (
                  <tr key={item.packageId}>
                    <td>{item.packageId.substring(0, 8)}...</td>
                    <td>{item.packageName}</td>
                    <td>{item.contractCount}</td>
                    <td className="fw-bold text-success">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CTabPane>
        </CTabContent>

      </CCardBody>
    </CCard>
  )
}

export default FinancialTable