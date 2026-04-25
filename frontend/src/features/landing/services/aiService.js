import api from "../api/api"

// ================= HELPER =================

// 👉 clean markdown JSON
const cleanJSONString = (text) => {
  if (!text) return text

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
}

// 👉 try parse JSON
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

    // 🔥 FIX: handle JSON even when backend gửi sai type
    const cleaned = cleanJSONString(result.message)
    const parsed = tryParseJSON(cleaned)

    if (parsed) {
      result = {
        type: "json",
        message: cleaned,
        parsed // 👈 UI dùng cái này luôn
      }
    }

    return result

  } catch (error) {
    console.error("AI CHAT ERROR:", error)

    // 🔥 handle 401
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

export const getAIHistory = async (limit = 20) => {
  try {
    const res = await api.get("/api/ai/history", {
      params: { limit }
    })

    const { success, data } = res.data

    if (!success) throw new Error("Failed to fetch history")

    // 🔥 normalize + parse JSON luôn
    return data.map((msg) => {
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

export const getAIRecommendations = async () => {
  try {
    const res = await api.get("/api/ai/recommendations")

    const { success, data } = res.data

    if (!success) throw new Error("Failed to fetch recommendations")

    return data // chuẩn rồi

  } catch (error) {
    console.error("AI RECOMMEND ERROR:", error)
    return []
  }
}