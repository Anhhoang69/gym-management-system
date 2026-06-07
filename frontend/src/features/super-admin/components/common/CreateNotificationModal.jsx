import React, { useState, useEffect } from "react"
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
  CRow,
  CCol,
  CBadge
} from "@coreui/react"
import { getUsers } from "../../services/userService"
import { broadcastNotification, sendNotification } from "../../../../shared/services/notificationService"

function CreateNotificationModal({ visible, setVisible }) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("Info")
  const [actionUrl, setActionUrl] = useState("")
  const [recipientScope, setRecipientScope] = useState("broadcast") // 'broadcast' or 'specific'
  
  const [usersList, setUsersList] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [searching, setSearching] = useState(false)

  // Fetch users when searching in specific mode
  useEffect(() => {
    if (recipientScope === "specific") {
      setSearching(true)
      const delayDebounce = setTimeout(() => {
        fetchUsers(searchQuery)
      }, 300)
      return () => clearTimeout(delayDebounce)
    }
  }, [searchQuery, recipientScope])

  const fetchUsers = async (query) => {
    try {
      const res = await getUsers(1, 15, query)
      if (res && res.items) {
        setUsersList(res.items)
      }
    } catch (e) {
      console.error("Error fetching users for notifications", e)
    } finally {
      setSearching(false)
    }
  }

  const handleToggleUser = (userObj) => {
    const isSelected = selectedUsers.some(u => u.userId === userObj.userId)
    if (isSelected) {
      setSelectedUsers(prev => prev.filter(u => u.userId !== userObj.userId))
    } else {
      setSelectedUsers(prev => [
        ...prev,
        { userId: userObj.userId, fullName: userObj.fullName, email: userObj.email }
      ])
    }
  }

  const handleClose = () => {
    setVisible(false)
    setTitle("")
    setMessage("")
    setType("Info")
    setActionUrl("")
    setRecipientScope("broadcast")
    setSelectedUsers([])
    setSearchQuery("")
    setUsersList([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      alert("Vui lòng điền tiêu đề và nội dung thông báo.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        type,
        actionUrl: actionUrl.trim() || null,
        userIds: recipientScope === "specific" ? selectedUsers.map(u => u.userId) : []
      }

      if (recipientScope === "broadcast") {
        await broadcastNotification(payload)
      } else {
        if (payload.userIds.length === 0) {
          alert("Vui lòng chọn ít nhất một người nhận.")
          setSubmitting(false)
          return
        }
        await sendNotification(payload)
      }

      alert("Gửi thông báo thành công!")
      handleClose()
    } catch (err) {
      console.error(err)
      alert("Gửi thông báo thất bại: " + (err.response?.data?.message || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CModal visible={visible} onClose={handleClose} backdrop="static" alignment="center" size="lg">
      <CModalHeader closeButton>
        <CModalTitle className="fw-bold">Tạo & Gửi Thông Báo</CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody className="px-4 py-3">
          <CRow className="mb-3">
            <CCol md={8}>
              <CFormInput
                label="Tiêu đề thông báo"
                placeholder="Nhập tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </CCol>
            <CCol md={4}>
              <CFormSelect
                label="Loại thông báo"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Info">💡 Info</option>
                <option value="Success">✅ Success</option>
                <option value="Warning">⚠️ Warning</option>
                <option value="Error">🚨 Error</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormTextarea
                label="Nội dung chi tiết"
                placeholder="Nhập nội dung thông báo..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Đường dẫn liên kết (Action URL - Optional)"
                placeholder="VD: /admin/contracts hoặc /profile..."
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                label="Phạm vi người nhận"
                value={recipientScope}
                onChange={(e) => setRecipientScope(e.target.value)}
              >
                <option value="broadcast">Tất cả người dùng hoạt động (Broadcast)</option>
                <option value="specific">Gửi tới danh sách người dùng cụ thể</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {recipientScope === "specific" && (
            <div className="border rounded p-3 bg-light">
              <h6 className="fw-bold mb-2">Chọn người dùng nhận thông báo</h6>
              
              {/* Selected Users Chips */}
              {selectedUsers.length > 0 && (
                <div 
                  className="d-flex flex-wrap gap-1 mb-3 p-2 bg-white border rounded" 
                  style={{ maxHeight: "80px", overflowY: "auto" }}
                >
                  {selectedUsers.map(u => (
                    <CBadge 
                      key={u.userId} 
                      color="secondary" 
                      className="d-flex align-items-center gap-1 p-2 text-dark border"
                    >
                      <span>{u.fullName || u.email}</span>
                      <button
                        type="button"
                        className="btn border-0 p-0 line-height-1 text-muted"
                        style={{ background: "transparent", fontSize: "0.9rem" }}
                        onClick={() => handleToggleUser(u)}
                      >
                        &times;
                      </button>
                    </CBadge>
                  ))}
                </div>
              )}

              {/* User Search Input */}
              <CFormInput
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />

              {/* Users Results List */}
              <div 
                className="bg-white border rounded overflow-auto" 
                style={{ maxHeight: "150px" }}
              >
                {searching ? (
                  <div className="text-center py-3 text-muted small">Đang tìm...</div>
                ) : usersList.length === 0 ? (
                  <div className="text-center py-3 text-muted small">
                    {searchQuery ? "Không tìm thấy kết quả" : "Nhập để tìm kiếm..."}
                  </div>
                ) : (
                  usersList.map(u => {
                    const isChecked = selectedUsers.some(su => su.userId === u.userId)
                    return (
                      <div 
                        key={u.userId} 
                        className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom hover-bg-light"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleUser(u)}
                      >
                        <div>
                          <div className="fw-semibold small">{u.fullName || "N/A"}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {u.email} • Role: {u.role}
                          </div>
                        </div>
                        <CFormCheck 
                          id={`chk-${u.userId}`}
                          checked={isChecked}
                          onChange={() => {}} // Handle parent click
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={handleClose} disabled={submitting}>
            Hủy
          </CButton>
          <CButton color="primary" type="submit" className="text-white" disabled={submitting}>
            {submitting ? "Đang gửi..." : "Gửi thông báo"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default CreateNotificationModal
