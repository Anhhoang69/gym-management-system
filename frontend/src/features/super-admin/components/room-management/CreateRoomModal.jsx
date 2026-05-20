import { useState } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect
} from "@coreui/react"

import { createRoom } from "../../services/roomService"

function CreateRoomModal({ visible, setVisible, branches, onCreated, fixedBranchId }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    roomNumber: "",
    capacity: 0,
    images: []
  })

  const [imageUrl, setImageUrl] = useState("")

  // ================= SET FIXED BRANCH ID =================
  useState(() => {
    if (fixedBranchId) {
      setFormData(prev => ({ ...prev, branchId: fixedBranchId }))
    }
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      })
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.branchId) {
      alert("Vui lòng chọn chi nhánh")
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        roomNumber: formData.roomNumber,
        capacity: Number(formData.capacity),
        images: formData.images
      }
      await createRoom(formData.branchId, payload)
      onCreated()
      setVisible(false)
      setFormData({
        branchId: fixedBranchId || "",
        name: "",
        roomNumber: "",
        capacity: 0,
        images: []
      })
    } catch (err) {
      console.error("Create room failed:", err)
      alert("Thêm phòng thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
      <CModalHeader>
        <CModalTitle>Thêm Phòng Mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit} id="createRoomForm">
          <div className="mb-3">
            <CFormSelect
              label="Chi Nhánh (*)"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              required
              disabled={!!fixedBranchId}
            >
              <option value="">-- Chọn chi nhánh --</option>
              {branches.map(b => (
                <option key={b.branchId} value={b.branchId}>{b.name}</option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormInput
              label="Tên Phòng (*)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormInput
              label="Mã Phòng (Tùy chọn)"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <CFormInput
              label="Sức Chứa (*)"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Hình Ảnh (URL)</label>
            <div className="d-flex gap-2">
              <CFormInput
                placeholder="Nhập link ảnh..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <CButton color="secondary" type="button" onClick={handleAddImage}>Thêm</CButton>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="position-relative">
                    <img src={img} alt="room" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} />
                    <button 
                      type="button" 
                      className="btn-close position-absolute top-0 start-100 translate-middle"
                      style={{ padding: "0.2rem", backgroundColor: "white" }}
                      onClick={() => handleRemoveImage(idx)}
                    ></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
          Hủy
        </CButton>
        <CButton color="warning" type="submit" form="createRoomForm" disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu"}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CreateRoomModal
