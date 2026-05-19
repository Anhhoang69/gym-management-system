import api from "../../../shared/api/api"

export const getPayments = async (params = {}) => {
  const res = await api.get("/api/payments", { params })
  return res.data.data
}
