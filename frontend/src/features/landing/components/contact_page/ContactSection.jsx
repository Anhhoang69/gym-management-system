import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import ContactInfoCard from "./ContactInfoCard";
import ContactForm from "./ContactForm";
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const socialMediaLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: <FaLinkedin /> },
    { name: 'Github', url: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram /> },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  ];

  return (
    <section className="bg-[var(--bg)] py-12">
      <div className="mx-auto w-[85%] px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: t('contactPage.alwaysReady') }} />

          <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('contactPage.alwaysReadyDesc')}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ContactInfoCard
              title={t('contactPage.address')}
              content={t('contactPage.addressDetail')}
            />

            <ContactInfoCard
              title={t('contactPage.hours')}
              content={t('contactPage.hoursDetail')}
            />

            <ContactInfoCard
              title={t('contactPage.contactInfo')}
              content="0337 809 545\nenergym.info@gmail.com"
            />

            <ContactInfoCard
              title={t('contactPage.follow')}
              content={
                <ul className="flex flex-wrap gap-3 mt-2">
                  {socialMediaLinks.map(({ name, url, icon }) => (
                    <li key={name}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--bg-third)', 
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)' 
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--brand)';
                          e.currentTarget.style.color = 'var(--on-brand)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-third)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        {icon}
                      </a>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
