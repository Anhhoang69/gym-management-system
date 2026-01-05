import ContactHero from '../components/contact_page/ContactHero';
import ContactSection from '../components/contact_page/ContactSection';
import ContactMap from '../components/contact_page/ContactMap';
import CTASection from '../components/CTASection';

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
      <ContactMap />
      <CTASection
        title="Bạn cần PT chuyên nghiệp?"
        description="Tham khảo đội ngũ Huấn luyện viên của EnerGym tại đây: "
        buttonText="Huấn luyện viên"
        buttonLink="/pt"
      />
    </>
  );
}
