import { FaRobot, FaClipboardList, FaChevronRight } from 'react-icons/fa';

const tryExtractJSON = (text) => {
  if (typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[1]); } catch(err) {}
    }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        const potentialJson = text.substring(start, end + 1);
        try { return JSON.parse(potentialJson); } catch (err) {}
    }
  }
  return null;
};

export default function ChatMessage({ role, message, type, parsed, onViewPlan }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-6">
        <div className="max-w-[75%] px-5 py-3.5 rounded-2xl rounded-tr-sm bg-[var(--brand)] text-black shadow-sm font-medium text-[15px] leading-relaxed">
          {message}
        </div>
      </div>
    );
  }

  let displayParsed = parsed;
  let isJsonDetected = type === "json" || !!parsed;
  let displayText = message;

  if (!isJsonDetected && typeof message === 'string') {
    const extracted = tryExtractJSON(message);
    if (extracted) {
      isJsonDetected = true;
      displayParsed = extracted;
      displayText = message
        .replace(/```(?:json)?\n[\s\S]*?\n```/g, '')
        .replace(/\{[\s\S]*"WorkoutPlan"[\s\S]*\}/g, '')
        .trim();
    }
  }

  return (
    <div className="flex gap-4 w-full mb-6">
      {/* AI AVATAR */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--brand)] shadow-lg shadow-yellow-500/20 text-black mt-1">
        <FaRobot size={16} />
      </div>

      {/* AI CONTENT */}
      <div className="flex-1 max-w-[85%] text-[15px] leading-relaxed text-[var(--text-primary)] pt-1">
        {!isJsonDetected && displayText && (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap mb-4">
            {displayText}
          </div>
        )}
        
        {isJsonDetected && displayParsed && (
          <div className="mt-2 p-5 rounded-2xl border shadow-sm max-w-sm transition-all hover:shadow-md group"
            style={{ backgroundColor: 'var(--bg-third)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover)', color: 'var(--brand)' }}>
                <FaClipboardList size={20} />
              </div>
              <div>
                <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Kế hoạch đã sẵn sàng</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Được tạo bởi EnerGym AI</p>
              </div>
            </div>
            <button
              onClick={() => onViewPlan && onViewPlan(displayParsed)}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand)] hover:brightness-95 text-black font-semibold text-sm transition-all flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <span>Xem chi tiết kế hoạch</span>
              <FaChevronRight size={12} className="text-black/70" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}