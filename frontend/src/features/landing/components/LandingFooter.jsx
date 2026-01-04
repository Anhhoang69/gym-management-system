import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingFooter() {
  const socialMediaLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: <FaLinkedin /> },
    { name: 'Github', url: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram /> },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  ];

  return (
    <footer className="bg-(--bg-secondary) px-6 py-28 text-(--text-primary) shadow-inner">
      <div className="container mx-auto grid w-full gap-20 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={LogoWhite}
                alt="Energym Logo Dark"
                className="hidden h-20 w-auto in-[.dark]:block"
              />
              <img
                src={LogoBlack}
                alt="Energym Logo Light"
                className="block h-20 w-auto in-[.dark]:hidden"
              />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-(--text-secondary)">
              Take your health and body to the next level with our comprehensive program designed to
              help you reach your fitness goals.
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
            <p>All Rights Reserved © {new Date().getFullYear()} Energym</p>
            <p className="mt-1">
              Designed by{' '}
              <Link
                to="https://sharjeel-siddiqui.vercel.app"
                target="_blank"
                className="font-medium text-(--brand) hover:underline"
              >
                ....
              </Link>
            </p>
          </div>
        </div>

        {/* CLASSES */}
        <div className="space-y-6">
          <h4 className="relative pb-2 text-xl font-semibold">
            Our classes
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4">
            {[
              'Fitness classes',
              'Aerobics classes',
              'Meditation classes',
              'Lean machines',
              'Full-body strength',
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
        <div className="space-y-6">
          <h4 className="relative pb-2 text-xl font-semibold">
            Working hours
            <span className="absolute bottom-0 left-0 h-1 w-16 bg-(--brand)" />
          </h4>

          <ul className="space-y-4 text-(--text-secondary)">
            <li>
              <span className="font-semibold text-(--text-primary)">Monday – Friday:</span> 9:00 am
              - 10 pm
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">Saturday:</span> 10:00 am -
              12:00 am
            </li>
            <li>
              <span className="font-semibold text-(--text-primary)">Sunday:</span> Closed
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
