import api from "../../../shared/api/api"

export const getPublicPackages = async () => {
    const response = await api.get("/api/register/packages")
    return response.data.data
}

export const getPublicBranches = async () => {
    const response = await api.get("/api/register/branches")
    return response.data.data
}

export const registerAccount = async (data) => {
    const response = await api.post("/api/register", data)
    return response.data
}
