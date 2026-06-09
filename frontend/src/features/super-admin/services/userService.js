import api from "../../../shared/api/api"

// ================= USERS =================

// GET /api/users
export const getUsers = async (page = 1, pageSize = 10, search = "", role = "", branchId = "", status = "") => {
  const res = await api.get("/api/users", {
    params: { page, pageSize, search, role, branchId, status }
  })
  return res.data.data
}

// GET /api/users/stats
export const getUserStats = async () => {
  const res = await api.get("/api/users/stats")
  return res.data.data
}

// GET /api/users/{id}
export const getUserById = async (id) => {
  const res = await api.get(`/api/users/${id}`)
  return res.data.data
}

// POST /api/users 
export const createUser = async (data) => {
  const res = await api.post("/api/users", data)
  return res.data.data
}

// PUT /api/users/{id}
export const updateUser = async (id, data) => {
  const res = await api.put(`/api/users/${id}`, data)
  return res.data.data
}

// PATCH /api/users/{id}/status
export const updateUserStatus = async (id, status) => {
  const res = await api.patch(`/api/users/${id}/status`, { status })
  return res.data.data
}