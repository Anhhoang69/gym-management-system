import { useState, useEffect } from "react"
import {
  CBadge,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from "@coreui/react"
import { getLeadSources, updateLeadSource } from "../../services/leadSourceService"
import LeadSourceModal from "./LeadSourceModal"

function LeadSourcesTab({ refreshTrigger, onEditSource }) {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSources = async () => {
    setLoading(true)
    try {
      const data = await getLeadSources()
      setSources(data || [])
    } catch (error) {
      console.error("Failed to load lead sources", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSources()
  }, [refreshTrigger])

  const handleToggleStatus = async (source) => {
    try {
      const payload = {
        name: source.name,
        score: source.score,
        isActive: !source.isActive
      }
      await updateLeadSource(source.id, payload)
      fetchSources()
    } catch (error) {
      console.error("Failed to toggle lead source status", error)
      alert("Cập nhật trạng thái nguồn lead thất bại!")
    }
  }

  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (isActive) => {
    return (
      <CBadge color={isActive ? "success" : "secondary"} className="px-2 py-1.5" style={{ fontSize: "11px", fontWeight: "600" }}>
        {isActive ? "Hoạt động" : "Ngừng hoạt động"}
      </CBadge>
    )
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Search Input */}
      <div className="row g-4 align-items-center mb-3">
        <div className="col-md-3">
          <CFormInput 
            placeholder="Tìm kiếm nguồn lead..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-grow-1 overflow-auto border rounded-3" style={{ minHeight: 0, background: "#fff" }}>
        {loading ? (
          <div className="text-center py-5 text-muted">Đang tải dữ liệu...</div>
        ) : (
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
                <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Tên Nguồn</th>
                <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Điểm Ưu Tiên</th>
                <th style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6b7280", fontWeight: "600", padding: "12px 16px" }}>Trạng Thái</th>
                <th style={{ width: 80, padding: "12px 16px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.map(source => (
                <tr key={source.id} className="user-row">
                  <td style={{ padding: "14px 16px" }} className="fw-semibold text-dark">
                    {source.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#4b5563" }}>
                    {source.score}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {getStatusBadge(source.isActive)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <CDropdown alignment="end" onClick={(e) => e.stopPropagation()}>
                      <CDropdownToggle color="light" size="sm" caret={false} className="border shadow-sm" style={{ minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        ⋮
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => onEditSource(source)}>
                          Chỉnh sửa
                        </CDropdownItem>
                        <CDropdownItem className="border-top" onClick={() => handleToggleStatus(source)}>
                          {source.isActive ? "Tạm ngưng" : "Kích hoạt"}
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </td>
                </tr>
              ))}
              {filteredSources.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    Không tìm thấy nguồn lead nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default LeadSourcesTab
