import api from "../../../shared/api/api"

export const activateContract = async (id) => {
    const response = await api.post(`/api/contracts/${id}/activate`)
    return response.data.data
}

export const getContracts = async (params = {}) => {
    const response = await api.get("/api/contracts", { params })
    return response.data.data
}

export const getContractById = async (id) => {
    const response = await api.get(`/api/contracts/${id}`)
    return response.data.data
}

export const generateContract = async (data) => {
    const response = await api.post("/api/contracts", data)
    return response.data.data
}

export const updateContract = async (id, data) => {
    const response = await api.put(`/api/contracts/${id}`, data)
    return response.data.data
}

export const cancelContract = async (id) => {
    const response = await api.patch(`/api/contracts/${id}/cancel`)
    return response.data.data
}

export const createContractDraft = async (data) => {
    const response = await api.post("/api/contracts/draft", data)
    return response.data.data
}

export const getDraftContractById = async (id) => {
    const response = await api.get(`/api/contracts/draft/${id}`)
    return response.data.data
}

export const getDraftContracts = async (params = {}) => {
    const response = await api.get("/api/contracts/drafts", { params })
    return response.data.data
}

export const updateDraftContract = async (id, data) => {
    const response = await api.put(`/api/contracts/drafts/${id}`, data)
    return response.data.data
}

export const deleteDraftContract = async (id) => {
    const response = await api.delete(`/api/contracts/drafts/${id}`)
    return response.data.data
}
