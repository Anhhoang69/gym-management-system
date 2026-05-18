import { useState } from 'react';
import FAQSearch from '../components/faq/FAQSearch';
import FAQFilters from '../components/faq/FAQFilters';
import FAQList from '../components/faq/FAQList';
import FAQContact from '../components/faq/FAQContact';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  return (
    <div
      className="min-h-screen transition-colors duration-300 pb-20"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* HEADER */}
      <section className="bg-[var(--bg)] pt-16 pb-10">
        <div className="text-center mx-auto mb-6 px-4">
          <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase">
            Câu Hỏi Thường Gặp
          </h2>
          <p style={{ color: 'var(--text-primary)' }} className="block text-lg md:text-xl italic w-[85%] mx-auto">
            EnerGym giải đáp mọi thắc mắc của bạn để có trải nghiệm tập luyện tốt nhất.
          </p>
        </div>

        <div className="w-[85%] mx-auto px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full lg:w-1/3">
              <FAQSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="w-full lg:w-2/3">
              <FAQFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
          </div>
        </div>
      </section>

      <FAQList searchQuery={searchQuery} activeFilter={activeFilter} />
      
      <div className="mt-10">
        <FAQContact />
      </div>
    </div>
  );
}
