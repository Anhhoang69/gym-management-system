import { useState, useEffect } from "react"
import { getAvailableTools } from "../services/aiService"
import { ChevronDown, Terminal } from "lucide-react"
import { useLanguage } from "../../../shared/contexts/LanguageContext"

export default function AIToolsPanel({ collapsed = false, onExpand }) {
  const { locale } = useLanguage()
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    getAvailableTools().then((data) => {
      setTools(data || [])
      setLoading(false)
    })
  }, [])

  if (collapsed) {
    return (
      <div className="border-t border-[var(--border)]/30 pt-3 mt-3 w-full flex justify-center">
        <button
          onClick={onExpand}
          className="group relative w-10 h-10 flex items-center justify-center rounded-xl border-none bg-transparent hover:bg-[var(--hover)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Terminal size={18} className="text-[var(--brand)]" />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-50">
            {locale === 'vi' ? `Tools khả dụng (${tools.length})` : `Available Tools (${tools.length})`}
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-[var(--border)] pt-3.5 mt-3.5">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between bg-none border-none cursor-pointer py-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {locale === 'vi' ? "Tools khả dụng" : "Available Tools"}
        </span>
        <span className="flex items-center gap-1.5">
          {!loading && (
            <span className="bg-[var(--brand)] text-black rounded-full text-[10px] font-extrabold px-1.5 py-0.5 min-w-5 text-center">
              {tools.length}
            </span>
          )}
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Tools list */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-1.5">
          {loading ? (
            <div className="text-xs text-[var(--text-secondary)] py-1">
              {locale === 'vi' ? "Đang tải..." : "Loading..."}
            </div>
          ) : tools.length === 0 ? (
            <div className="text-xs text-[var(--text-secondary)] py-1">
              {locale === 'vi' ? "Không có tool nào." : "No tools available."}
            </div>
          ) : (
            tools.map((tool, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => setTooltip(i)}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--hover)] hover:bg-[var(--border)]/10 transition-colors cursor-default"
                >
                  <Terminal size={12} className="text-[var(--brand)] flex-shrink-0" />
                  <span
                    className="text-xs text-[var(--text-primary)] font-mono overflow-hidden text-ellipsis whitespace-nowrap flex-1"
                  >
                    {tool.name}
                  </span>
                </div>

                {/* Tooltip */}
                {tooltip === i && tool.description && (
                  <div
                    className="absolute left-full top-0 ml-2 w-56 bg-[var(--bg-secondary,#f8f9fa)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--text-secondary)] leading-relaxed z-50 shadow-lg"
                  >
                    {tool.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
