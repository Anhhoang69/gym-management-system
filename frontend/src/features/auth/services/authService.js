import api from "../api/api"

export const login = async (payload) => {
  const res = await api.post("/api/auth/login", payload)
  return res.data
}