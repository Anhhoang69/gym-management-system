import api from "../../../shared/api/api"

export const getMyProfile = async () => {
  const response = await api.get("/api/me")
  return response.data.data
}

export const updateMyProfile = async (data) => {
  const response = await api.put("/api/me", data)
  return response.data.data
}

export const getLoginHistory = async (params = { page: 1, pageSize: 20 }) => {
  const response = await api.get("/api/me/login-history", { params })
  return response.data.data
}

export const revokeSession = async (loginHistoryId) => {
  const response = await api.delete(`/api/me/sessions/${loginHistoryId}`)
  return response.data.data
}

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

