import api from "../api/api"

export const getPackages = async (search = "", status = "", tier = "") => {

    const res = await api.get("/api/packages", {
        params: { search, status, tier }
    })

    return res.data.data

}

export const getPackageStats = async () => {

    const res = await api.get("/api/packages/stats")

    return res.data.data

}

export const getPackageById = async (id) => {

    const res = await api.get(`/api/packages/${id}`)

    return res.data.data

}

export const updatePackage = async (id, payload) => {

    const res = await api.put(
        `/api/packages/${id}`,
        payload
    )

    return res.data.data

}

export const deletePackage = async (id) => {

    const res = await api.delete(
        `/api/packages/${id}`
    )

    return res.data.data

}


export const updatePackageStatus = async (id, status) => {
    const res = await api.patch(
        `/api/packages/${id}/status`,
        { status }
    )
    return res.data.data
}