import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CtaBg from '../../../assets/cta-pt.webp';

export default function CTASection({
  title = 'Đăng ký tập thử miễn phí ngay hôm nay!',
  description = 'Để lại thông tin liên hệ, đội ngũ Energym sẽ tư vấn lịch tập phù hợp nhất dành riêng cho bạn.',
  buttonText = 'Đăng ký ngay',
  buttonLink = '/contact',
}) {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-6 lg:py-8"
      style={{ backgroundImage: `url(${CtaBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <h3
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold"
          style={{ color: 'var(--brand)' }}
        >
          {title}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-200 font-light">
          {description}
        </p>

        <button
          onClick={() => navigate(buttonLink)}
          className="group mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,193,7,0.6)]"
        >
          {buttonText}
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
