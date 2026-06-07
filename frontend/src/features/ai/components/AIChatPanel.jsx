import { Bot, ClipboardList, X, ChevronDown, ChevronRight, Dumbbell } from "lucide-react"
import * as Lucide from "lucide-react"
import { useAIChat } from "../hooks/useAIChat"
import MarkdownMessage from "./MarkdownMessage"
import ChatInput from "./ChatInput"
import AIPlanCard from "./AIPlanCard"
import AIToolsPanel from "./AIToolsPanel"
import AITokenDashboard from "./AITokenDashboard"

// Helper component to render Lucide icons by name string
function LucideIcon({ name, size = 18, className = "" }) {
  const IconComponent = Lucide[name] || Lucide.Sparkles
  return <IconComponent size={size} className={className} />
}

// ─── Dot Pulse Loader ─────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,193,7,0.2)] animate-pulse"
      >
        <Bot size={15} className="text-black" />
      </div>
      <div className="pt-2.5 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="ai-dot w-2 h-2 rounded-full bg-[var(--brand)] inline-block"
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onQuick, quickActions }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}") } catch { return {} }
  })()

  const name = user?.fullName?.split(" ").pop() || user?.email?.split("@")[0] || "bạn"

  const greetings = [
    { icon: "💪", title: `Xin chào ${name}!`, desc: "Hỏi tôi bất cứ điều gì về tập luyện, dinh dưỡng hay quản lý gym." },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-10 px-5 text-center">
      {/* Animated robot icon */}
      <div
        className="w-16 h-16 rounded-full bg-[var(--brand)] flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(255,193,7,0.25)] animate-bounce"
      >
        <Bot size={32} className="text-black" />
      </div>

      <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
        {greetings[0].title}
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-9">
        {greetings[0].desc}
      </p>

      {/* Suggestion cards */}
      {Array.isArray(quickActions) && quickActions.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 max-w-lg w-full">
          {quickActions.slice(0, 4).map((action, i) => (
            <button
              key={i}
              onClick={() => onQuick(action.prompt)}
              className="flex flex-col items-start gap-1.5 p-4 bg-[var(--bg-third)] border border-[var(--border)] rounded-xl cursor-pointer text-left transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 hover:-translate-y-0.5 text-[var(--text-primary)]"
            >
              <span className="text-[var(--brand)]">
                <LucideIcon name={action.icon} size={20} />
              </span>
              <span className="text-xs font-semibold leading-snug">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, index, onViewPlan, onCopy, copied }) {
  const isUser = msg.role === "user"
  const isJson = msg.type === "json" && msg.parsed

  if (isUser) {
    return (
      <div className="flex justify-end mb-5">
        <div className="max-w-[72%] px-4.5 py-3 rounded-[20px_20px_4px_20px] bg-[var(--brand)] text-black text-[15px] font-medium leading-relaxed shadow-[0_2px_8px_rgba(255,193,7,0.2)]">
          {msg.message}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 mb-6">
      {/* AI Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(255,193,7,0.2)] ${
          msg.isError ? "bg-red-500 shadow-red-500/20" : "bg-[var(--brand)]"
        }`}
      >
        <Bot size={15} className="text-black" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Text message */}
        {msg.message && !isJson && (
          <MarkdownMessage
            text={msg.message}
            onCopy={onCopy ? (t) => onCopy(t, index) : undefined}
          />
        )}

        {/* Plan card (JSON) */}
        {isJson && (
          <div className="mt-1.5 p-4 bg-[var(--bg-third)] border border-[var(--border)] rounded-2xl max-w-sm shadow-sm">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--hover)] flex items-center justify-center text-[var(--brand)]">
                <ClipboardList size={18} />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  Kế hoạch đã sẵn sàng
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Được tạo bởi EnerGym AI
                </div>
              </div>
            </div>
            <button
              onClick={() => onViewPlan && onViewPlan(msg.parsed)}
              className="w-full py-2.5 px-4 rounded-xl border-none bg-[var(--brand)] text-black font-bold text-sm cursor-pointer flex items-center justify-between transition-all duration-200 hover:opacity-90"
            >
              <span>Xem chi tiết kế hoạch</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Copy feedback */}
        {copied && (
          <span className="text-[11px] text-green-500 mt-1 block">
            ✓ Đã sao chép
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Plan Drawer ──────────────────────────────────────────────────────────────
function PlanDrawer({ plan, onClose }) {
  if (!plan) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-[480px] max-w-[75vw] bg-[var(--bg-third)] z-50 shadow-2xl flex flex-col transition-all duration-300 ease-in-out"
      >
        <div className="px-5 py-4 border-b border-[var(--border)] flex justify-between items-center flex-shrink-0">
          <h3 className="font-extrabold text-base text-[var(--text-primary)] m-0">
            📋 Chi tiết kế hoạch
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border-none bg-[var(--hover)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <AIPlanCard data={plan} />
        </div>
      </div>
    </>
  )
}

// ─── Main AIChatPanel ─────────────────────────────────────────────────────────
export default function AIChatPanel({ headerHeight = 70 }) {
  const {
    messages,
    loading,
    historyLoading,
    plans,
    quickActions,
    selectedPlan,
    showScrollBtn,
    copiedMsg,
    isMember,
    chatRef,
    handleSend,
    handleScroll,
    scrollToBottom,
    setSelectedPlan,
    handleCopyMessage
  } = useAIChat()

  const panelHeight = `calc(100vh - ${headerHeight}px)`

  return (
    <div
      className="flex overflow-hidden bg-[var(--bg)]"
      style={{
        height: panelHeight
      }}
    >
      {/* ═══════════════════════════════════════════════════
          LEFT SIDEBAR
      ═══════════════════════════════════════════════════ */}
      <div
        className="w-[244px] flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-third)] flex flex-col overflow-hidden"
      >
        {/* EnerGym AI logo/header */}
        <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-black font-semibold shadow-sm"
            >
              <Bot size={14} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[var(--text-primary)] leading-tight">EnerGym AI</div>
              <div className="text-[10px] text-[var(--text-secondary)]">Trợ lý thông minh</div>
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* Quick Actions */}
          {Array.isArray(quickActions) && quickActions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Gợi ý nhanh
              </p>
              <div className="flex flex-col gap-1">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.prompt)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-none bg-transparent cursor-pointer text-[var(--text-primary)] text-[13px] text-left transition-colors hover:bg-[var(--hover)]"
                  >
                    <span className="text-[var(--brand)] flex-shrink-0">
                      <LucideIcon name={action.icon} size={15} />
                    </span>
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Plans (Member only) */}
          {isMember && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Kế hoạch đã lưu
              </p>
              {!Array.isArray(plans) || plans.length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)] px-1">
                  Chưa có kế hoạch
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {plans.map((plan, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-none bg-transparent cursor-pointer text-[var(--text-primary)] text-[13px] text-left transition-colors hover:bg-[var(--hover)]"
                    >
                      <Dumbbell size={14} className="text-[var(--brand)] flex-shrink-0" />
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {plan?.summary || "Workout Plan"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tools Panel */}
          <AIToolsPanel />

          {/* Token Dashboard (SuperAdmin/GymOwner) */}
          <AITokenDashboard />

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          CENTER CHAT
      ═══════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col relative bg-[var(--bg)]"
      >
        {/* Chat messages area */}
        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-8"
        >
          <div className="max-w-3xl mx-auto">

            {historyLoading ? (
              <div className="flex justify-center items-center pt-20">
                <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin"></div>
                  Đang tải lịch sử...
                </div>
              </div>
            ) : messages.length === 0 ? (
              <EmptyState onQuick={handleSend} quickActions={quickActions} />
            ) : (
              messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  msg={msg}
                  index={i}
                  onViewPlan={setSelectedPlan}
                  onCopy={handleCopyMessage}
                  copied={copiedMsg === i}
                />
              ))
            )}

            {loading && <ThinkingDots />}

          </div>
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[var(--bg-third)] border border-[var(--border)] shadow-md cursor-pointer flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand)] active:scale-95 transition-all z-10"
          >
            <ChevronDown size={14} />
          </button>
        )}

        {/* Input */}
        <div
          className="flex-shrink-0 px-6 py-4 bg-[var(--bg)] border-t border-[var(--border)]/10"
        >
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          PLAN DRAWER (right slide-in)
      ═══════════════════════════════════════════════════ */}
      <PlanDrawer
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  )
}
