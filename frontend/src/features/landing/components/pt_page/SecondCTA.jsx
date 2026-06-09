import { useLanguage } from "../../../../shared/contexts/LanguageContext";

export default function PtPackageCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[var(--brand)] py-14">

      {/* WAVES – BACKGROUND LAYER */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Wave 1 */}
        <path
          d="M1440 30C1200 70 980 150 740 180C500 210 300 160 0 140"
          stroke="black"
          strokeOpacity="0.18"
          strokeWidth="5"
        />

        {/* Wave 2 */}
        <path
          d="M1440 90C1180 140 960 220 720 250C480 280 260 230 0 200"
          stroke="black"
          strokeOpacity="0.14"
          strokeWidth="4"
        />

        {/* Wave 3 */}
        <path
          d="M1440 150C1200 210 940 290 700 320C460 350 240 300 0 260"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="3"
        />

        {/* Wave 4 */}
        <path
          d="M1440 0C1220 40 1000 110 760 140C520 170 320 120 0 100"
          stroke="black"
          strokeOpacity="0.08"
          strokeWidth="2"
        />
      </svg>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">

          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-black/70">
              {t('ptPage.explorePlan')}
            </p>

            <h3 className="text-2xl font-bold leading-snug text-black md:text-3xl">
              {t('ptPage.findPackage')}
            </h3>
          </div>

          {/* RIGHT ACTION */}
          <div className="shrink-0">
            <a
              href="/packages"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-black
                px-7
                py-3.5
                text-base
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              {t('ptPage.explorePackagesBtn')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

