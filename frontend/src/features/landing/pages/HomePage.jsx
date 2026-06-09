import HeroSection from '../components/home_page/HeroSection';
import IntroSection from '../components/home_page/IntroSection';
import PackageSection from '../components/home_page/PackageSection';
import CTASection from '../components/CTASection';
import { useLanguage } from '../../../shared/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <HeroSection />
      <IntroSection />
      <PackageSection />
      <CTASection
        title={t('cta.ptTitle')}
        description={t('cta.ptDesc')}
        buttonText={t('cta.ptBtn')}
        buttonLink="/trainers"
      />
    </>
  );
}

