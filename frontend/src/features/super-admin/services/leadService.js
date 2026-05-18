import api from "../../../shared/api/api"

export const getLeads = async (params = {}) => {
    const response = await api.get("/api/leads", { params })
    return response.data.data
}

export const createLead = async (data) => {
    const response = await api.post("/api/leads", data)
    return response.data.data
}

export const getLeadStats = async () => {
    const response = await api.get("/api/leads/stats")
    return response.data.data
}

export const getLeadById = async (id) => {
    const response = await api.get(`/api/leads/${id}`)
    return response.data.data
}

export const updateLead = async (id, data) => {
    const response = await api.put(`/api/leads/${id}`, data)
    return response.data.data
}

export const updateLeadStatus = async (id, status, lostReason = "") => {
    const payload = { status }
    if (status === "Lost" && lostReason) {
        payload.lostReason = lostReason
    }
    const response = await api.patch(`/api/leads/${id}/status`, payload)
    return response.data.data
}

export const contactLead = async (id) => {
    const response = await api.post(`/api/leads/${id}/contact`)
    return response.data.data
}

export const mergeLeads = async (id, duplicateLeadId) => {
    const response = await api.post(`/api/leads/${id}/merge`, { duplicateLeadId })
    return response.data.data
}

export const convertToMember = async (id, data) => {
    const response = await api.post(`/api/leads/${id}/convert-to-member`, data)
    return response.data.data
}

export const importLeads = async (formData) => {
    const response = await api.post("/api/leads/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data.data
}
