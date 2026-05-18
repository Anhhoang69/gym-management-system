import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-full bg-transparent">
      <div
        className="relative max-w-3xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--brand)] focus-within:border-transparent shadow-lg"
        style={{
          backgroundColor: 'var(--bg-third)',
          borderColor: 'var(--border)'
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi AI về tập luyện, dinh dưỡng..."
          className="w-full pl-5 pr-14 py-4 max-h-[200px] min-h-[60px] resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-[15px] leading-relaxed"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className={`absolute right-3 bottom-3 p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${input.trim()
              ? "shadow-md hover:scale-105 active:scale-95"
              : "cursor-not-allowed opacity-40"
            }`}
          style={{
            color: input.trim() ? 'var(--on-brand)' : 'var(--text-secondary)',
          }}
        >
          <FaPaperPlane size={14} className={input.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
        </button>
      </div>
      <p className="text-center text-[11px] mt-3 font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>
        EnerGym AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.
      </p>
    </div>
  );
}