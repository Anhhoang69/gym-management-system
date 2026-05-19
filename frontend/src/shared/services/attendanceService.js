import api from "../api/api"

// POST /api/attendance/checkin
export const checkin = async (cardNumber, branchId) => {
  const response = await api.post("/api/attendance/checkin", { cardNumber, branchId })
  return response.data
}

// POST /api/attendance/checkout
export const checkout = async (cardNumber, branchId) => {
  const response = await api.post("/api/attendance/checkout", { cardNumber, branchId })
  return response.data
}

// POST /api/attendance/checkin/manual
export const manualCheckin = async (memberUserId, branchId) => {
  const response = await api.post("/api/attendance/checkin/manual", { memberUserId, branchId })
  return response.data
}

// GET /api/attendance/branch/{branchId}
export const getBranchAttendance = async (branchId, date) => {
  const params = date ? { date } : {}
  const response = await api.get(`/api/attendance/branch/${branchId}`, { params })
  return response.data.data
}

// GET /api/attendance/member/{memberId}
export const getMemberAttendance = async (memberId) => {
  const response = await api.get(`/api/attendance/member/${memberId}`)
  return response.data.data
}
