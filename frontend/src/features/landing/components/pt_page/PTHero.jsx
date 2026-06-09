import pkg3 from "../../../../assets/package-3.webp";
import { useLanguage } from "../../../../shared/contexts/LanguageContext";

export default function PTHero() {
    const { t } = useLanguage();

    return (
        <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] overflow-hidden flex items-center justify-center">
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={pkg3}
                    alt="PT Hero"
                    className="h-full w-full object-cover scale-105 transform animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
                />
            </div>

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[var(--bg)]" />

            {/* Content Container */}
            <div className="relative z-10 px-6 text-center w-full max-w-5xl mx-auto flex flex-col items-center">

                {/* Small Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                        {t('ptPage.badge')}
                    </span>
                </div>

                <h1 className="font-extrabold uppercase tracking-tight flex flex-col items-center">
                    <span className="block text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
                        {t('ptPage.titlePart1')}
                    </span>

                    <span className="mt-2 block text-5xl md:text-7xl lg:text-8xl italic bg-gradient-to-r from-[#ffc107] to-[#ff9800] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,193,7,0.4)] pb-2">
                        {t('ptPage.titlePart2')}
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base md:text-lg text-gray-300 font-medium drop-shadow-md">
                    {t('ptPage.subtitle')}
                </p>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        </section>
    );
}

