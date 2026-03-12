import { CCard, CCardBody } from "@coreui/react"
import CIcon from "@coreui/icons-react"

function StatCards({ stats }) {

  return (
    <div className="row g-4">

      {stats.map((item, index) => (

        <div className="col-md-3" key={index}>

          <CCard
            className="border-0 shadow-sm h-100"
            style={{ borderRadius: 12 }}
          >

            <CCardBody className="d-flex justify-content-between align-items-start">

              {/* LEFT CONTENT */}
              <div>

                <p
                  className="mb-1"
                  style={{
                    fontSize: 14,
                    color: "#6B7280"
                  }}
                >
                  {item.title}
                </p>

                <h3
                  className="fw-bold mb-1"
                  style={{
                    fontSize: 28
                  }}
                >
                  {item.value}
                </h3>

                {item.change && (
                  <span
                    className="small"
                    style={{
                      color:
                        item.positive === true
                          ? "#16A34A"
                          : item.positive === false
                            ? "#DC2626"
                            : "#F59E0B"
                    }}
                  >
                    {item.positive === true && "↗ "}
                    {item.positive === false && "↘ "}
                    {item.change}
                  </span>
                )}

              </div>

              {/* ICON */}
              <div
                style={{
                  background: item.bg,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <CIcon
                  icon={item.icon}
                  size="lg"
                  style={{ color: item.color }}
                />
              </div>

            </CCardBody>

          </CCard>

        </div>

      ))}

    </div>
  )
}

export default StatCards