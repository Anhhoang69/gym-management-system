import api from "../../../shared/api/api"

export const getLeadSources = async () => {
    const response = await api.get("/api/lead-sources")
    return response.data.data
}

export const createLeadSource = async (data) => {
    const response = await api.post("/api/lead-sources", data)
    return response.data.data
}

export const updateLeadSource = async (id, data) => {
    const response = await api.put(`/api/lead-sources/${id}`, data)
    return response.data.data
}
