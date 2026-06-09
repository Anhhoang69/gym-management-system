import { useLanguage } from '../../../../shared/contexts/LanguageContext';

const filters = [
  'Tất cả',
  'Gói tập & Thanh toán',
  'Cơ sở vật chất',
  'Huấn luyện viên & Lớp học',
  'Quy định & An toàn',
];

const filterKeys = {
  'Tất cả': 'faqPage.filters.all',
  'Gói tập & Thanh toán': 'faqPage.filters.pricing',
  'Cơ sở vật chất': 'faqPage.filters.facilities',
  'Huấn luyện viên & Lớp học': 'faqPage.filters.trainers',
  'Quy định & An toàn': 'faqPage.filters.rules',
};

export default function FAQFilters({ activeFilter, onFilterChange }) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <div className="flex flex-nowrap md:flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"
            style={{
              backgroundColor: activeFilter === filter ? 'var(--brand)' : 'var(--bg-secondary)',
              color: activeFilter === filter ? 'var(--on-brand)' : 'var(--text-secondary)',
              border: `1px solid ${activeFilter === filter ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            {t(filterKeys[filter] || filter)}
          </button>
        ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
