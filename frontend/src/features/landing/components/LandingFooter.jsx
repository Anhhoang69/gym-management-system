import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingFooter() {
  const socialMediaLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: <FaLinkedin /> },
    { name: 'Github', url: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram /> },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  ];

  return (
    <footer className="bg-(--bg-secondary) px-6 py-12 text-(--text-primary) shadow-inner">
      <div className="container mx-auto grid w-full gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={LogoWhite}
                alt="Energym Logo Dark"
                className="hidden h-14 w-auto in-[.dark]:block"
              />
              <img
                src={LogoBlack}
                alt="Energym Logo Light"
                className="block h-14 w-auto in-[.dark]:hidden"
              />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-(--text-secondary)">
              EnerGym mang đến không gian tập luyện chuyên nghiệp, hệ thống thiết bị hiện đại cùng đội ngũ chuyên gia tận tâm, đồng hành cùng bạn trên hành trình chinh phục sức khoẻ.
            </p>
          </div>

          {/* Social */}
          <ul className="flex gap-4">
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

          {/* Copyright */}
          <div className="text-sm leading-relaxed text-(--text-secondary)">
            <p>Bản quyền © {new Date().getFullYear()} thuộc về EnerGym.</p>
            <p className="mt-1">
              Hệ thống quản lý phòng tập chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* CLASSES */}
        <div className="space-y-4">
            <h4 className="relative pb-2 text-xl font-semibold">
            Dịch vụ nổi bật
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4">
            {[
              'Gym / Thể hình',
              'Yoga & Thiền',
              'Zumba / Dance',
              'Kickboxing',
              'Huấn luyện viên cá nhân (PT)',
            ].map((item) => (
              <li key={item}>
                <Link className="block font-medium text-(--text-secondary) transition-all duration-300 hover:translate-x-2 hover:text-(--brand)">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* HOURS */}
        <div className="space-y-4">
          <h4 className="relative pb-2 text-xl font-semibold">
            Giờ hoạt động
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4 text-(--text-secondary)">
            <li>
              <span className="font-semibold text-(--text-primary)">Thứ 2 - Thứ 6:</span> 05:00 - 22:00
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">Thứ 7 - Chủ Nhật:</span> 06:00 - 21:00
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">Ngày Lễ:</span> Cập nhật trên Fanpage
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
