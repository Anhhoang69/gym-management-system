import api from "../api/api"

// GET /api/notifications
export const getNotifications = async (params = { page: 1, pageSize: 20, isRead: null }) => {
  const response = await api.get("/api/notifications", { params })
  return response.data.data
}

// DELETE /api/notifications/{id}
export const deleteNotification = async (id) => {
  const response = await api.delete(`/api/notifications/${id}`)
  return response.data.data
}

// GET /api/notifications/unread-count
export const getUnreadNotificationsCount = async () => {
  const response = await api.get("/api/notifications/unread-count")
  return response.data.data
}

// PATCH /api/notifications/{id}/read
export const readNotification = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read`)
  return response.data.data
}

// PATCH /api/notifications/read-all
export const readAllNotifications = async () => {
  const response = await api.patch("/api/notifications/read-all")
  return response.data.data
}

// POST /api/notifications/send
export const sendNotification = async (data) => {
  const response = await api.post("/api/notifications/send", data)
  return response.data.data
}

// POST /api/notifications/broadcast
export const broadcastNotification = async (data) => {
  const response = await api.post("/api/notifications/broadcast", data)
  return response.data.data
}
