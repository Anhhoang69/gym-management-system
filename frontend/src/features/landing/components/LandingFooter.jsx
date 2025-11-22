import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa6';
import LogoSVG from '../../../assets/LogoWhiteText.svg';

export default function LandingFooter() {
  const socialMediaLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: <FaLinkedin /> },
    { name: 'Github', url: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram /> },
    { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF /> },
  ];

  return (
    <footer className="bg-black px-6 py-32 text-white shadow-2xl">
      <div className="container mx-auto grid w-full gap-20 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* --- LEFT SECTION --- */}
        <div className="space-y-10">
          <div className="space-y-4">
            <Link to="/" className="block">
              <img src={LogoSVG} alt="Energym Logo" className="h-16 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Take your health and body to the next level with our comprehensive program designed to
              help you reach your fitness goals.
            </p>
          </div>

          <ul className="flex gap-3">
            {socialMediaLinks.map(({ name, url, icon }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800 text-gray-300 transition-all duration-300 hover:bg-[#fedd21] hover:text-black"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>

          <div className="text-sm leading-relaxed text-gray-400">
            <p>
              All Rights Reserved | &copy; <span>{new Date().getFullYear()}</span> Energym
            </p>
            <p className="mt-1">
              Designed by{' '}
              <Link
                to="https://sharjeel-siddiqui.vercel.app"
                target="_blank"
                className="text-[#fedd21] hover:underline"
              >
                ....
              </Link>
            </p>
          </div>
        </div>

        {/* --- CLASSES SECTION --- */}
        <div className="space-y-5">
          <h4 className="relative pb-2 text-xl font-semibold before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-[#fedd21]">
            Our classes
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
                <Link className="font-medium text-gray-400 transition-all duration-300 hover:ml-2 hover:text-[#fedd21]">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- HOURS SECTION --- */}
        <div className="space-y-5">
          <h4 className="relative pb-2 text-xl font-semibold before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-[#fedd21]">
            Working hours
          </h4>

          <ul className="space-y-4 font-medium text-gray-400">
            <li>
              <span className="font-semibold text-white">Monday – Friday: </span>9:00 am - 10 pm
            </li>
            <li>
              <span className="font-semibold text-white">Saturday: </span>10:00 am - 12:00 am
            </li>
            <li>
              <span className="font-semibold text-white">Sunday: </span>Closed
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
