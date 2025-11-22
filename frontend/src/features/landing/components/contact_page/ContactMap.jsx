import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import LogoSVG from '../../../assets/LogoWhiteText.svg';

export default function LandingHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Về chúng tôi', path: '/about' },
    { name: 'Chi nhánh', path: '/branches' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-black px-8 py-5 shadow-lg">
        <Link to="/" className="z-50">
          <img src={LogoSVG} alt="Energym Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform gap-8 text-lg font-medium text-white lg:flex">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="text-white hover:text-[var(--color-yellow)]"
                style={location.pathname === item.path ? { color: 'var(--color-yellow)' } : {}}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Button */}
        <button className="text-white lg:hidden" onClick={() => setIsNavOpen(true)}>
          <FaBars size={28} />
        </button>
      </nav>

      {/* MOBILE NAV */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black transition-all duration-300 ${
          isNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-6 text-2xl font-semibold">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setIsNavOpen(false)}
                className="text-black hover:text-[var(--color-yellow)]"
                style={location.pathname === item.path ? { color: 'var(--color-yellow)' } : {}}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={() => setIsNavOpen(false)} className="absolute top-8 right-8">
          <FaTimes size={32} />
        </button>
      </div>
    </>
  );
}
