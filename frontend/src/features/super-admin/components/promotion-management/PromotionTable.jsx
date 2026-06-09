import {
  CBadge,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CProgress
} from "@coreui/react"

const statusColor = {
  active: "success",
  inactive: "secondary",
  expired: "danger",
}

const discountColor = {
  Percentage: "info",
  FixedAmount: "warning"
}

function PromotionTable({
  promotions = [],
  selectedIds = [],
  onToggleSelect = () => {},
  onToggleSelectAll = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onToggleStatus = () => {},
}) {

  const allChecked =
    promotions.length &&
    promotions.every((p) => selectedIds.includes(p.id))

  return (
    <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
      <thead
        style={{
          position: "sticky",
          top: 0,
          background: "#f9fafb",
          zIndex: 2,
          boxShadow: "0 1px 0 #e5e7eb",
        }}
      >
        <tr>
          <th style={{ width: 48, padding: "12px 16px" }}>
            <CFormCheck
              checked={allChecked}
              onChange={(e) =>
                onToggleSelectAll(e.target.checked)
              }
            />
          </th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Khuyến Mãi</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Giảm Giá</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Chi Nhánh</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Hợp Đồng</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Sử Dụng</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Hiệu Lực</th>
          <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Trạng Thái</th>
          <th style={{ width: 80, padding: "12px 16px" }}></th>
        </tr>
      </thead>
      <tbody>
        {(!promotions || promotions.length === 0) ? (
          <tr>
            <td colSpan="9" className="text-center text-muted py-4">
              Không tìm thấy mã giảm giá nào.
            </td>
          </tr>
        ) : (
          promotions.map((promo) => {
            const percent =
              promo.maxUsage > 0
                ? Math.round(
                    (promo.usage / promo.maxUsage) * 100
                  )
                : 0

            return (
              <tr key={promo.id} className="user-row">
                {/* Checkbox */}
                <td style={{ padding: "14px 16px" }}>
                  <CFormCheck
                    checked={selectedIds.includes(promo.id)}
                    onChange={() =>
                      onToggleSelect(promo.id)
                    }
                  />
                </td>

                {/* Promotion */}
                <td style={{ padding: "14px 16px" }}>
                  <div className="fw-semibold text-dark">
                    {promo.name}
                  </div>
                  <small className="text-muted">
                    Mã: {promo.code}
                  </small>
                </td>

                {/* Discount */}
                <td style={{ padding: "14px 16px" }}>
                  <CBadge
                    color={discountColor[promo.type]}
                    className="px-2 py-1.5"
                    style={{ fontSize: "11px", fontWeight: "600" }}
                  >
                    {promo.value}
                  </CBadge>
                </td>

                {/* Branch */}
                <td style={{ padding: "14px 16px" }}>
                  <span className="badge bg-light text-dark px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "500", border: "1px solid #e5e7eb" }}>
                    {promo.branch}
                  </span>
                </td>

                {/* Contract */}
                <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                  <small className="fw-medium">
                    {promo.contractType}
                  </small>
                </td>

                {/* Usage */}
                <td style={{ minWidth: 160, padding: "14px 16px" }}>
                  <div className="small mb-1 fw-medium text-dark">
                    {promo.usage} / {promo.maxUsage}
                  </div>
                  <CProgress
                    value={percent}
                    size="sm"
                    color="info"
                  />
                </td>

                {/* Validity */}
                <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                  <small className="fw-medium">
                    {promo.start} - {promo.end}
                  </small>
                </td>

                {/* Status */}
                <td style={{ padding: "14px 16px" }}>
                  <CBadge
                    color={statusColor[promo.status]}
                    className="px-2 py-1.5"
                    style={{ fontSize: "11px", fontWeight: "600" }}
                  >
                    {promo.status === "active"
                      ? "Hoạt động"
                      : promo.status === "inactive"
                      ? "Tạm ngưng"
                      : "Hết hạn"}
                  </CBadge>
                </td>

                {/* Actions */}
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <CDropdown alignment="end" onClick={(e) => e.stopPropagation()}>
                    <CDropdownToggle color="light" size="sm" caret={false} className="border shadow-sm" style={{ minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      ⋮
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => onEdit(promo)}>
                        Chỉnh sửa
                      </CDropdownItem>
                      {promo.status === "active" ? (
                        <CDropdownItem onClick={() => onToggleStatus(promo.id, "Inactive")}>
                          Tạm ngưng
                        </CDropdownItem>
                      ) : (
                        <CDropdownItem onClick={() => onToggleStatus(promo.id, "Active")}>
                          Kích hoạt
                        </CDropdownItem>
                      )}
                      <CDropdownItem className="text-danger border-top" onClick={() => onDelete(promo)}>
                        Xóa
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}

export default PromotionTable