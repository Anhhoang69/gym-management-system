import Hero from '../components/package/Hero';
import PricingSection from '../components/package/PricingSection';
import ComparisonTable from '../components/package/ComparisonTable';
import SpecialOffers from '../components/package/SpecialOffers';
import RegisterCTA from '../components/RegisterCTA';

export default function PackagePage() {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Hero />
      <PricingSection />
      <ComparisonTable />
      <SpecialOffers />
      <RegisterCTA />
    </div>
  );
}
