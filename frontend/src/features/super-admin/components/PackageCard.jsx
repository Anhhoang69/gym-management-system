import { CCard, CCardBody, CBadge } from "@coreui/react"

function PackageCard({ pkg, onEdit, onDelete, onToggleStatus }) {

  const minPrice =
    pkg.pricings?.length
      ? Math.min(...pkg.pricings.map(p => p.price))
      : 0

  const tierColor = {
    basic: "#6B7280",
    premium: "#F59E0B",
    elite: "#EF4444"
  }

  return (


    <CCard
      className="h-100 border-0"
      style={{
        borderRadius: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        transition: "all .2s"
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={e =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >

      <CCardBody style={{ padding: 18 }}>

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-start mb-2">

          <h5
            className="fw-bold mb-0"
            style={{ fontSize: 20 }}
          >
            {pkg.name}
          </h5>

          <span
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 20,
              background: tierColor[pkg.tier?.toLowerCase()],
              color: "white",
              fontWeight: 600
            }}
          >
            {pkg.tier}
          </span>

        </div>

        <p
          className="text-muted mb-3"
          style={{
            fontSize: 13,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 30
          }}
        >
          {pkg.description}
        </p>

        {/* PRICE */}

        <div
          className="fw-bold mb-1"
          style={{
            fontSize: 24,
            letterSpacing: 1
          }}
        >
          {minPrice.toLocaleString()}₫
        </div>

        {/* FEATURES */}

        <ul
          className="list-unstyled mb-4"
          style={{ fontSize: 14 }}
        >

          {pkg.features?.slice(0, 3).map(f => (

            <li
              key={f.packageFeatureId}
              className="d-flex align-items-center mb-2"
            >

              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#22C55E",
                  color: "white",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8
                }}
              >
                ✓
              </span>

              {f.content}

            </li>

          ))}

        </ul>

        {/* INFO */}

        <div
          className="d-flex justify-content-between mb-4"
          style={{
            background: "#F9FAFB",
            borderRadius: 12,
            padding: "12px 10px",
            fontSize: 13
          }}
        >

          <div className="text-center">
            <b>{pkg.maxCheckinsPerWeek}</b>
            <div className="text-muted">
              checkins
            </div>
          </div>

          <div className="text-center">
            <b>{pkg.isPtIncluded ? "Yes" : "No"}</b>
            <div className="text-muted">
              PT
            </div>
          </div>

          <div className="text-center">
            <b>{pkg.totalSubscribers}</b>
            <div className="text-muted">
              members
            </div>
          </div>

        </div>

        {/* ACTIONS */}

        <div className="d-flex gap-2">

          <button
            className="btn flex-fill"
            style={{
              background: "#F3F4F6",
              borderRadius: 8,
              fontSize: 12,
              padding: "6px 8px",
              fontWeight: 500
            }}
            onClick={() => onEdit(pkg)}
          >
            Chỉnh sửa
          </button>

          <button
            className="btn flex-fill"
            style={{
              background: "#FEF3C7",
              borderRadius: 8,
              fontSize: 12,
              padding: "6px 8px",
              fontWeight: 500
            }}
          >
            Tạm ngưng
          </button>

          <button
            className="btn flex-fill"
            style={{
              background: "#FEE2E2",
              color: "#DC2626",
              borderRadius: 8,
              fontSize: 12,
              padding: "6px 8px",
              fontWeight: 500
            }}
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
