import PricingSection from '../components/package/PricingSection';
import ComparisonTable from '../components/package/ComparisonTable';
import RegisterCTA from '../components/RegisterCTA';

export default function PackagePage() {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <PricingSection />
      <ComparisonTable />
      <RegisterCTA />
    </div>
  );
}
