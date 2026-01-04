import ContactInfoCard from "./ContactInfoCard";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="bg-[var(--bg)] py-20">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            EnerGym luôn sẵn sàng <br /> hỗ trợ bạn!
          </h2>

          <p className="mt-4 text-[var(--text-secondary)] max-w-md">
            Hãy để lại thông tin, đội ngũ EnerGym sẽ liên hệ tư vấn chi tiết
            về chương trình tập luyện, lịch học và các gói hội viên phù hợp nhất với bạn.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactInfoCard
              title="Địa chỉ"
              content="Số 62, đường Trần Thị Lý, Phường 2, Quận Tân Bình, TP.HCM"
            />
            <ContactInfoCard
              title="Giờ mở cửa"
              content="Thứ Hai – Chủ Nhật <br /> 05:30 – 22:30"
            />
            <ContactInfoCard
              title="Thông tin liên hệ"
              content="0337 809 545 <br /> energym.info@gmail.com"
            />
            <ContactInfoCard
              title="Theo dõi EnerGym"
              content="Facebook · Instagram · Zalo"
            />
          </div>
        </div>

        {/* RIGHT */}
        <ContactForm />
      </div>
    </section>
  );
}
