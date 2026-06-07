/**
 * MarkdownMessage – Renders AI markdown responses beautifully using Tailwind CSS.
 * Pure JS regex parsing – zero external dependencies.
 */

import { useMemo, useState } from "react"
import { Copy, Check, Clipboard } from "lucide-react"

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title="Sao chép"
      className="absolute top-2 right-2 bg-[var(--hover)] border border-[var(--border)] rounded-lg p-1.5 text-xs cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)]/80 transition-all flex items-center justify-center"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  )
}

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, lang }) {
  return (
    <div className="relative my-3">
      <pre className="bg-[var(--bg-secondary,#f8f9fa)] border border-[var(--border,#dee2e6)] rounded-xl pl-3.5 pr-10 py-3 overflow-x-auto text-[13px] leading-relaxed text-[var(--text-primary)] font-mono">
        {lang && (
          <span className="block text-[10px] text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider font-semibold">
            {lang}
          </span>
        )}
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
function MarkdownTable({ rows }) {
  if (!rows || rows.length < 2) return null

  const header = rows[0]
  const body = rows.slice(2) // skip separator row

  return (
    <div className="overflow-x-auto my-3 border border-[var(--border)] rounded-xl">
      <table className="ai-table w-full border-collapse text-[14px]">
        <thead>
          <tr className="bg-[var(--hover)] border-b border-[var(--border)]">
            {header.map((cell, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold text-[var(--text-primary)]">
                {cell.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)]/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-[var(--text-primary)]">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Inline formatting ────────────────────────────────────────────────────────
function renderInline(text) {
  // Split by code spans first, then apply other formatting
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="ai-code bg-[var(--hover)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono text-[13px] text-yellow-600 dark:text-yellow-400">
          {part.slice(1, -1)}
        </code>
      )
    }

    // Bold + italic combined
    const formatted = part
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")

    return (
      <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
    )
  })
}

// ─── Main parser ──────────────────────────────────────────────────────────────
function parseMarkdown(text) {
  if (!text) return []

  const lines = text.split("\n")
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // ── Fenced code block ──
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: "code", code: codeLines.join("\n"), lang })
      i++
      continue
    }

    // ── Heading ──
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      blocks.push({ type: "heading", level, text: headingMatch[2] })
      i++
      continue
    }

    // ── Horizontal rule ──
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // ── Table ──
    if (line.includes("|") && lines[i + 1]?.includes("|")) {
      const tableRows = []
      while (i < lines.length && lines[i].includes("|")) {
        const cells = lines[i]
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "")
        tableRows.push(cells)
        i++
      }
      blocks.push({ type: "table", rows: tableRows })
      continue
    }

    // ── Unordered list ──
    if (/^[\-\*\+]\s/.test(line)) {
      const items = []
      while (i < lines.length && /^[\-\*\+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\-\*\+]\s/, ""))
        i++
      }
      blocks.push({ type: "ul", items })
      continue
    }

    // ── Ordered list ──
    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""))
        i++
      }
      blocks.push({ type: "ol", items })
      continue
    }

    // ── Blank line ──
    if (line.trim() === "") {
      i++
      continue
    }

    // ── Paragraph ──
    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !/^[\-\*\+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !(lines[i].includes("|") && lines[i + 1]?.includes("|"))
    ) {
      paraLines.push(lines[i])
      i++
    }

    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join("\n") })
    } else {
      // Fallback: If i wasn't advanced (e.g. line starts with '#' but wasn't matched as heading,
      // or is a single table-like line that didn't form a table), force consume it to prevent infinite loop.
      blocks.push({ type: "paragraph", text: lines[i] })
      i++
    }
  }

  return blocks
}

// ─── Block renderer ───────────────────────────────────────────────────────────
function renderBlock(block, index) {
  switch (block.type) {
    case "code":
      return <CodeBlock key={index} code={block.code} lang={block.lang} />

    case "heading": {
      const classes = {
        1: "text-2xl font-bold text-[var(--text-primary)] mt-5 mb-2.5",
        2: "text-xl font-bold text-[var(--text-primary)] mt-4 mb-2",
        3: "text-lg font-bold text-[var(--text-primary)] mt-3 mb-1.5"
      }
      return (
        <div key={index} className={classes[block.level] || classes[3]}>
          {renderInline(block.text)}
        </div>
      )
    }

    case "hr":
      return <hr key={index} className="border-none border-t border-[var(--border)] my-4" />

    case "table":
      return <MarkdownTable key={index} rows={block.rows} />

    case "ul":
      return (
        <ul key={index} className="pl-6 my-2 list-disc space-y-1 text-[var(--text-primary)]">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )

    case "ol":
      return (
        <ol key={index} className="pl-6 my-2 list-decimal space-y-1 text-[var(--text-primary)]">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )

    case "paragraph":
      return (
        <p key={index} className="my-2 leading-relaxed text-[var(--text-primary)]">
          {block.text.split("\n").map((line, i, arr) => (
            <span key={i}>
              {renderInline(line)}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      )

    default:
      return null
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function MarkdownMessage({ text, onCopy }) {
  const blocks = useMemo(() => parseMarkdown(text), [text])

  return (
    <div className="text-[15px] leading-relaxed text-[var(--text-primary)]">
      {blocks.map((block, i) => renderBlock(block, i))}

      {/* Copy full message */}
      {onCopy && (
        <button
          onClick={() => onCopy(text)}
          className="mt-3 text-[11px] text-[var(--text-secondary)] bg-none border-none cursor-pointer p-0 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1.5 font-medium"
        >
          <Clipboard size={12} />
          Sao chép câu trả lời
        </button>
      )}
    </div>
  )
}
