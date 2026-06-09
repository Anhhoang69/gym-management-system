import { Search } from 'lucide-react';
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

export default function FAQSearch({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-w-[280px]">
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--brand)] focus-within:border-transparent"
        style={{ backgroundColor: 'var(--bg-third)', borderColor: 'var(--border)' }}
      >
        <Search className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder={t('faqPage.searchPlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none border-none p-0 focus:ring-0 min-w-0"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>
    </div>
  );
}
