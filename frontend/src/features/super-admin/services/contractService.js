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

export const createContractDraft = async (data) => {
    const response = await api.post("/api/contracts/draft", data)
    return response.data.data
}
