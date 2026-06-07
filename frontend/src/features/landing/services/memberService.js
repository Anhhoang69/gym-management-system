import api from "../../../shared/api/api"

// PROFILE
export const getMyProfile = async () => {
  const response = await api.get("/api/me")
  return response.data.data
}

export const updateMyProfile = async (data) => {
  const response = await api.put("/api/me", data)
  return response.data.data
}

// SESSIONS
export const getLoginHistory = async (params = { page: 1, pageSize: 20 }) => {
  const response = await api.get("/api/me/login-history", { params })
  return response.data.data
}

export const revokeSession = async (loginHistoryId) => {
  const response = await api.delete(`/api/me/sessions/${loginHistoryId}`)
  return response.data.data
}

// BOOKINGS
export const getMyBookings = async () => {
  const response = await api.get("/api/classes/my-bookings")
  return response.data.data
}

export const cancelBooking = async (classId, cancelReason) => {
  const response = await api.patch(`/api/classes/${classId}/cancel-booking`, { cancelReason })
  return response.data.data
}

// REQUESTS
export const getMyRequests = async (params = {}) => {
  const response = await api.get("/api/requests/my", { params })
  return response.data.data
}

export const cancelRequest = async (requestId) => {
  const response = await api.post(`/api/requests/${requestId}/cancel`)
  return response.data.data
}

// NOTIFICATIONS
export const getNotifications = async (params = { page: 1, pageSize: 20, isRead: null }) => {
  const response = await api.get("/api/notifications", { params })
  return response.data.data
}

export const getUnreadNotificationsCount = async () => {
  const response = await api.get("/api/notifications/unread-count")
  return response.data.data
}

export const readNotification = async (notificationId) => {
  const response = await api.patch(`/api/notifications/${notificationId}/read`)
  return response.data.data
}

export const readAllNotifications = async () => {
  const response = await api.patch("/api/notifications/read-all")
  return response.data.data
}

// ATTENDANCE
export const getMyAttendance = async () => {
  const response = await api.get("/api/attendance/my")
  return response.data.data
}

// UPLOAD IMAGE
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await api.post("/api/Upload/image?folder=gym", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return response.data.url
}
