import ContactSection from '../components/contact_page/ContactSection';
import ContactMap from '../components/contact_page/ContactMap';
import CTASection from '../components/CTASection';

export default function ContactPage() {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg)' }}>
      {/* HEADER */}
      <section className="bg-[var(--bg)] pt-16 pb-10">
        <div className="text-center mx-auto mb-6 px-4">
          <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p style={{ color: 'var(--text-primary)' }} className="block text-lg md:text-xl italic w-[85%] mx-auto">
            EnerGym luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình chinh phục sức khỏe.
          </p>
        </div>
      </section>

      <ContactSection />
      <ContactMap />
      
      <CTASection
        title="Bạn cần PT chuyên nghiệp?"
        description="Tham khảo đội ngũ Huấn luyện viên của EnerGym tại đây: "
        buttonText="Huấn luyện viên"
        buttonLink="/pt"
      />
    </div>
  );
}
