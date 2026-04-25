import { useEffect, useRef, useState } from "react"
import {
    sendMessageToAI,
    getAIHistory,
    getAIRecommendations
} from "../services/aiService"

import ChatMessage from "../components/ai/ChatMessage"
import ChatInput from "../components/ai/ChatInput"
import AIPlanCard from "../components/ai/AIPlanCard"

export default function AIChatPage() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [plans, setPlans] = useState([])
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const chatRef = useRef(null)

    // ================= LOAD =================
    useEffect(() => {
        loadHistory()
        loadPlans()
    }, [])

    const loadHistory = async () => {
        const history = await getAIHistory(20)

        const formatted = history.map((msg, i) => ({
            ...msg,
            role: i % 2 === 0 ? "user" : "assistant"
        }))

        setMessages(formatted)
    }

    const loadPlans = async () => {
        const data = await getAIRecommendations()
        setPlans(data)
    }

    // ================= SCROLL BUTTON =================
    const handleScroll = () => {
        const el = chatRef.current
        if (!el) return

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 100

        setShowScrollBtn(!isNearBottom)
    }

    const scrollToBottom = () => {
        const el = chatRef.current
        if (!el) return

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth"
        })
    }

    // ================= CHAT =================
    const handleSend = async (input) => {
        if (!input.trim()) return

        // push message user
        setMessages((prev) => [
            ...prev,
            { role: "user", message: input }
        ])

        setLoading(true)

        try {
            const ai = await sendMessageToAI(input)

            // push message AI
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    message: ai.message,
                    type: ai.type,
                    parsed: ai.parsed
                }
            ])

            // 🔥 reload plans để sidebar update ngay
            await loadPlans()

        } catch (error) {
            console.error("AI ERROR:", error)

            // fallback message
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    message: "❌ Có lỗi xảy ra, thử lại nhé!"
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    // ================= QUICK =================
    const quickActions = [
        "Gợi ý giảm cân",
        "Lịch tập tuần này",
        "Ăn gì để giảm mỡ",
        "Tăng cơ cho nữ",
    ]

    // ================= RENDER =================
    const renderMessage = (msg, index) => {
        // ❌ KHÔNG render plan trong chat nữa
        return <ChatMessage key={index} {...msg} />
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <div className="w-64 flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-third)] flex flex-col min-h-0">

                <div className="p-4 space-y-6 overflow-y-auto flex-1">

                    {/* QUICK */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3">
                            Gợi ý nhanh
                        </p>

                        <div className="flex flex-col gap-1">
                            {quickActions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="text-sm px-3 py-2 rounded-md hover:bg-[var(--hover)] text-left"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SAVED */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3">
                            Kế hoạch đã lưu
                        </p>

                        <div className="flex flex-col gap-1">
                            {plans.length === 0 && (
                                <p className="text-sm text-gray-400 px-2">Chưa có kế hoạch</p>
                            )}

                            {plans.map((plan, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedPlan(plan)}
                                    className="text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--hover)]"
                                >
                                    🏋️ {plan.summary || "Workout Plan"}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ================= MAIN ================= */}
            <div className="flex flex-1 relative">

                {/* CHAT AREA */}
                <div
                    ref={chatRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-4 py-6 pb-32"
                >
                    <div className="max-w-[680px] mx-auto space-y-4 bg-[var(--bg-third)]">

                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm">
                                👋 Xin chào! Hỏi mình về tập luyện, dinh dưỡng nhé.
                            </div>
                        )}

                        {messages.map(renderMessage)}

                        {loading && (
                            <p className="text-sm text-gray-400">AI đang trả lời...</p>
                        )}
                    </div>
                </div>

                {/* SCROLL BUTTON */}
                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-20 right-4 bg-[var(--brand)] text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:opacity-80"
                    >
                        ↓
                    </button>
                )}

                {/* INPUT FIXED */}
                <div className="absolute bottom-0 left-0 w-full border-t border-[var(--border)] bg-[var(--bg-third)]">
                    <div className="max-w-[680px] mx-auto">
                        <ChatInput onSend={handleSend} />
                    </div>
                </div>

            </div>

            {/* ================= DRAWER ================= */}
            {selectedPlan && (
                <>
                    {/* BACKDROP */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setSelectedPlan(null)}
                    />

                    {/* DRAWER */}
                    <div className="fixed top-0 right-0 h-full w-[75vw] bg-[var(--bg-third)] z-50 shadow-xl flex flex-col">

                        {/* HEADER */}
                        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                            <h2 className="font-semibold">📋 Chi tiết kế hoạch</h2>

                            <button
                                onClick={() => setSelectedPlan(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--hover)]"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                                    <path d="M6 6L18 18" />
                                    <path d="M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <AIPlanCard data={selectedPlan} />
                        </div>

                    </div>
                </>
            )}
        </div>
    )
}