import { CFormInput, CButton } from "@coreui/react"

function PromotionFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
}) {
  return (
    <div className="d-flex gap-3 flex-wrap align-items-center mb-3">
      <CFormInput
        placeholder="Tìm theo tên, mã khuyến mãi..."
        style={{ maxWidth: 320 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="form-select"
        style={{ width: 180 }}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="Active">Đang hoạt động</option>
        <option value="Inactive">Tạm ngưng</option>
        <option value="Expired">Đã hết hạn</option>
      </select>

      <select
        className="form-select"
        style={{ width: 180 }}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Tất cả loại giảm giá</option>
        <option value="Percentage">Phần trăm (%)</option>
        <option value="FixedAmount">Số tiền ($)</option>
      </select>

      <CButton
        color="light"
        size="sm"
        onClick={() => {
          setSearch("")
          setStatus("")
          setType("")
        }}
      >
        Reset
      </CButton>
    </div>
  )
}

export default PromotionFilters
