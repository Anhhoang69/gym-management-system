import api from "../../../shared/api/api"

export const getInvoiceById = async (id) => {
    const response = await api.get(`/api/invoices/${id}`)
    return response.data.data
}

export const createInvoice = async (data) => {
    const response = await api.post(`/api/invoices`, data)
    return response.data.data
}

export const getInvoiceQr = async (id) => {
    const response = await api.get(`/api/invoices/${id}/qr`, { responseType: 'blob' })
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('application/json')) {
      const text = await response.data.text()
      const json = JSON.parse(text)
      return json.data?.qrUrl || json.data?.qrCode || json.data || json
    } else {
      return URL.createObjectURL(response.data)
    }
}

export const getInvoices = async (params) => {
    const response = await api.get('/api/invoices', { params })
    return response.data.data
}

export const collectPayment = async (id, data) => {
    const response = await api.post(`/api/invoices/${id}/payment`, data)
    return response.data.data
}
