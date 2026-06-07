import api from "../../../shared/api/api"

/**
 * Get all requests (Admin / GymOwner / SuperAdmin view)
 * Filter by: relatedEntityType, category, status, branchId
 */
export const getAllRequests = async (params = {}) => {
  const res = await api.get("/api/requests", { params })
  return res.data
}

/**
 * Get my own requests
 * Filter by: category, status
 */
export const getMyRequests = async (params = {}) => {
  const res = await api.get("/api/requests/my", { params })
  return res.data
}

/**
 * Get detailed request by ID (includes payload snapshot, description, handling info)
 */
export const getRequestDetails = async (id) => {
  const res = await api.get(`/api/requests/${id}`)
  return res.data
}

/**
 * Approve request (GymOwner only)
 */
export const approveRequest = async (id) => {
  const res = await api.post(`/api/requests/${id}/approve`)
  return res.data
}

/**
 * Reject request with a reason message (GymOwner only)
 */
export const rejectRequest = async (id, message) => {
  const res = await api.post(`/api/requests/${id}/reject`, { message })
  return res.data
}

/**
 * Cancel request (Creator only - must be in Pending status)
 */
export const cancelRequest = async (id) => {
  const res = await api.post(`/api/requests/${id}/cancel`)
  return res.data
}
