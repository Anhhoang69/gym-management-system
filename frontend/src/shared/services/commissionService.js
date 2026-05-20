import api from "../api/api"

export const getMyCommissions = async ({ month, year, page = 1, pageSize = 20 } = {}) => {
  try {
    const params = { page, pageSize }
    if (month) params.month = month
    if (year) params.year = year
    const res = await api.get("/api/commissions/my", { params })
    return res.data
  } catch (e) {
    console.error("Failed to get personal commissions", e)
    return { success: false, message: e.response?.data?.message || "Lỗi tải danh sách hoa hồng" }
  }
}
