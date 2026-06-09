import { FaArrowRight } from 'react-icons/fa';
import Runner from "../../../../assets/runner.webp";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

export default function IntroSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen lg:h-screen bg-[var(--bg)] overflow-hidden flex items-center py-16 lg:py-0">
      <div className="relative mx-auto max-w-7xl px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-0">

          {/* LEFT */}
          <div className="relative z-10">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-yellow-500 uppercase mb-4 border-l-4 border-yellow-500 pl-3">
              {t('intro.who')}
            </span>

            <h2
              className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('intro.titlePart1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
                {t('intro.titlePart2')}
              </span>
            </h2>

            <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl font-light">
              {t('intro.description')}
            </p>

            <div className="mt-12 flex">
              <button
                onClick={() => navigate("/branches")}
                className="group mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,193,7,0.6)]"
              >
                <span>{t('intro.exploreBtn')}</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT IMAGE */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-[42vw]">
        <img
          src={Runner}
          alt="EnerGym runner"
          className="h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--bg)]" />
      </div>
    </section>
  );
}

