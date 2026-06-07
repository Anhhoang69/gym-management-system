import api from "../../../shared/api/api"

// GET /api/classes
// Lấy danh sách tất cả các lớp học
export const getClasses = async (params = {}) => {
  const res = await api.get("/api/classes", { params })
  return res.data.data
}

// GET /api/classes/{id}
// Lấy chi tiết một lớp học (bao gồm danh sách bookings)
export const getClassById = async (id) => {
  const res = await api.get(`/api/classes/${id}`)
  return res.data.data
}

// POST /api/classes
// Tạo mới một lớp học
export const createClass = async (payload) => {
  const res = await api.post("/api/classes", payload)
  return res.data.data
}

// PUT /api/classes/{id}
// Cập nhật thông tin lớp học
export const updateClass = async (id, payload) => {
  const res = await api.put(`/api/classes/${id}`, payload)
  return res.data.data
}

// DELETE /api/classes/{id}
// Xóa lớp học
export const deleteClass = async (id) => {
  const res = await api.delete(`/api/classes/${id}`)
  return res.data.data
}

// PATCH /api/classes/{id}/status
// Cập nhật trạng thái lớp học (Scheduled, InProgress, Completed, Cancelled)
export const updateClassStatus = async (id, status) => {
  const res = await api.patch(`/api/classes/${id}/status`, { status })
  return res.data.data
}

// POST /api/classes/{id}/book
// Đặt chỗ lớp học cho Member
export const bookClass = async (id) => {
  const res = await api.post(`/api/classes/${id}/book`)
  return res.data.data
}

// PATCH /api/classes/{id}/cancel-booking
// Hủy đặt chỗ lớp học cho Member
export const cancelBooking = async (id, cancelReason) => {
  const res = await api.patch(`/api/classes/${id}/cancel-booking`, { cancelReason })
  return res.data.data
}

// GET /api/classes/my-bookings
// Lấy danh sách lớp học Member đã đặt
export const getMyBookings = async () => {
  const res = await api.get("/api/classes/my-bookings")
  return res.data.data
}

// GET /api/classes/{id}/members
// Lấy danh sách member trong lớp (PT/Staff)
export const getClassMembers = async (id) => {
  const res = await api.get(`/api/classes/${id}/members`)
  return res.data.data
}

// PATCH /api/classes/{id}/class-checkin
// Điểm danh member vào lớp học
export const checkInClassMember = async (id, memberUserId) => {
  const res = await api.patch(`/api/classes/${id}/class-checkin`, { memberUserId })
  return res.data.data
}

// PATCH /api/classes/class-bookings/{classId}/members/{memberId}/session-note
// Ghi chú buổi tập của member
export const updateSessionNote = async (classId, memberId, sessionNote) => {
  const res = await api.patch(`/api/classes/class-bookings/${classId}/members/${memberId}/session-note`, { sessionNote })
  return res.data.data
}
