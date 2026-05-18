import { useState, useEffect } from 'react';
import PackageCard from '../home_page/PackageCard';
import { getPublicPackages } from '../../services/publicService';

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

export default function PricingSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultImages = [pkg1, pkg2, pkg3];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPublicPackages();
        setPackages(data || []);
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[var(--bg)] flex flex-col justify-center py-10 lg:py-12">
      {/* HEADER */}
      <div className="text-center mx-auto mb-6 lg:mb-10 px-4">
        <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight mb-3">
          Gói Tập Độc Quyền
        </h2>
        <p style={{ color: 'var(--text-primary)' }} className="block text-lg md:text-xl italic --text-primary max-w-5xl mx-auto">
          EnerGym mang đến các gói tập được thiết kế linh hoạt, phù hợp với nhiều mục tiêu và trình độ khác nhau.
        </p>
      </div>

      <div className="container mx-auto">
        {loading ? (
          <div className="text-center text-[var(--text-secondary)] mt-10">Đang tải gói tập...</div>
        ) : (
          <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6 lg:gap-8
              max-w-7xl
              mx-auto
              px-6
          ">
            {packages.map((pkg, index) => {
              const pricing = pkg.pricings?.find(p => p.durationMonths === 1) || pkg.pricings?.[0];
              const monthlyPrice = pricing ? pricing.price.toLocaleString('vi-VN') : 'Liên hệ';
              const duration = pricing ? (pricing.durationMonths === 1 ? 'tháng' : `${pricing.durationMonths} tháng`) : 'tháng';
              
              return (
                <PackageCard 
                  key={pkg.packageId} 
                  image={defaultImages[index % defaultImages.length]}
                  title={pkg.name}
                  price={monthlyPrice}
                  period={duration}
                  description={pkg.description}
                  features={pkg.features?.map(f => ({ label: f, available: true })) || []}
                  highlight={index === 1 || pkg.tier === 'Premium' || pkg.tier === 'Elite'}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

