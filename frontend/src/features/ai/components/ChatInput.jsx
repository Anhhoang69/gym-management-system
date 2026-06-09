import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { useLanguage } from "../../../shared/contexts/LanguageContext"

export default function ChatInput({ onSend, disabled }) {
  const { locale } = useLanguage()
  const [input, setInput] = useState("")
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 180) + "px"
  }, [input])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput("")
    // reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = input.trim().length > 0 && !disabled

  return (
    <div className="w-full">
      <div
        className="relative max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-third)] shadow-sm transition-all duration-200 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/15"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={locale === 'vi' ? "Hỏi AI về tập luyện, dinh dưỡng, quản lý gym..." : "Ask AI about workouts, nutrition, gym management..."}
          disabled={disabled}
          rows={1}
          className="w-full pl-4.5 pr-14 py-3.5 max-h-[180px] min-h-[52px] resize-none border-none outline-none bg-transparent text-[var(--text-primary)] text-[15px] leading-relaxed font-sans overflow-y-auto block"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          title={locale === 'vi' ? "Gửi (Enter)" : "Send (Enter)"}
          className={`absolute right-2.5 bottom-2.5 w-9 h-9 rounded-xl border-none flex items-center justify-center transition-all duration-200 ${
            canSend
              ? "bg-[var(--brand)] text-black cursor-pointer scale-100 opacity-100 hover:opacity-90 active:scale-95"
              : "bg-[var(--hover)] text-[var(--text-secondary)] cursor-not-allowed scale-90 opacity-50"
          }`}
        >
          <Send size={15} />
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-[11px] mt-2 text-[var(--text-secondary)] opacity-60">
        {locale === 'vi' 
          ? "Enter để gửi · Shift+Enter để xuống dòng · EnerGym AI có thể lập kế hoạch và quản lý dữ liệu"
          : "Enter to send · Shift+Enter for new line · EnerGym AI can create plans & manage data"}
      </p>
    </div>
  )
}
