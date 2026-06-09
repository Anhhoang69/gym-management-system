import { CFormInput } from "@coreui/react"

function PromotionFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
}) {
  return (
    <div className="row g-4 align-items-center mb-3">
      <div className="col-md-3">
        <CFormInput
          placeholder="Tìm theo tên, mã khuyến mãi..."
          className="w-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <select
          className="form-select w-100"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Đang hoạt động</option>
          <option value="Inactive">Tạm ngưng</option>
          <option value="Expired">Đã hết hạn</option>
        </select>
      </div>

      <div className="col-md-3">
        <select
          className="form-select w-100"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Tất cả loại giảm giá</option>
          <option value="Percentage">Phần trăm (%)</option>
          <option value="FixedAmount">Số tiền (₫)</option>
        </select>
      </div>
    </div>
  )
}

export default PromotionFilters
