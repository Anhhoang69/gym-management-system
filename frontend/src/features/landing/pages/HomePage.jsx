import HeroSection from '../components/home_page/HeroSection';
import IntroSection from '../components/home_page/IntroSection';
import PackageSection from '../components/home_page/PackageSection';
import CTASection from '../components/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <PackageSection />
      <CTASection
        title="Bạn cần PT chuyên nghiệp?"
        description="Tham khảo đội ngũ Huấn luyện viên của EnerGym tại đây: "
        buttonText="Huấn luyện viên"
        buttonLink="/trainers"
      />
    </>
  );
}
