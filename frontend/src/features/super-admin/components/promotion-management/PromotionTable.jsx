import {
  CCard,
  CCardBody,
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

    <CCard className="mt-4">
      <CCardBody>

        <table className="table align-middle">

          <thead>

            <tr>

              <th style={{ width: 36 }}>
                <CFormCheck
                  checked={allChecked}
                  onChange={(e) =>
                    onToggleSelectAll(e.target.checked)
                  }
                />
              </th>

              <th>Promotion</th>
              <th>Discount</th>
              <th>Branch</th>
              <th>Contract</th>
              <th>Usage</th>
              <th>Validity</th>
              <th>Status</th>
              <th style={{ width: 50 }}></th>

            </tr>

          </thead>

          <tbody>

            {promotions.map((promo) => {

              const percent =
                promo.maxUsage > 0
                  ? Math.round(
                      (promo.usage / promo.maxUsage) * 100
                    )
                  : 0

              return (

                <tr key={promo.id}>

                  {/* Checkbox */}

                  <td>
                    <CFormCheck
                      checked={selectedIds.includes(promo.id)}
                      onChange={() =>
                        onToggleSelect(promo.id)
                      }
                    />
                  </td>

                  {/* Promotion */}

                  <td>

                    <div className="fw-semibold">
                      {promo.name}
                    </div>

                    <small className="text-muted">
                      Code: {promo.code}
                    </small>

                  </td>

                  {/* Discount */}

                  <td>

                    <CBadge
                      color={discountColor[promo.type]}
                    >
                      {promo.value}
                    </CBadge>

                  </td>

                  {/* Branch */}

                  <td>

                    <span className="badge bg-light text-dark">
                      {promo.branch}
                    </span>

                  </td>

                  {/* Contract */}

                  <td>

                    <small className="text-muted">
                      {promo.contractType}
                    </small>

                  </td>

                  {/* Usage */}

                  <td style={{ minWidth: 160 }}>

                    <div className="small mb-1">
                      {promo.usage} / {promo.maxUsage}
                    </div>

                    <CProgress
                      value={percent}
                      size="sm"
                      color="info"
                    />

                  </td>

                  {/* Validity */}

                  <td>

                    <small>

                      {promo.start}
                      <br />
                      {promo.end}

                    </small>

                  </td>

                  {/* Status */}

                  <td>

                    <CBadge
                      color={statusColor[promo.status]}
                    >

                      {promo.status === "active"
                        ? "Active"
                        : promo.status === "inactive"
                        ? "Inactive"
                        : "Expired"}

                    </CBadge>

                  </td>

                  {/* Actions */}

                  <td>

                    <CDropdown alignment="end">

                      <CDropdownToggle
                        color="light"
                        size="sm"
                      >
                        ⋮
                      </CDropdownToggle>

                      <CDropdownMenu>

                        <CDropdownItem
                          onClick={() => onEdit(promo)}
                        >
                          Chỉnh sửa
                        </CDropdownItem>

                        {promo.status === "active" ? (
                          <CDropdownItem
                            onClick={() => onToggleStatus(promo.id, "Inactive")}
                          >
                            Tạm ngưng
                          </CDropdownItem>
                        ) : (
                          <CDropdownItem
                            onClick={() => onToggleStatus(promo.id, "Active")}
                          >
                            Kích hoạt
                          </CDropdownItem>
                        )}

                        <CDropdownItem
                          className="text-danger"
                          onClick={() => onDelete(promo)}
                        >
                          Xóa
                        </CDropdownItem>

                      </CDropdownMenu>

                    </CDropdown>

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

export default PromotionTable