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
import api from "../../../../shared/api/api"

function CreateRoomModal({ visible, setVisible, branches, onCreated, fixedBranchId }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    roomNumber: "",
    capacity: 0,
    images: []
  })

  // ================= SET FIXED BRANCH ID =================
  useState(() => {
    if (fixedBranchId) {
      setFormData(prev => ({ ...prev, branchId: fixedBranchId }))
    }
  })

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
            <label className="form-label fw-semibold">Hình Ảnh Phòng</label>
            <div className="d-flex flex-column gap-2">
              <div>
                <input
                  type="file"
                  id="room-image-upload-create"
                  className="d-none"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={loading}
                />
                <label
                  htmlFor="room-image-upload-create"
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
        <CButton color="warning" type="submit" form="createRoomForm" disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu"}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CreateRoomModal
