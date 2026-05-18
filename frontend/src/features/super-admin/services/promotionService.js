import api from "../../../shared/api/api"

export const createPromotion = async (payload) => {
    const res = await api.post("/api/promotions", payload)
    return res.data.data
}

export const getPromotions = async (search = "", status = "", type = "") => {

    const res = await api.get("/api/promotions", {
        params: {
            search,
            status,
            type
        }
    })

    if (!res.data?.success) {
        throw new Error("Invalid API response")
    }

    return res.data.data
}

export const getPromotionStats = async () => {

    const res = await api.get("/api/promotions/stats")

    return res.data.data

}

export const getPromotionById = async (id) => {

    const res = await api.get(`/api/promotions/${id}`)

    return res.data.data

}

export const updatePromotion = async (id, payload) => {

    const res = await api.put(
        `/api/promotions/${id}`,
        payload
    )

    return res.data.data

}


export const deletePromotion = async (id) => {

  const res = await api.delete(
    `/api/promotions/${id}`
  )

  return res.data.data

}

export const updatePromotionStatus = async (id, status) => {
    const res = await api.patch(`/api/promotions/${id}/status`, { status })
    return res.data.data
}
