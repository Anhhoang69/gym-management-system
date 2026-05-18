import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaFire,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';

import {
  getUnreadNotificationsCount,
  getNotifications,
  readNotification,
  readAllNotifications
} from '../services/memberService';

import LogoWhite from '../../../assets/LogoWhiteText.svg';
import LogoBlack from '../../../assets/LogoBlackText.svg';

export default function LandingHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);

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
  const loadUser = () => {
    const stored = localStorage.getItem('user');

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener('loginSuccess', loadUser);

    return () => {
      window.removeEventListener(
        'loginSuccess',
        loadUser
      );
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
          n.id === id
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
      name: 'Trang chủ',
      path: '/'
    },

    {
      name: 'Chi nhánh',
      path: '/branches'
    },

    {
      name: 'Huấn luyện viên',
      path: '/trainers'
    },

    {
      name: 'Gói tập',
      path: '/packages'
    },

    {
      name: 'Lịch tập',
      path: '/classes',
      memberOnly: true
    },

    {
      name: 'Trợ lý AI',
      path: '/ai',
      icon: <FaFire />,
      memberOnly: true
    },

    {
      name: 'FAQ',
      path: '/faqs'
    },

    {
      name: 'Liên hệ',
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
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              transition-colors
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            {isDark ? <FaMoon /> : <FaSun />}
          </button>

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
              Đăng nhập
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
                    text-[var(--text-secondary)]
                    transition-colors
                    hover:bg-black/5
                    hover:text-[var(--brand)]
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
                      top-[115%]
                      z-50
                      w-80
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-xl
                      dark:border-gray-700
                      dark:bg-gray-800
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        px-4
                        py-3
                        dark:border-gray-700
                      "
                    >
                      <h4
                        className="
                          font-semibold
                          text-gray-800
                          dark:text-gray-200
                        "
                      >
                        Thông báo
                      </h4>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleReadAllNotif}
                          className="
                            text-xs
                            text-[var(--brand)]
                            hover:underline
                          "
                        >
                          Đánh dấu đã đọc
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
                            text-gray-500
                          "
                        >
                          Chưa có thông báo nào
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() =>
                              handleReadNotif(
                                n.id,
                                n.isRead
                              )
                            }
                            className={`
                              cursor-pointer
                              border-b
                              border-gray-100
                              p-3
                              transition-colors
                              hover:bg-gray-50
                              dark:border-gray-700
                              dark:hover:bg-gray-700
                              ${n.isRead
                                ? 'opacity-60'
                                : 'bg-blue-50 dark:bg-blue-900/20'
                              }
                            `}
                          >
                            <div
                              className="
                                text-sm
                                font-semibold
                                text-gray-800
                                dark:text-gray-200
                              "
                            >
                              {n.title}
                            </div>

                            <div
                              className="
                                mt-1
                                text-xs
                                text-gray-600
                                dark:text-gray-400
                              "
                            >
                              {n.content}
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
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="
                      h-9
                      w-9
                      rounded-full
                      border
                      border-[var(--border)]
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
                        text-[var(--text-primary)]
                      "
                    >
                      {user.email.split('@')[0]}
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-[11px]
                        uppercase
                        tracking-wide
                        text-[var(--text-secondary)]
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
                      top-[115%]
                      z-50
                      min-w-[220px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      py-2
                      shadow-xl
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
                        py-3
                        text-gray-800
                        transition-colors
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-sm font-medium">
                        Hồ sơ cá nhân
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
                        py-3
                        text-gray-800
                        transition-colors
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-sm font-medium">
                        Lớp của tôi
                      </span>
                    </div>

                    <div className="my-1 border-t border-gray-200"></div>

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
                        py-3
                        text-red-600
                        transition-colors
                        hover:bg-red-50
                      "
                    >
                      <FaSignOutAlt />

                      <span className="text-sm font-medium">
                        Đăng xuất
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
            className="ml-1 xl:hidden"
          >
            <FaBars size={24} />
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