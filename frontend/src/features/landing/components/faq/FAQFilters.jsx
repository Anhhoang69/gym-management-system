const filters = [
  'Tất cả',
  'Gói tập & Thanh toán',
  'Cơ sở vật chất',
  'Huấn luyện viên & Lớp học',
  'Quy định & An toàn',
];

export default function FAQFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className="rounded-lg px-6 py-2.5 font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: activeFilter === filter ? 'var(--brand)' : 'transparent',
              color: activeFilter === filter ? 'var(--on-brand)' : 'var(--text-primary)',
              border: `2px solid ${activeFilter === filter ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
