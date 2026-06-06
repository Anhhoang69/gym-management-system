import { useState, useEffect } from 'react';
import PackageCard from '../home_page/PackageCard';
import RegisterModal from '../RegisterModal';
import { getPublicPackages } from '../../services/publicService';
import { getMyProfile } from '../../services/memberService';

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

export default function PricingSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [activeContractPackage, setActiveContractPackage] = useState(null);
  const defaultImages = [pkg1, pkg2, pkg3];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pkgs = await getPublicPackages();
        setPackages(pkgs || []);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const meData = await getMyProfile();
            if (meData?.memberInfo?.activeContract?.status === "Active") {
              setActiveContractPackage(meData.memberInfo.activeContract.packageName);
            }
          } catch (profileErr) {
            console.error("Failed to fetch user profile in pricing", profileErr);
          }
        }
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegisterClick = (packageId) => {
    setSelectedPackageId(packageId);
    setRegisterModalVisible(true);
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[var(--bg)] flex flex-col justify-start pt-6 lg:pt-10 pb-10 lg:pb-12">
      {/* HEADER */}
      <div className="text-center mx-auto mb-4 lg:mb-6 px-4">
        <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight mb-1">
          Gói Tập Độc Quyền
        </h2>
        <p style={{ color: 'var(--text-primary)' }} className="block text-base md:text-lg italic --text-primary max-w-5xl mx-auto mt-0">
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
              lg:grid-cols-4
              gap-4 lg:gap-6
              max-w-[1400px]
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
                  isCurrentPackage={activeContractPackage === pkg.name}
                  onRegister={() => handleRegisterClick(pkg.packageId)}
                />
              );
            })}
          </div>
        )}
      </div>

      <RegisterModal 
        visible={registerModalVisible} 
        setVisible={setRegisterModalVisible} 
        initialPackageId={selectedPackageId} 
      />
    </section>
  );
}

