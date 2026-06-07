import axios from "axios"

const api = axios.create({
    baseURL: "https://gym-management-system-production-69.up.railway.app",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default api