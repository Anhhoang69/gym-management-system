import { CCard, CCardBody } from "@coreui/react"

function PackageCard({ pkg, onEdit }) {
  return (
    <CCard className="h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
      <CCardBody style={{ padding: 24 }}>

        {/* TITLE */}
        <h5 className="fw-bold mb-1">{pkg.name}</h5>
        <p className="text-muted small mb-2">{pkg.duration}</p>

        {/* PRICE */}
        <h2 className="fw-bold mb-3" style={{ fontSize: 34 }}>
          ${pkg.price}
        </h2>

        {/* FEATURES */}
        <ul className="list-unstyled mb-4">
          {pkg.features.map((f, i) => (
            <li
              key={i}
              className="d-flex align-items-center mb-2"
              style={{ fontSize: 14 }}
            >
              <span
                className="me-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#22c55e",
                  color: "white",
                  fontSize: 11,
                  flexShrink: 0
                }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* POPULARITY */}
        <div className="mb-1 small text-muted">
          Độ phổ biến {pkg.popularity}%
        </div>

        <div
          className="progress mb-3"
          style={{
            height: 6,
            borderRadius: 20,
            background: "#f1f3f5"
          }}
        >
          <div
            className="progress-bar"
            style={{
              width: `${pkg.popularity}%`,
              background: "#facc15",
              borderRadius: 20
            }}
          />
        </div>

        {/* MEMBERS */}
        <div
          className="d-flex align-items-center justify-content-center gap-2 mb-4"
          style={{
            background: "#f3f4f6",
            padding: "10px",
            borderRadius: 8,
            fontSize: 14
          }}
        >
          <span>👥</span>
          <b>{pkg.members}</b>
          <span className="text-muted">Members active</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="d-flex gap-2">
          <button
            className="btn flex-fill"
            style={{
              background: "#f3f4f6",
              borderRadius: 8,
              fontWeight: 500
            }}
            onClick={() => onEdit(pkg)}
          >
            Chỉnh sửa
          </button>

          <button
            className="btn flex-fill"
            style={{
              background: "#fef2f2",
              color: "#ef4444",
              borderRadius: 8,
              fontWeight: 500
            }}
          >
            Xóa
          </button>
        </div>

        {/* MANAGE BUTTON */}
        <button
          className="btn w-100 mt-3"
          style={{
            background: "#facc15",
            borderRadius: 10,
            padding: "10px",
            fontWeight: 600
          }}
        >
          Quản Lý
        </button>

      </CCardBody>
    </CCard>
  )
}

export default PackageCard