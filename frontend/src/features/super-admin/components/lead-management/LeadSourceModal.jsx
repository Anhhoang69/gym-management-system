import { useState, useEffect } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch
} from "@coreui/react"
import { createLeadSource, updateLeadSource } from "../../services/leadSourceService"

function LeadSourceModal({ visible, setVisible, leadSource, onSaved }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    score: 0,
    isActive: true
  })

  useEffect(() => {
    if (leadSource) {
      setFormData({
        name: leadSource.name || "",
        score: leadSource.score || 0,
        isActive: leadSource.isActive !== false
      })
    } else {
      setFormData({
        name: "",
        score: 0,
        isActive: true
      })
    }
  }, [leadSource, visible])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nguồn lead")
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name.trim(),
        score: Number(formData.score) || 0,
        isActive: formData.isActive
      }

      if (leadSource && leadSource.id) {
        await updateLeadSource(leadSource.id, payload)
      } else {
        await createLeadSource(payload)
      }

      onSaved()
      setVisible(false)
    } catch (err) {
      console.error("Save lead source failed:", err)
      alert("Lưu nguồn lead thất bại!")
    } finally {
      setLoading(false)
    }
  }

  const isEdit = !!leadSource

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
      <CModalHeader>
        <CModalTitle>{isEdit ? "Chỉnh Sửa Nguồn Lead" : "Thêm Nguồn Lead Mới"}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit} id="leadSourceForm">
          <div className="mb-3">
            <CFormInput
              label="Tên Nguồn (*)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Facebook, Google Ads, Khách ghé trực tiếp..."
              required
            />
          </div>
          <div className="mb-3">
            <CFormInput
              label="Điểm Độ Ưu Tiên (Score)"
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
            <small className="text-muted">Điểm số thể hiện chất lượng nguồn khách (ví dụ: nguồn VIP có điểm cao hơn).</small>
          </div>
          <div className="mb-3">
            <CFormSwitch
              label="Trạng Thái Hoạt Động"
              name="isActive"
              id="leadSourceActiveSwitch"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={() => setVisible(false)} disabled={loading}>
          Hủy
        </CButton>
        <CButton color={isEdit ? "warning" : "success"} type="submit" form="leadSourceForm" disabled={loading} className={isEdit ? "" : "text-white"}>
          {loading ? "Đang xử lý..." : isEdit ? "Lưu Thay Đổi" : "Tạo Nguồn Lead"}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default LeadSourceModal
