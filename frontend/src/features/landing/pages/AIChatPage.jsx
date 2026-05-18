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
        return <ChatMessage key={index} {...msg} onViewPlan={setSelectedPlan} />
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>

            {/* ================= SIDEBAR ================= */}
            <div className="w-64 flex-shrink-0 border-r flex flex-col min-h-0" style={{ backgroundColor: 'var(--bg-third)', borderColor: 'var(--border)' }}>

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
                                    className="text-sm px-3 py-2 rounded-md hover:bg-[var(--hover)] text-left transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
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
                                    className="text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--hover)] transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    🏋️ {plan.summary || "Workout Plan"}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ================= MAIN ================= */}
            <div className="flex flex-col flex-1 relative" style={{ backgroundColor: 'var(--bg)' }}>

                {/* CHAT AREA */}
                <div
                    ref={chatRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
                >
                    <div className="max-w-[768px] mx-auto space-y-6">

                        {messages.length === 0 && (
                            <div className="text-center mt-24">
                                <div className="w-16 h-16 bg-[var(--brand)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/20 text-black">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Xin chào!</h3>
                                <p className="text-[15px] max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Hỏi mình bất cứ điều gì về lộ trình tập luyện, dinh dưỡng, hoặc cách đạt được mục tiêu thể hình của bạn.
                                </p>
                            </div>
                        )}

                        {messages.map(renderMessage)}

                        {loading && (
                            <div className="flex gap-4 w-full mb-6 animate-pulse">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--hover)' }}></div>
                                <div className="h-12 w-24 rounded-2xl rounded-tl-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SCROLL BUTTON */}
                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2f2f2f] text-gray-500 dark:text-gray-300 w-9 h-9 border border-gray-200 dark:border-gray-700 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    </button>
                )}

                {/* INPUT FIXED */}
                <div className="w-full shrink-0 px-4 pt-4 pb-6" style={{ backgroundColor: 'var(--bg)' }}>
                    <div className="max-w-[768px] mx-auto">
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