import api from "../../../shared/api/api"

// PATCH /api/cards/{id}/status
export const updateCardStatus = async (id, status, reason = "") => {
    const res = await api.patch(`/api/cards/${id}/status`, { status, reason })
    return res.data.data
}
