import api from "../../../shared/api/api"

// GET /api/reports/overview
export const getOverview = async (branchId = "") => {
  const params = branchId ? { branchId } : {}
  const res = await api.get("/api/reports/overview", { params })
  return res.data.data
}

// GET /api/reports/revenue
export const getRevenueReport = async (params = {}) => {
  const res = await api.get("/api/reports/revenue", { params })
  return res.data.data
}

// GET /api/reports/sales-funnel
export const getSalesFunnelReport = async (params = {}) => {
  const res = await api.get("/api/reports/sales-funnel", { params })
  return res.data.data
}

// GET /api/reports/pt-performance
export const getPtPerformanceReport = async (params = {}) => {
  const res = await api.get("/api/reports/pt-performance", { params })
  return res.data.data
}

// GET /api/reports/check-in
export const getCheckInReport = async (params = {}) => {
  const res = await api.get("/api/reports/check-in", { params })
  return res.data.data
}

// GET /api/reports/export/{reportType}
export const exportReport = async (reportType, params = {}) => {
  const res = await api.get(`/api/reports/export/${reportType}`, {
    params,
    responseType: "blob"
  })
  return res.data
}
