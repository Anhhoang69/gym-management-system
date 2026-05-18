import api from "../../../shared/api/api"

// GET /api/branches
export const getBranches = async (search = "", status = "") => {

  const res = await api.get("/api/branches", {
    params: { search, status }
  })

  return res.data.data

}

export const getBranchById = async (id) => {

  const res = await api.get(`/api/branches/${id}`)

  return res.data.data

}

export const updateBranch = async (id, payload) => {

  const res = await api.put(`/api/branches/${id}`, payload)

  return res.data.data

}

export const deleteBranch = async (id) => {

  const res = await api.delete(`/api/branches/${id}`)

  return res.data.data
}

export const getBranchStats = async () => {
  const res = await api.get("/api/branches/stats")
  return res.data.data
}
