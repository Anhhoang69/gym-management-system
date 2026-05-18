import { CCard, CCardBody } from "@coreui/react"

function LeadsStatusChart({ salesData }) {
  const statusData = salesData?.leadsByStatus || {}
  
  // Standard funnel order
  const orderedLabels = [
    { key: "New", label: "Mới (New)", color: "#0EA5E9" },
    { key: "Contacted", label: "Đã liên hệ (Contacted)", color: "#3B82F6" },
    { key: "Qualified", label: "Tiềm năng (Qualified)", color: "#8B5CF6" },
    { key: "Converted", label: "Thành công (Converted)", color: "#22C55E" }
  ]
  
  const dataValues = orderedLabels.map(obj => statusData[obj.key] || 0)
  const maxValue = Math.max(...dataValues, 1) // Prevent division by zero

  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody className="d-flex flex-column">
        <h5 className="fw-bold mb-4 text-center">
          Phễu Chuyển Đổi (Leads Status)
        </h5>
        
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center gap-1 py-1" style={{ height: "300px" }}>
          {orderedLabels.map((item, index) => {
            const val = statusData[item.key] || 0
            
            // Fixed decreasing widths for the classic funnel shape
            // 4 levels: 90% -> 70% -> 50% -> 30%
            const widthPct = 90 - (index * 20) 

            return (
              <div 
                key={item.key}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {/* Funnel Bar */}
                <div 
                  className="d-flex justify-content-center align-items-center gap-3 shadow-sm text-white text-center"
                  style={{
                    width: `${widthPct}%`,
                    height: "36px",
                    backgroundColor: item.color,
                    clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)", // Steeper slant to look more like a funnel slice
                    marginBottom: index < orderedLabels.length - 1 ? "4px" : "0"
                  }}
                >
                  <span className="fw-semibold" style={{ fontSize: "14px", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
                    {item.label}
                  </span>
                  <span className="fw-bold fs-5" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
                    {val}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        
      </CCardBody>
    </CCard>
  )
}

export default LeadsStatusChart
