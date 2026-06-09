import ContactSection from '../components/contact_page/ContactSection';
import ContactMap from '../components/contact_page/ContactMap';
import CTASection from '../components/CTASection';
import { useLanguage } from '../../../shared/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      {/* HEADER */}
      <section className="bg-[var(--bg)] pt-16 pb-10">
        <div className="text-center mx-auto mb-6 px-4">
          <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase">
            {t('contactPage.title')}
          </h2>
          <p style={{ color: 'var(--text-primary)' }} className="block text-lg md:text-xl italic w-[85%] mx-auto">
            {t('contactPage.subtitle')}
          </p>
        </div>
      </section>

      <ContactSection />
      <ContactMap />
      
      <CTASection
        title={t('cta.ptTitle')}
        description={t('cta.ptDesc')}
        buttonText={t('cta.ptBtn')}
        buttonLink="/trainers"
      />
    </div>
  );
}

