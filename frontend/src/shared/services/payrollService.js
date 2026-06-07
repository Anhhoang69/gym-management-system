import api from "../api/api"

// GET /api/payroll/formula - View all formulas
export const getPayrollFormulas = async () => {
  try {
    const res = await api.get("/api/payroll/formula")
    return res.data // { success: true, data: [...] }
  } catch (e) {
    console.error("Failed to get payroll formulas", e)
    return { success: false, data: [] }
  }
}

// POST /api/payroll/formula - Create new payroll formula (SuperAdmin)
export const createPayrollFormula = async (formulaData) => {
  try {
    const res = await api.post("/api/payroll/formula", formulaData)
    return res.data
  } catch (e) {
    console.error("Failed to create payroll formula", e)
    return { success: false, message: e.response?.data?.message || "Lỗi tạo công thức" }
  }
}

// PATCH /api/payroll/formula/{id}/active - Activate payroll formula (SuperAdmin)
export const activatePayrollFormula = async (id) => {
  try {
    const res = await api.patch(`/api/payroll/formula/${id}/active`)
    return res.data
  } catch (e) {
    console.error("Failed to activate payroll formula", e)
    return { success: false, message: e.response?.data?.message || "Lỗi kích hoạt công thức" }
  }
}

// POST /api/payroll/calculate - Calculate payroll by period (GymOwner, BranchAdmin)
// payload: { month: 5, year: 2026, formulaId: "..." }
export const calculatePayroll = async ({ month, year, formulaId }) => {
  try {
    const res = await api.post("/api/payroll/calculate", { month, year, formulaId })
    return res.data
  } catch (e) {
    console.error("Failed to calculate payroll", e)
    return { success: false, message: e.response?.data?.message || "Lỗi tính toán payroll" }
  }
}

// GET /api/payroll/report - View payroll report (SuperAdmin, GymOwner, BranchAdmin)
export const getPayrollReports = async (month, year, extraParams = {}) => {
  try {
    const res = await api.get("/api/payroll/report", { 
      params: { month, year, ...extraParams } 
    })
    return res.data
  } catch (e) {
    console.error("Failed to get payroll reports", e)
    return { success: false, data: [] }
  }
}

// GET /api/payroll/my - View personal payroll (PT)
export const getMyPayroll = async (month, year) => {
  try {
    const res = await api.get("/api/payroll/my", { params: { month, year } })
    return res.data
  } catch (e) {
    console.error("Failed to get personal payroll", e)
    return { success: false, data: [] }
  }
}

// POST /api/payroll/approve-period - Approve payroll by period (GymOwner)
export const approvePayrollPeriod = async (month, year, branchId) => {
  try {
    const payload = { month, year }
    if (branchId) payload.branchId = branchId;
    const res = await api.post("/api/payroll/approve-period", payload)
    return res.data
  } catch (e) {
    console.error("Failed to approve payroll period", e)
    return { success: false, message: e.response?.data?.message || "Lỗi phê duyệt kỳ lương" }
  }
}

// GET /api/payroll/export - Export CSV payroll (SuperAdmin, GymOwner, BranchAdmin)
export const exportPayrollCsv = async (month, year, branchId) => {
  try {
    const params = { month, year }
    if (branchId) params.branchId = branchId;
    
    // Standard file download behavior
    const response = await api.get(`/api/payroll/export`, {
      params,
      responseType: "blob"
    })
    
    // Create a link element to trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `payroll_report_${year}_${month}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { success: true }
  } catch (e) {
    console.error("Failed to export payroll CSV", e)
    return { success: false, message: "Lỗi xuất file CSV" }
  }
}
