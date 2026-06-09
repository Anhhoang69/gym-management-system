import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../shared/contexts/LanguageContext';

import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaFire,
  FaBell,
  FaSignOutAlt,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa';

import {
  getUnreadNotificationsCount,
  getNotifications,
  readNotification,
  readAllNotifications
} from '../../../shared/services/notificationService';
import { getMyProfile } from '../services/memberService';

import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingHeader() {
  const { locale, changeLanguage, t } = useLanguage();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const [user, setUser] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();

  // SCROLL TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // LOAD USER
  const loadUser = async () => {
    const stored = localStorage.getItem('user');

    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      // Background sync profile details
      try {
        const freshProfile = await getMyProfile();
        if (freshProfile) {
          const updated = {
            ...parsed,
            fullName: freshProfile.fullName || freshProfile.email?.split('@')[0],
            avatarUrl: freshProfile.avatarUrl
          };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      } catch (e) {
        console.error("Failed to sync member profile details in header", e);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener('loginSuccess', loadUser);
    window.addEventListener('userProfileUpdated', loadUser);

    return () => {
      window.removeEventListener('loginSuccess', loadUser);
      window.removeEventListener('userProfileUpdated', loadUser);
    };
  }, []);

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setIsDropdownOpen(false);
      }

      if (!e.target.closest('.notif-menu')) {
        setIsNotifOpen(false);
      }

      if (!e.target.closest('.lang-menu')) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener(
      'click',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'click',
        handleClickOutside
      );
    };
  }, []);

  // FETCH NOTIFICATIONS
  useEffect(() => {
    if (user) {
      getUnreadNotificationsCount()
        .then(setUnreadCount)
        .catch(() => { });
    }
  }, [user]);

  const handleOpenNotif = async () => {
    setIsNotifOpen(!isNotifOpen);

    setIsDropdownOpen(false);

    if (!isNotifOpen && notifications.length === 0) {
      try {
        const data = await getNotifications({
          page: 1,
          pageSize: 10
        });

        if (data?.items) {
          setNotifications(data.items);
        }
      } catch (e) { }
    }
  };

  const handleReadNotif = async (id, isRead) => {
    if (isRead) return;

    try {
      await readNotification(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id
            ? { ...n, isRead: true }
            : n
        )
      );

      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );
    } catch (e) { }
  };

  const handleReadAllNotif = async () => {
    try {
      await readAllNotifications();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true
        }))
      );

      setUnreadCount(0);
    } catch (e) { }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');

    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.clear();

    setUser(null);

    navigate('/');
  };

  const allMenuItems = [
    {
      name: t('nav.home'),
      path: '/'
    },

    {
      name: t('nav.branches'),
      path: '/branches'
    },

    {
      name: t('nav.trainers'),
      path: '/trainers'
    },

    {
      name: t('nav.packages'),
      path: '/packages'
    },

    {
      name: t('nav.classes'),
      path: '/classes',
      memberOnly: true
    },

    {
      name: t('nav.aiAssistant'),
      path: '/ai',
      icon: <FaFire />,
      memberOnly: true
    },

    {
      name: t('nav.faq'),
      path: '/faqs'
    },

    {
      name: t('nav.contact'),
      path: '/contact'
    }
  ];


  const menuItems = allMenuItems.filter((item) => {
    if (item.memberOnly) {
      if (!user) return false;

      const isMember =
        user.roles &&
        (
          user.roles.includes('MEMBER') ||
          user.roles.includes('ROLE_MEMBER') ||
          user.roles.includes('member')
        );

      return isMember || !user.roles;
    }

    return true;
  });

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          fixed
          top-0
          left-0
          z-50
          flex
          h-[70px]
          w-full
          items-center
          justify-between
          border-b
          border-(--border)
          bg-(--bg-secondary)
          px-6
          xl:px-8
          text-(--text-primary)
          backdrop-blur-md
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
        >
          <img
            src={LogoWhite}
            className="hidden h-9 in-[.dark]:block"
            alt="EnerGym"
          />

          <img
            src={LogoBlack}
            className="block h-9 in-[.dark]:hidden"
            alt="EnerGym"
          />
        </Link>

        {/* DESKTOP MENU */}
        <ul
          className="
            hidden
            xl:flex
            flex-1
            items-center
            justify-center
            gap-6
            2xl:gap-8
            text-base
            2xl:text-[17px]
            font-medium
            whitespace-nowrap
            m-0
            p-0
            list-none
          "
        >
          {menuItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li
                key={item.path}
                className="
                  flex
                  items-center
                  m-0
                  p-0
                "
              >
                <Link
                  to={item.path}
                  className={`
                    flex
                    items-center
                    leading-none
                    transition-colors
                    duration-200
                    ${isActive
                      ? '!text-[var(--brand)] font-bold'
                      : 'text-[var(--text-primary)] hover:!text-[var(--brand)]'
                    }
                  `}
                >
                  <span className="flex items-center gap-1.5">
                    {item.icon && (
                      <span className="text-[var(--brand)]">
                        {item.icon}
                      </span>
                    )}

                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-(--text-secondary)
              hover:text-(--brand)
              hover:bg-black/5
              dark:hover:bg-white/10
              transition-colors
              duration-200
            "
          >
            {isDark ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>

          {/* LANGUAGE SELECT DROPDOWN */}
          <div className="relative lang-menu mr-1 shrink-0">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="
                flex
                h-10
                w-[90px]
                items-center
                justify-between
                rounded-none
                border
                border-(--border)
                bg-black/5
                dark:bg-white/5
                px-2.5
                text-xs
                font-bold
                text-(--text-secondary)
                hover:text-(--brand)
                hover:border-(--brand)
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <span className="flex items-center gap-1">
                <span>{locale === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                <span>{locale === 'vi' ? 'VI' : 'EN'}</span>
              </span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangDropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-0
                  w-[90px]
                  origin-top-right
                  rounded-none
                  border
                  border-(--border)
                  bg-(--surface)
                  overflow-hidden
                  shadow-xl
                  z-50
                  animate-[fade-in-up_0.2s_ease-out]
                "
              >
                <button
                  onClick={() => {
                    changeLanguage('vi');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    py-2
                    text-xs
                    font-bold
                    transition-colors
                    cursor-pointer
                    ${locale === 'vi'
                      ? 'bg-(--brand) text-black font-bold'
                      : 'text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <span>🇻🇳</span> VI
                </button>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    py-2
                    text-xs
                    font-bold
                    transition-colors
                    cursor-pointer
                    ${locale === 'en'
                      ? 'bg-(--brand) text-black font-bold'
                      : 'text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <span>🇺🇸</span> EN
                </button>
              </div>
            )}
          </div>


          {/* NOT LOGIN */}
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-yellow-500
                to-yellow-400
                px-5
                text-sm
                font-bold
                text-black
                shadow-[0_0_20px_rgba(255,193,7,0.35)]
                transition-all
                hover:scale-105
              "
            >
              {t('nav.login')}
            </button>
          )}

          {/* LOGIN SUCCESS */}
          {user && (
            <div className="flex items-center gap-3">

              {/* NOTIFICATION */}
              <div className="relative flex items-center notif-menu">

                <button
                  onClick={handleOpenNotif}
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    text-(--text-secondary)
                    transition-colors
                    duration-200
                    hover:bg-black/5
                    hover:text-(--brand)
                    dark:hover:bg-white/10
                  "
                >
                  <FaBell size={18} />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        top-1
                        right-1
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      z-50
                      w-80
                      overflow-hidden
                      rounded-2xl
                      border
                      border-(--border)
                      bg-(--surface)
                      shadow-xl
                      animate-[fade-in-up_0.2s_ease-out]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-(--border)
                        px-4
                        py-3
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-bold
                          text-(--text-primary)
                        "
                      >
                        {t('nav.notifications')}
                      </span>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleReadAllNotif}
                          className="
                            text-xs
                            font-semibold
                            text-(--brand)
                            hover:underline
                          "
                        >
                          {t('nav.markAllRead')}
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div
                          className="
                            p-4
                            text-center
                            text-sm
                            text-(--text-secondary)
                          "
                        >
                          {t('nav.noNotifications')}
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.notificationId}
                            onClick={() =>
                              handleReadNotif(
                                n.notificationId,
                                n.isRead
                              )
                            }
                            className={`
                              cursor-pointer
                              border-b
                              border-(--border)
                              p-3
                              transition-colors
                              hover:bg-black/5
                              dark:hover:bg-white/10
                              ${n.isRead
                                ? 'opacity-60 bg-transparent'
                                : 'bg-(--brand)/5 dark:bg-(--brand)/10'
                              }
                            `}
                          >
                            <div
                              className="
                                text-xs
                                font-semibold
                                text-(--text-primary)
                              "
                            >
                              {n.title}
                            </div>

                            <div
                              className="
                                mt-1
                                text-[11px]
                                text-(--text-secondary)
                              "
                            >
                              {n.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* USER */}
              <div className="relative flex items-center user-menu">

                <div
                  onClick={() => {
                    setIsDropdownOpen((prev) => !prev);

                    setIsNotifOpen(false);
                  }}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    px-2
                    py-1
                    transition-colors
                    hover:bg-black/5
                    dark:hover:bg-white/10
                  "
                >
                  <img
                    src={user.avatarUrl || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="
                      h-9
                      w-9
                      rounded-full
                      border
                      border-(--border)
                      object-cover
                    "
                  />

                  <div
                    className="
                      hidden
                      lg:block
                      text-left
                      leading-tight
                    "
                  >
                    <div
                      className="
                        max-w-[120px]
                        truncate
                        text-sm
                        font-semibold
                        text-(--text-primary)
                      "
                    >
                      {user.fullName || user.email.split('@')[0]}
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-[11px]
                        uppercase
                        tracking-wide
                        text-(--text-secondary)
                      "
                    >
                      {user.roles?.[0] || 'Member'}
                    </div>
                  </div>
                </div>

                {/* DROPDOWN */}
                {isDropdownOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      z-50
                      w-44
                      overflow-hidden
                      rounded-2xl
                      border
                      border-(--border)
                      bg-(--surface)
                      py-1.5
                      shadow-xl
                      animate-[fade-in-up_0.2s_ease-out]
                    "
                  >
                    <div
                      onClick={() => {
                        navigate('/profile');

                        setIsDropdownOpen(false);
                      }}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        px-4
                        py-2
                        text-(--text-primary)
                        transition-colors
                        hover:bg-black/5
                        dark:hover:bg-white/10
                      "
                    >
                      <FaUser className="text-(--text-secondary)" size={13} />
                      <span className="text-xs font-semibold">
                        {t('nav.profile')}
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        navigate('/my-bookings');

                        setIsDropdownOpen(false);
                      }}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        px-4
                        py-2
                        text-(--text-primary)
                        transition-colors
                        hover:bg-black/5
                        dark:hover:bg-white/10
                      "
                    >
                      <FaCalendarAlt className="text-(--text-secondary)" size={13} />
                      <span className="text-xs font-semibold">
                        {t('nav.myBookings')}
                      </span>
                    </div>

                    <div className="my-1 border-t border-(--border)"></div>

                    <div
                      onClick={() => {
                        handleLogout();

                        setIsDropdownOpen(false);
                      }}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        px-4
                        py-2
                        text-red-500
                        transition-colors
                        hover:bg-red-500/10
                        dark:hover:bg-red-950/20
                      "
                    >
                      <FaSignOutAlt size={13} />

                      <span className="text-xs font-semibold">
                        {t('nav.logout')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsNavOpen(true)}
            className="
              ml-1
              xl:hidden
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-(--text-secondary)
              hover:text-(--brand)
              hover:bg-black/5
              dark:hover:bg-white/10
              transition-colors
              duration-200
            "
          >
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed
          inset-0
          z-50
          flex
          flex-col
          bg-[var(--bg)]
          text-[var(--text-primary)]
          transition-transform
          duration-300
          ${isNavOpen
            ? 'translate-x-0'
            : 'translate-x-full'
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--border)]
            bg-[var(--bg-secondary)]
            p-4
          "
        >
          <Link
            to="/"
            onClick={() => setIsNavOpen(false)}
          >
            <img
              src={LogoWhite}
              className="hidden h-8 in-[.dark]:block"
              alt="EnerGym"
            />

            <img
              src={LogoBlack}
              className="block h-8 in-[.dark]:hidden"
              alt="EnerGym"
            />
          </Link>

          <button
            onClick={() => setIsNavOpen(false)}
            className="p-2"
          >
            <FaTimes size={28} />
          </button>
        </div>

        <ul className="flex flex-col gap-6 overflow-y-auto p-6">
          {menuItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsNavOpen(false)}
                  className={`
                    flex
                    items-center
                    gap-3
                    text-lg
                    transition-colors
                    ${isActive
                      ? '!text-[var(--brand)] font-bold'
                      : 'text-[var(--text-primary)] hover:!text-[var(--brand)]'
                    }
                  `}
                >
                  {item.icon && (
                    <span className="text-[var(--brand)]">
                      {item.icon}
                    </span>
                  )}

                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}