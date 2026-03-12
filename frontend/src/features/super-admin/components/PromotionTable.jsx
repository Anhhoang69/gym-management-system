import {
  CCard,
  CCardBody,
  CBadge,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
} from "@coreui/react"

const statusColor = {
  active: "success",
  scheduled: "warning",
  expired: "danger",
}

function PromotionTable({
  promotions = [],
  selectedIds = [],
  onToggleSelect = () => {},
  onToggleSelectAll = () => {},
  onEdit = () => {},
  onDelete = () => {},
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
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Validity</th>
              <th>Status</th>
              <th style={{ width: 50 }}></th>

            </tr>
          </thead>

          <tbody>

            {promotions.map((promo) => (

              <tr key={promo.id}>

                {/* Checkbox */}
                <td>
                  <CFormCheck
                    checked={selectedIds.includes(promo.id)}
                    onChange={() => onToggleSelect(promo.id)}
                  />
                </td>

                {/* Promotion name */}
                <td className="fw-semibold">
                  {promo.name}
                </td>

                {/* Code */}
                <td>
                  <span className="badge bg-light text-dark">
                    {promo.code}
                  </span>
                </td>

                {/* Type */}
                <td>{promo.type}</td>

                {/* Value */}
                <td>{promo.value}</td>

                {/* Validity */}
                <td>{promo.validity}</td>

                {/* Status */}
                <td>

                  <CBadge color={statusColor[promo.status]}>
                    {promo.status === "active"
                      ? "Active"
                      : promo.status === "scheduled"
                      ? "Scheduled"
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

            ))}

          </tbody>

        </table>

      </CCardBody>
    </CCard>
  )
}

export default PromotionTable