import api from "../../../shared/api/api"

export const login = async (payload) => {
  const res = await api.post("/api/auth/login", payload)
  return res.data
}

export const changePassword = async (payload) => {
  const res = await api.post("/api/auth/change-password", payload)
  return res.data
}

export const send2FAOtp = async () => {
  const res = await api.post("/api/auth/2fa/send-setup-otp")
  return res.data
}

export const enable2FA = async (payload) => {
  const res = await api.post("/api/auth/2fa/enable", payload)
  return res.data
}

export const disable2FA = async (payload) => {
  const res = await api.post("/api/auth/2fa/disable", payload)
  return res.data
}

export const verifyOtp = async (payload) => {
  const res = await api.post("/api/auth/verify-otp", payload)
  return res.data
}

export const forgotPassword = async (payload) => {
  const res = await api.post("/api/auth/forgot-password", payload)
  return res.data
}

export const resetPassword = async (payload) => {
  const res = await api.post("/api/auth/reset-password", payload)
  return res.data
}