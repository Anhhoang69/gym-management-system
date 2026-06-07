import { useState, useEffect, useRef, useCallback } from "react"
import {
  sendMessageToAI,
  getAIHistory,
  getAIRecommendations,
  getAvailableTools
} from "../services/aiService"
import { buildQuickActions } from "../models/quickActions"

/**
 * useAIChat – central hook for the AI chat panel.
 * Separates all state & async logic from the UI.
 */
export function useAIChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [plans, setPlans] = useState([])          // AIRecommendations (Member)
  const [quickActions, setQuickActions] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [copiedMsg, setCopiedMsg] = useState(null) // index of copied message

  const chatRef = useRef(null)

  // ── Is current user a Member? ──────────────────────────────────────────────
  const isMember = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const roles = (user.roles || []).map((r) => r.toLowerCase())
      return roles.includes("member") || roles.includes("role_member")
    } catch {
      return false
    }
  }, [])

  // ── Scroll helpers ─────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = chatRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  const handleScroll = useCallback(() => {
    const el = chatRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    setShowScrollBtn(!nearBottom)
  }, [])

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setHistoryLoading(true)
      try {
        // Fetch history and tools concurrently to speed up load time
        const [history, tools] = await Promise.all([
          getAIHistory(20),
          getAvailableTools()
        ])

        const formatted = history.map((msg) => ({
          ...msg,
          role: msg.type === "user" ? "user" : "assistant"
        }))
        setMessages(formatted)
        setQuickActions(buildQuickActions(tools))

        // Load recommendations in the background so it never blocks UI rendering
        if (isMember()) {
          getAIRecommendations()
            .then((recs) => {
              setPlans(recs || [])
            })
            .catch((err) => {
              console.error("Failed to load recommendations:", err)
            })
        }
      } catch (err) {
        console.error("useAIChat init error:", err)
      } finally {
        setHistoryLoading(false)
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom("instant"), 50)
      }
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto scroll on new messages ────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom("smooth"), 60)
    }
  }, [messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async (input) => {
    const text = input?.trim()
    if (!text || loading) return

    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", message: text }])
    setLoading(true)

    try {
      const ai = await sendMessageToAI(text)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: ai.message,
          type: ai.type,
          parsed: ai.parsed,
          isError: ai.isError
        }
      ])

      // If AI generated a plan, refresh recommendations sidebar
      if (ai.type === "json" && isMember()) {
        getAIRecommendations().then((recs) => setPlans(recs || [])).catch(() => {})
      }

    } catch (err) {
      console.error("handleSend error:", err)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: "❌ Có lỗi xảy ra, thử lại nhé!", isError: true }
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, isMember])

  // ── Copy message text ──────────────────────────────────────────────────────
  const handleCopyMessage = useCallback((text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMsg(index)
      setTimeout(() => setCopiedMsg(null), 2000)
    })
  }, [])

  return {
    // State
    messages,
    loading,
    historyLoading,
    plans,
    quickActions,
    selectedPlan,
    showScrollBtn,
    copiedMsg,
    isMember: isMember(),

    // Refs
    chatRef,

    // Actions
    handleSend,
    handleScroll,
    scrollToBottom,
    setSelectedPlan,
    handleCopyMessage
  }
}
