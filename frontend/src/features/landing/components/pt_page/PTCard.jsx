import { useLanguage } from "../../../../shared/contexts/LanguageContext";

export default function PTCard({
  image,
  name,
  specialty,
  experience,
  onClick,
}) {
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

  const translatedSpecialty = specialtyMap[specialty] || specialty;
  const years = parseInt(experience) || 0;
  const translatedExperience = t('ptPage.experienceValue', { years });

  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-xl
        bg-[var(--surface)]
        shadow-md
        overflow-hidden
        transition
        hover:-translate-y-1
        hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15),0_8px_10px_-6px_rgba(0,0,0,0.10)]
      "
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={name}
        className="h-60 w-full object-cover"
      />

      {/* CONTENT */}
      <div className="px-4 py-4 text-center">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {name}
        </h3>

        <p className="mt-1 text-base font-medium text-[var(--brand)]">
          {t('ptPage.specialtyLabel')}: {translatedSpecialty}
        </p>

        <p className="mt-1 text-base text-[var(--text-secondary)]">
          {t('ptPage.experienceLabel')}: {translatedExperience}
        </p>
      </div>
    </div>
  );
}

