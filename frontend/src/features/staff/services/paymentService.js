import api from "../../../shared/api/api"

export const getPayments = async (params) => {
    const response = await api.get('/api/payments', { params })
    return response.data.data
}
