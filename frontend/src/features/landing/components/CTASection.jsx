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
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-12 sm:py-16 lg:py-20"
      style={{ backgroundImage: `url(${CtaBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`max-w-full sm:max-w-lg lg:max-w-2xl xl:max-w-3xl`}>
          <h3 className="text-2xl font-bold text-yellow-400 sm:text-3xl xl:text-4xl">{title}</h3>

          <p className="mt-4 text-sm leading-relaxed text-gray-200 italic sm:text-base xl:text-lg">
            {description}
          </p>

          <button
            onClick={() => navigate(buttonLink)}
            className="group mt-6 inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 sm:px-7 sm:py-4 sm:text-base"
          >
            {buttonText}
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
