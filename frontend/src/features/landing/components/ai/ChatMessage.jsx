export default function ChatMessage({ role, message }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-lg text-sm
          ${role === "user"
            ? "bg-[var(--brand)] text-black"
            : "bg-[var(--bg-third)]"}
        `}
      >
        {message}
      </div>
    </div>
  )
}