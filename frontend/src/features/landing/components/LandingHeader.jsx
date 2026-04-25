import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon, FaFire } from 'react-icons/fa';
import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 👉 LOAD USER
  const loadUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("loginSuccess", loadUser);

    return () => {
      window.removeEventListener("loginSuccess", loadUser);
    };
  }, []);

  // 👉 CLICK OUTSIDE CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Chi nhánh', path: '/branches' },
    { name: 'Huấn luyện viên', path: '/pt' },
    { name: 'Gói tập', path: '/packages' },
    { name: 'Trợ lý AI', path: '/ai', icon: <FaFire /> },
    { name: 'FAQ', path: '/faqs' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-(--border) bg-(--surface) px-8 py-3 text-(--text-primary)">

        {/* Logo */}
        <Link to="/">
          <img src={LogoWhite} className="hidden h-10 in-[.dark]:block" />
          <img src={LogoBlack} className="block h-10 in-[.dark]:hidden" />
        </Link>

        {/* MENU */}
        <ul className="
          absolute top-1/2 left-1/2 
          hidden lg:flex
          -translate-x-1/2 -translate-y-1/2 
          gap-6
          text-base
          font-medium
          whitespace-nowrap
        ">
          {menuItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors"
                  style={isActive ? { color: 'var(--brand)' } : {}}
                >
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    {item.icon && <span className="text-[var(--brand)]">{item.icon}</span>}
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Theme */}
          <button onClick={toggleTheme}>
            {isDark ? <FaMoon /> : <FaSun />}
          </button>

          {/* 👉 NOT LOGIN */}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="hidden lg:block bg-(--brand) px-4 py-2 rounded-md text-white"
            >
              Đăng nhập
            </button>
          )}

          {/* 👉 LOGIN SUCCESS */}
          {user && (
            <div className="relative flex items-center gap-2 user-menu">

              {/* Avatar */}
              <div
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold cursor-pointer"
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {/* Email */}
              <span
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="hidden lg:block cursor-pointer"
              >
                {user.email}
              </span>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-md rounded-md w-40 z-50">

                  <div
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </div>

                  <div
                    onClick={() => {
                      navigate("/my-bookings");
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Bookings
                  </div>

                  <div
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-red-100 text-red-500 cursor-pointer"
                  >
                    Logout
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Mobile */}
          <button onClick={() => setIsNavOpen(true)} className="lg:hidden">
            <FaBars size={26} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-50 ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsNavOpen(false)}>
          <FaTimes size={32} />
        </button>
      </div>
    </>
  );
}