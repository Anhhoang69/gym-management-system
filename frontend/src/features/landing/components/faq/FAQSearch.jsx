import { Search } from 'lucide-react';

export default function FAQSearch({ value, onChange }) {
  return (
    <div className="relative z-10 mx-auto -mt-8 max-w-2xl px-4">
      <div
        className="flex items-center gap-3 rounded-2xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl"
        style={{ backgroundColor: 'var(--bg-third)', borderColor: 'var(--border)' }}
      >
        <Search className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-base outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          className="flex-shrink-0 rounded-lg px-6 py-2 font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--brand)',
            color: 'var(--on-brand)',
          }}
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
