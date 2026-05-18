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
  CFormSelect
} from "@coreui/react"

import { updateRoom } from "../../services/roomService"

function EditRoomModal({ visible, setVisible, room, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    roomNumber: "",
    capacity: 0,
    images: []
  })

  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        roomNumber: room.roomNumber || "",
        capacity: room.capacity || 0,
        images: room.images || []
      })
      setImageUrl("")
    }
  }, [room])

  if (!room) return null

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

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        roomNumber: formData.roomNumber,
        capacity: Number(formData.capacity),
        images: formData.images
      }
      await updateRoom(room.roomId, payload)
      onUpdated()
      setVisible(false)
    } catch (err) {
      console.error("Update room failed:", err)
      alert("Cập nhật phòng thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
      <CModalHeader>
        <CModalTitle>Chỉnh Sửa Phòng</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit} id="editRoomForm">
          <div className="mb-3">
            <CFormInput
              label="Chi Nhánh"
              value={room.branchName || "Không xác định"}
              disabled
            />
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
        <CButton color="warning" type="submit" form="editRoomForm" disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu Thay Đổi"}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditRoomModal
