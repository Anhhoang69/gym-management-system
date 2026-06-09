import { useState, useEffect } from "react"
import { getTokenUsage } from "../services/aiService"
import { ChevronDown, BarChart2 } from "lucide-react"
import { useLanguage } from "../../../shared/contexts/LanguageContext"

// Check if user has token stats access
function hasTokenAccess() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const roles = user.roles || []
    return roles.some((r) =>
      ["SuperAdmin", "SUPERADMIN", "GymOwner", "GYMOWNER"].includes(r)
    )
  } catch {
    return false
  }
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[var(--hover)] rounded-xl p-2 px-2.5 border border-[var(--border)]/20">
      <div className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
        {label}
      </div>
      <div className="text-[14px] font-extrabold mt-0.5 truncate" style={{ color: color || "var(--text-primary)" }}>
        {value ?? "–"}
      </div>
    </div>
  )
}

function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="text-[var(--text-primary)] font-bold">{value?.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: color || "var(--brand)"
          }}
        />
      </div>
    </div>
  )
}

const ROLE_COLORS = {
  Member: "var(--brand)",
  Staff: "#3b82f6",
  PT: "#8b5cf6",
  BranchAdmin: "#f59e0b",
  GymOwner: "#ef4444",
  SuperAdmin: "#ec4899"
}

export default function AITokenDashboard({ collapsed = false, onExpand }) {
  const { locale } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const canAccess = hasTokenAccess()

  useEffect(() => {
    if (!canAccess) return
    getTokenUsage(30).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [canAccess])

  if (!canAccess) return null

  if (collapsed) {
    return (
      <div className="border-t border-[var(--border)]/30 pt-3 mt-3 w-full flex justify-center">
        <button
          onClick={onExpand}
          className="group relative w-10 h-10 flex items-center justify-center rounded-xl border-none bg-transparent hover:bg-[var(--hover)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <BarChart2 size={18} className="text-[var(--brand)]" />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-50">
            AI Token Usage
          </div>
        </button>
      </div>
    )
  }

  const totalTokens = data?.totalTokens ?? 0
  const promptTokens = data?.promptTokens ?? 0
  const completionTokens = data?.completionTokens ?? 0
  const estimatedCost = data?.estimatedCostUsd?.toFixed(4) ?? "0.0000"
  const breakdown = data?.breakdownByRole ?? []
  const maxBreakdown = Math.max(...breakdown.map((b) => b.totalTokens || 0), 1)

  return (
    <div className="border-t border-[var(--border)] pt-3.5 mt-3.5">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between bg-none border-none cursor-pointer py-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 size={12} className="text-[var(--brand)]" />
          AI Token Usage
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-2.5">
          {loading ? (
            <div className="text-xs text-[var(--text-secondary)] py-1">
              {locale === 'vi' ? "Đang tải..." : "Loading..."}
            </div>
          ) : !data ? (
            <div className="text-xs text-[var(--text-secondary)] py-1">
              {locale === 'vi' ? "Không có dữ liệu." : "No data available."}
            </div>
          ) : (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <StatCard label="Total tokens" value={totalTokens.toLocaleString()} color="var(--brand)" />
                <StatCard label="Est. cost" value={`$${estimatedCost}`} color="#22c55e" />
                <StatCard label="Prompt" value={promptTokens.toLocaleString()} />
                <StatCard label="Completion" value={completionTokens.toLocaleString()} />
              </div>

              {/* Breakdown by role */}
              {breakdown.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    {locale === 'vi' ? "Theo role (30 ngày)" : "By role (30 days)"}
                  </div>
                  {breakdown.map((b, i) => (
                    <BarRow
                      key={i}
                      label={b.role}
                      value={b.totalTokens}
                      max={maxBreakdown}
                      color={ROLE_COLORS[b.role] || "var(--brand)"}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
