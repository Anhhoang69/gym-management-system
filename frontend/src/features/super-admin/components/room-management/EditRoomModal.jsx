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
import api from "../../../../shared/api/api"

function EditRoomModal({ visible, setVisible, room, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    roomNumber: "",
    capacity: 0,
    images: []
  })

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        roomNumber: room.roomNumber || "",
        capacity: room.capacity || 0,
        images: room.images || []
      })
    }
  }, [room])

  if (!room) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataObj = new FormData()
    formDataObj.append("file", file)

    setLoading(true)
    try {
      const response = await api.post("/api/Upload/image?folder=rooms", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      const uploadedUrl = response.data.url
      if (uploadedUrl) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadedUrl]
        }))
      }
    } catch (err) {
      console.error("Upload image failed:", err)
      alert("Tải ảnh lên thất bại!")
    } finally {
      setLoading(false)
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
            <label className="form-label fw-semibold">Hình Ảnh Phòng</label>
            <div className="d-flex flex-column gap-2">
              <div>
                <input
                  type="file"
                  id="room-image-upload-edit"
                  className="d-none"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={loading}
                />
                <label
                  htmlFor="room-image-upload-edit"
                  className={`btn btn-outline-warning w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${loading ? 'disabled' : ''}`}
                  style={{ cursor: "pointer", borderStyle: "dashed", borderWidth: "2px" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      Tải ảnh phòng lên (Upload)
                    </>
                  )}
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="position-relative" style={{ width: 60, height: 60 }}>
                      <img src={img} alt="room" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                      <button 
                        type="button" 
                        className="btn-close position-absolute top-0 start-100 translate-middle shadow"
                        style={{ padding: "0.2rem", backgroundColor: "white", borderRadius: "50%", fontSize: "9px" }}
                        onClick={() => handleRemoveImage(idx)}
                      ></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
