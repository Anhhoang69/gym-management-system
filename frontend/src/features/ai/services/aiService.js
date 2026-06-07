import api from "../../../shared/api/api"

// ================= HELPER =================

const cleanJSONString = (text) => {
  if (!text) return text
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
}

const tryParseJSON = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// ================= AI CHAT =================

// POST /api/ai/chat
export const sendMessageToAI = async (message) => {
  try {
    if (!message || !message.trim()) {
      throw new Error("Message is empty")
    }

    const res = await api.post("/api/ai/chat", { message })
    const { success, data, message: msg } = res.data

    if (!success) {
      throw new Error(msg || "AI error")
    }

    let result = {
      type: data?.type || "text",
      message: data?.message || ""
    }

    // handle JSON even when backend sends wrong type
    const cleaned = cleanJSONString(result.message)
    const parsed = tryParseJSON(cleaned)

    if (parsed) {
      result = {
        type: "json",
        message: cleaned,
        parsed
      }
    }

    return result

  } catch (error) {
    console.error("AI CHAT ERROR:", error)

    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = "/login"
    }

    return {
      message: "AI đang bận, thử lại sau 😥",
      type: "text",
      isError: true
    }
  }
}

// ================= HISTORY =================

// GET /api/ai/history
export const getAIHistory = async (limit = 20) => {
  try {
    const res = await api.get("/api/ai/history", {
      params: { limit }
    })

    const { success, data } = res.data

    if (!success) throw new Error("Failed to fetch history")

    const list = Array.isArray(data) ? data : []
    return list.map((msg) => {
      const cleaned = cleanJSONString(msg.message)
      const parsed = tryParseJSON(cleaned)

      return {
        ...msg,
        message: cleaned,
        type: parsed ? "json" : msg.type,
        parsed
      }
    })

  } catch (error) {
    console.error("AI HISTORY ERROR:", error)
    return []
  }
}

// ================= RECOMMENDATIONS =================

// GET /api/ai/recommendations  (Member only)
export const getAIRecommendations = async () => {
  try {
    const res = await api.get("/api/ai/recommendations")
    const { success, data } = res.data

    if (!success) throw new Error("Failed to fetch recommendations")

    return data || []

  } catch (error) {
    console.error("AI RECOMMEND ERROR:", error)
    return []
  }
}

// ================= TOOLS DISCOVERY =================

// GET /api/ai/tools  — RBAC-filtered, returns tools the current user may use
export const getAvailableTools = async () => {
  try {
    const res = await api.get("/api/ai/tools")

    // Backend returns plain array (not wrapped in ApiResponse for this endpoint)
    const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])

    return data // [{ name, description, schema }]

  } catch (error) {
    console.error("AI TOOLS ERROR:", error)
    return []
  }
}

// ================= TOKEN USAGE =================

// GET /api/ai/usage  (SuperAdmin / GymOwner only)
export const getTokenUsage = async (days = 30) => {
  try {
    const res = await api.get("/api/ai/usage", {
      params: { days }
    })

    const data = res.data?.data ?? res.data

    return data

  } catch (error) {
    console.error("AI USAGE ERROR:", error)
    return null
  }
}
