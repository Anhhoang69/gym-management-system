import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';
import { useLanguage } from '../../../shared/contexts/LanguageContext';

export default function LandingFooter() {
  const { t } = useLanguage();

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
              {t('footer.description')}
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
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <p className="mt-1">
              {t('footer.subtext')}
            </p>
          </div>
        </div>

        {/* CLASSES */}
        <div className="space-y-4">
            <h4 className="relative pb-2 text-xl font-semibold">
            {t('footer.highlightServices')}
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4">
            {[
              t('footer.servicesList.gym'),
              t('footer.servicesList.yoga'),
              t('footer.servicesList.zumba'),
              t('footer.servicesList.kickboxing'),
              t('footer.servicesList.pt'),
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
            {t('footer.operatingHours')}
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4 text-(--text-secondary)">
            <li>
              <span className="font-semibold text-(--text-primary)">{t('footer.monFri')}</span> 05:00 - 22:00
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">{t('footer.satSun')}</span> 06:00 - 21:00
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">{t('footer.holidays')}</span> {t('footer.holidaysDetail')}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
