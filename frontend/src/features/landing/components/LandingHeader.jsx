import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const location = useLocation();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Chi nhánh', path: '/branches' },
    { name: 'Huấn luyện viên', path: '/pt' },
    { name: 'Gói tập', path: '/packages' },
    { name: 'FAQ', path: '/faqs' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <>
      {/* HEADER */}
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-(--border) bg-(--surface) px-8 py-3 text-(--text-primary)">
        {/* Logo */}
        <Link to="/" className="z-50">
          {/* Hiện khi có class dark trên html */}
          <img src={LogoWhite} alt="Logo White" className="hidden h-10 w-auto in-[.dark]:block" />

          {/* Ẩn khi có class dark trên html */}
          <img src={LogoBlack} alt="Logo Black" className="block h-10 w-auto in-[.dark]:hidden" />
        </Link>

        {/* Desktop Menu */}
        <ul className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-8 text-lg font-medium lg:flex">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="hover:text-(--brand)"
                style={location.pathname === item.path ? { color: 'var(--brand)' } : {}}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) bg-(--bg-secondary) text-(--text-primary) transition-all hover:bg-(--brand) hover:text-(--on-brand)"
          >
            {isDark ? (
              <FaMoon size={18} className="rotate-0 transition-transform duration-300" />
            ) : (
              <FaSun size={18} className="rotate-90 transition-transform duration-300" />
            )}
          </button>
          {/* Mobile menu */}
          <button className="text-(--text-primary) lg:hidden" onClick={() => setIsNavOpen(true)}>
            <FaBars size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--bg) text-(--text-primary) transition-transform duration-300 ${
          isNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-6 text-2xl font-semibold">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setIsNavOpen(false)}
                className="hover:text-(--brand)"
                style={location.pathname === item.path ? { color: 'var(--brand)' } : {}}
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
