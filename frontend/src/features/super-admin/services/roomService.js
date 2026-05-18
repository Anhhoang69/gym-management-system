import api from "../../../shared/api/api"

export const getRooms = async (branchId = "", search = "", status = "") => {
    const res = await api.get("/api/rooms", {
        params: {
            branchId,
            search,
            status
        }
    })

    if (!res.data?.success) {
        throw new Error("Invalid API response")
    }

    return res.data.data
}

export const getRoomById = async (id) => {
    const res = await api.get(`/api/rooms/${id}`)
    return res.data.data
}

export const createRoom = async (branchId, payload) => {
    const res = await api.post(`/api/rooms/${branchId}`, payload)
    return res.data.data
}

export const updateRoom = async (id, payload) => {
    const res = await api.put(`/api/rooms/${id}`, payload)
    return res.data.data
}

export const deleteRoom = async (id) => {
    const res = await api.delete(`/api/rooms/${id}`)
    return res.data.data
}

export const updateRoomStatus = async (id, status) => {
    const res = await api.patch(`/api/rooms/${id}/status`, { status })
    return res.data.data
}
