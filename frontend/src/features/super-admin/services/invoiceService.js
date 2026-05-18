import api from "../../../shared/api/api"

export const getInvoiceById = async (id) => {
    const response = await api.get(`/api/invoices/${id}`)
    return response.data.data
}

export const getInvoiceQr = async (id) => {
    const response = await api.get(`/api/invoices/${id}/qr`)
    return response.data.data
}

export const collectPayment = async (id, data) => {
    const response = await api.post(`/api/invoices/${id}/payment`, data)
    return response.data.data
}
