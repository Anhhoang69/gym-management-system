import { useState } from "react"

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("")

  const handleSubmit = () => {
    onSend(input)
    setInput("")
  }

  return (
    <div className="p-4 border-t border-[var(--border)] flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Hỏi AI về tập luyện, dinh dưỡng..."
        className="flex-1 px-3 py-2 rounded border border-[var(--border)]"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        className="bg-[var(--brand)] px-4 rounded font-semibold"
      >
        Gửi
      </button>
    </div>
  )
}