import { useState } from 'react';
import FAQHero from '../components/faq/FAQHero';
import FAQSearch from '../components/faq/FAQSearch';
import FAQFilters from '../components/faq/FAQFilters';
import FAQList from '../components/faq/FAQList';
import FAQContact from '../components/faq/FAQContact';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <FAQHero />
      <FAQSearch value={searchQuery} onChange={setSearchQuery} />
      <FAQFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <FAQList searchQuery={searchQuery} activeFilter={activeFilter} />
      <FAQContact />
    </div>
  );
}
