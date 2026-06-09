import ServiceCard from './ServiceCard';
import { FaDumbbell, FaHeartbeat, FaAppleAlt } from 'react-icons/fa';
import heroGym from "../../../../assets/hero-gym.jpeg";
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

export default function HeroSection() {
    const { t } = useLanguage();
    
    return (
        <section
            className="relative min-h-screen lg:h-screen bg-cover bg-center flex flex-col justify-center pt-16 pb-12 md:pt-20 md:pb-16 lg:py-0 overflow-hidden"
            style={{ backgroundImage: `url(${heroGym})` }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center text-white w-full">
                {/* HEADING */}
                <h1 className="font-extrabold uppercase tracking-tight">
                    <span className="block text-3xl md:text-5xl text-gray-200">
                        {t('hero.welcome')}
                    </span>

                    <span className="mt-2 block text-5xl md:text-7xl lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 italic leading-none drop-shadow-lg pb-2">
                        EnerGym
                    </span>
                </h1>

                <p className="block text-lg md:text-2xl mt-6 md:mt-8 text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
                    {t('hero.subtitle')}
                </p>

                {/* cards */}
                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
                    <ServiceCard
                        icon={<FaHeartbeat />}
                        title={t('hero.progress')}
                        description={t('hero.progressDesc')}
                    />
                    <ServiceCard
                        icon={<FaDumbbell />}
                        title={t('hero.training')}
                        description={t('hero.trainingDesc')}
                    />
                    <ServiceCard
                        icon={<FaAppleAlt />}
                        title={t('hero.nutrition')}
                        description={t('hero.nutritionDesc')}
                    />
                </div>
            </div>
        </section>
    );
}

