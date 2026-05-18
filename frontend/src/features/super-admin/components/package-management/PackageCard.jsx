import { CCard, CCardBody, CBadge } from "@coreui/react"

function PackageCard({ pkg, onEdit, onDelete, onToggleStatus }) {

  const minPrice = pkg.pricings?.length
    ? Math.min(...pkg.pricings.map(p => p.price))
    : 0

  const tierTheme = {
    basic: { bg: "#f3f4f6", color: "#4b5563", badge: "secondary" },
    premium: { bg: "#fffbeb", color: "#d97706", badge: "warning" },
    elite: { bg: "#fef2f2", color: "#dc2626", badge: "danger" }
  }

  const theme = tierTheme[pkg.tier?.toLowerCase()] || tierTheme.basic
  const isActive = pkg.status !== "inactive"

  return (
    <CCard
      className={`h-100 border-0 shadow-sm ${!isActive ? 'opacity-75' : ''}`}
      style={{
        borderRadius: '16px',
        transition: "all 0.3s ease",
        transform: "translateY(0)",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <CCardBody className="d-flex flex-column p-3 position-relative overflow-hidden">
        
        {/* Tier Badge */}
        <div className="position-absolute top-0 end-0 px-3 py-1 fw-bold text-uppercase" style={{
            background: theme.bg, 
            color: theme.color,
            fontSize: '11px',
            borderBottomLeftRadius: '12px'
        }}>
            {pkg.tier}
        </div>

        {/* HEADER */}
        <div className="mb-3 mt-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-bold mb-0 text-dark">{pkg.name}</h5>
            {!isActive && <CBadge color="secondary" shape="rounded-pill" style={{ fontSize: '10px' }}>Ngừng bán</CBadge>}
          </div>
          <p className="text-muted small mb-0" style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: '40px'
          }}>
            {pkg.description || "Chưa có mô tả gói tập."}
          </p>
        </div>

        {/* PRICE */}
        <div className="mb-3 pb-2 border-bottom">
          <span className="fw-bold text-dark" style={{ fontSize: '26px' }}>
            {minPrice.toLocaleString('vi-VN')}₫
          </span>
          <span className="text-muted small"> / tháng</span>
        </div>

        {/* FEATURES */}
        <ul className="list-unstyled mb-3 flex-grow-1">
          {pkg.features?.slice(0, 3).map(f => (
            <li key={f.packageFeatureId || f.id} className="d-flex align-items-start mb-2 text-secondary small">
              <span className="text-success me-2" style={{ marginTop: '2px' }}>
                <i className="bi bi-check-circle-fill">✓</i>
              </span>
              <span>{f.content}</span>
            </li>
          ))}
          {(pkg.features?.length > 3) && (
            <li className="text-muted small fst-italic">
              + {pkg.features.length - 3} tiện ích khác...
            </li>
          )}
        </ul>

        {/* INFO MINI-CARDS */}
        <div className="d-flex justify-content-between mb-3 bg-light rounded-3 p-2">
          <div className="text-center w-100 border-end">
            <div className="fw-bold text-dark">{pkg.maxCheckinsPerWeek > 99 ? '∞' : pkg.maxCheckinsPerWeek}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Check-in/tuần</div>
          </div>
          <div className="text-center w-100 border-end">
            <div className="fw-bold text-dark">{pkg.isPtIncluded ? "Có" : "Không"}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Kèm PT</div>
          </div>
          <div className="text-center w-100">
            <div className="fw-bold text-dark">{pkg.totalSubscribers}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Hội viên</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="d-flex gap-2 mt-auto">
          <button
            className="btn btn-outline-primary flex-fill fw-semibold"
            style={{ fontSize: '12px', padding: '6px 4px' }}
            onClick={() => onEdit(pkg)}
          >
            Chỉnh sửa
          </button>
          <button
            className={`btn flex-fill fw-semibold ${isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
            style={{ fontSize: '12px', padding: '6px 4px' }}
            onClick={() => onToggleStatus && onToggleStatus(pkg.id, pkg.status)}
          >
            {isActive ? "Tạm ngưng" : "Kích hoạt"}
          </button>
          <button
            className="btn btn-outline-danger flex-fill fw-semibold"
            style={{ fontSize: '12px', padding: '6px 4px' }}
            onClick={() => onDelete(pkg)}
          >
            Xóa
          </button>
        </div>

      </CCardBody>
    </CCard>
  )
}

export default PackageCard
