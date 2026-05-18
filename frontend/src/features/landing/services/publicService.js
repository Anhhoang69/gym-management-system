import api from "../../../shared/api/api"

export const getPublicPackages = async () => {
    const response = await api.get("/api/register/packages")
    return response.data.data
}
