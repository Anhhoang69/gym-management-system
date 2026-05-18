import api from "../../../shared/api/api"

export const quickRegister = async (data) => {
    const response = await api.post("/api/members/quick-register", data)
    return response.data.data
}
