import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQItem({ category, question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-third)',
        border: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <h3
          className="text-base md:text-[18px] font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {question}
        </h3>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--brand)' }}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pt-2 pb-5">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
