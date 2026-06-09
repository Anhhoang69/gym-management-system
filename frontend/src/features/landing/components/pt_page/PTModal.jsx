import { useLanguage } from "../../../../shared/contexts/LanguageContext";

export default function PTModal({ pt, onClose }) {
  const { t } = useLanguage();

  const specialtyMap = {
    "Giảm mỡ, tăng cơ": t('ptPage.specialties.lossGain'),
    "Giảm mỡ": t('ptPage.specialties.fatLoss'),
    "Tăng cơ, thể hình": t('ptPage.specialties.gainBodybuilding'),
    "Giảm mỡ, phục hồi thể lực": t('ptPage.specialties.lossRecovery'),
    "Tăng cơ, sức mạnh": t('ptPage.specialties.gainStrength'),
    "Thể hình, sức mạnh": t('ptPage.specialties.bodybuildingStrength'),
    "Giảm mỡ, fitness nữ": t('ptPage.specialties.lossFemaleFitness'),
    "Tăng cơ, bodybuilding": t('ptPage.specialties.gainBodybuildingShort'),
    "Sức mạnh, powerlifting": t('ptPage.specialties.strengthPowerlifting'),
    "Fitness, giảm mỡ": t('ptPage.specialties.fitnessLoss'),
    "Thể lực tổng quát": t('ptPage.specialties.generalFitness'),
    "Fitness nữ, giảm mỡ": t('ptPage.specialties.femaleFitnessLoss')
  };

  const translatedSpecialty = specialtyMap[pt.specialty] || pt.specialty;
  const years = parseInt(pt.experience) || 0;
  const translatedExperience = t('ptPage.experienceValue', { years });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* BACKDROP with Glassmorphism */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-[var(--surface)] shadow-2xl overflow-hidden animate-[fade-in-up_0.3s_ease-out]">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-xl text-white backdrop-blur-md transition-colors hover:bg-[var(--brand)] hover:text-black"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* IMAGE SIDE */}
          <div className="relative h-64 md:h-full">
            <img
              src={pt.image}
              alt={pt.name}
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlay for Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--surface)]"></div>
          </div>

          {/* CONTENT SIDE */}
          <div className="flex flex-col justify-center p-8 md:p-12 bg-[var(--surface)]">

            <div className="inline-block rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand)] mb-4 w-max border border-[var(--brand)]/20">
              {t('ptPage.modalBadge')}
            </div>

            <h3 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
              {pt.name}
            </h3>

            <div className="w-12 h-1 bg-[var(--brand)] rounded-full mb-6"></div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] mr-4 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </span>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">{t('ptPage.specialtyLabel')}</p>
                  <p className="text-base text-[var(--text-primary)] font-semibold">{translatedSpecialty}</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] mr-4 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">{t('ptPage.experienceLabel')}</p>
                  <p className="text-base text-[var(--text-primary)] font-semibold">{translatedExperience}</p>
                </div>
              </div>
            </div>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8 border-l-4 border-[var(--border)] pl-4">
              {t('ptPage.modalQuote')}
            </p>

            <button
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--brand)] px-6 py-4 font-bold text-black transition-transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(255,193,7,0.5)]"
            >
              <span className="absolute inset-0 h-full w-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
              {t('ptPage.registerWithPT')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

