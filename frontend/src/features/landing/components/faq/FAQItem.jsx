import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQItem({ category, question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-third)',
        border: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors"
        style={{
          backgroundColor: isOpen ? 'var(--hover)' : 'transparent',
        }}
      >
        <div className="flex-1">
          <div
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {category}
          </div>
          <h3
            className="text-base font-semibold md:text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            {question}
          </h3>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
