import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import ContactInfoCard from "./ContactInfoCard";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  const socialMediaLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: <FaLinkedin /> },
    { name: 'Github', url: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram /> },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  ];

  return (
    <section className="bg-[var(--bg)] py-20">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            EnerGym luôn sẵn sàng <br /> hỗ trợ bạn!
          </h2>

          <p className="mt-4 text-[var(--text-secondary)] ">
            Hãy để lại thông tin, đội ngũ EnerGym sẽ liên hệ tư vấn chi tiết
            về chương trình tập luyện, lịch học và các gói hội viên phù hợp nhất với bạn.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <ContactInfoCard
              title="Địa chỉ"
              content={
                <>
                  Số 62, đường Trần Thị Lý,
                  <br />
                  Phường 2, Quận Tân Bình, TP.HCM
                </>
              }
            />

            <ContactInfoCard
              title="Giờ mở cửa"
              content={
                <>
                  Thứ Hai – Chủ Nhật
                  <br />
                  05:30 – 22:30
                </>
              }
            />

            <ContactInfoCard
              title="Thông tin liên hệ"
              content={
                <>
                  0337 809 545
                  <br />
                  energym.info@gmail.com
                </>
              }
            />

            <ContactInfoCard
              title="Theo dõi EnerGym"
              content={
                <ul className="mt-5 text-center flex gap-4">
                  {socialMediaLinks.map(({ name, url, icon }) => (
                    <li key={name}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-(--surface) text-(--text-secondary) ring-1 ring-(--border) transition-all duration-300 hover:bg-(--brand) hover:text-(--on-brand)"
                      >
                        {icon}
                      </a>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>

        {/* RIGHT */}
        <ContactForm />
      </div>
    </section>
  );
}
