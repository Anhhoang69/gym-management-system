import { useState, useEffect } from 'react';
import PackageCard from '../home_page/PackageCard';
import RegisterModal from '../RegisterModal';
import { getPublicPackages } from '../../services/publicService';
import { getMyProfile } from '../../services/memberService';
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

const packageTranslations = {
  // Features
  "Sử dụng toàn bộ khu vực tập gym": "Full access to the gym area",
  "Tủ đồ và phòng tắm": "Lockers and shower facilities",
  "Trang thiết bị tập gym hiện đại": "Modern gym equipment",
  "Check-in không giới hạn trong tuần": "Unlimited weekly check-ins",
  "Tất cả tính năng gói Basic": "All Basic package features",
  "4 buổi PT cá nhân mỗi tháng": "4 private PT sessions per month",
  "4 buổi lớp học nhóm mỗi tháng": "4 group class sessions per month",
  "Kế hoạch dinh dưỡng cơ bản": "Basic nutrition plan",
  "Check-in đa chi nhánh": "Multi-branch check-in",
  "Tất cả tính năng gói Premium": "All Premium package features",
  "12 buổi PT cá nhân mỗi tháng": "12 private PT sessions per month",
  "12 buổi lớp học nhóm mỗi tháng": "12 group class sessions per month",
  "Kế hoạch dinh dưỡng chuyên sâu": "Advanced nutrition plan",
  "Phòng tắm VIP riêng tư": "Private VIP shower room",
  "Ưu tiên đặt lịch lớp học": "Priority class booking",
  "Tư vấn sức khỏe định kỳ hàng tháng": "Monthly health consultation",
  "Sử dụng toàn bộ khu vực gym trong 7 ngày": "Full gym access for 7 days",
  "Tối đa 3 lần check-in mỗi tuần": "Up to 3 check-ins per week",
  "Tư vấn PT miễn phí 1 buổi": "1 free PT consultation session",
  
  // Descriptions
  "Gói cơ bản – Tiếp cận toàn bộ khu vực tập gym với đầy đủ trang thiết bị hiện đại. Phù hợp cho những ai mới bắt đầu hành trình rèn luyện sức khỏe.": "Basic package – Access to the full gym area with modern equipment. Perfect for beginners starting their fitness journey.",
  "Gói nâng cao – Bao gồm buổi tập cùng huấn luyện viên cá nhân (PT). Lý tưởng cho những ai muốn có lộ trình tập luyện khoa học và cá nhân hóa.": "Advanced package – Includes personal trainer (PT) sessions. Ideal for those who want a structured, personalized workout plan.",
  "Gói cao cấp – Tập luyện không giới hạn với đặc quyền VIP. Sở hữu nhiều buổi PT nhất, ưu tiên đặt lịch lớp học và hưởng toàn bộ tiện ích cao cấp.": "Premium package – Unlimited training with VIP privileges. Includes the most PT sessions, priority class booking, and premium amenities.",
  "Gói dùng thử 7 ngày – Trải nghiệm miễn phí toàn bộ cơ sở vật chất trong 1 tuần. Không cần cam kết dài hạn, phù hợp cho khách hàng mới muốn tìm hiểu.": "7-day trial package – Free experience of all facilities for 1 week. No long-term commitment required, perfect for new customers."
};

export default function PricingSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [activeContractPackage, setActiveContractPackage] = useState(null);
  const defaultImages = [pkg1, pkg2, pkg3];
  const { locale, t } = useLanguage();

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
          {t('packages.title')}
        </h2>
        <p style={{ color: 'var(--text-primary)' }} className="block text-base md:text-lg italic --text-primary max-w-5xl mx-auto mt-0">
          {t('packages.subtitle')}
        </p>
      </div>

      <div className="container mx-auto">
        {loading ? (
          <div className="text-center text-[var(--text-secondary)] mt-10">{t('packages.loading')}</div>
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
              const monthlyPrice = pricing ? pricing.price.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US') : t('packages.contact');
              const duration = pricing ? (pricing.durationMonths === 1 ? t('packages.month') : `${pricing.durationMonths} ${t('packages.months')}`) : t('packages.month');
              
              const translateText = (text) => {
                if (!text) return "";
                const trimmed = text.trim();
                if (locale === 'en' && packageTranslations[trimmed]) {
                  return packageTranslations[trimmed];
                }
                return text;
              };

              const translatedDescription = translateText(pkg.description);
              const translatedFeatures = pkg.features?.map(f => ({
                label: translateText(f),
                available: true
              })) || [];

              return (
                <PackageCard 
                  key={pkg.packageId} 
                  image={defaultImages[index % defaultImages.length]}
                  title={pkg.name}
                  price={monthlyPrice}
                  period={duration}
                  description={translatedDescription}
                  features={translatedFeatures}
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

