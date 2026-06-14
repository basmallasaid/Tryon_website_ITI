import { useState, useEffect, useRef } from "react";
import {
  Globe,
  ChevronDown,
  Check,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Sun,
  Moon,
  Mail,
  CreditCard,
  SquarePen,
} from "lucide-react";
import Button from "./Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ProfilePopup from "../pages/profile/ProfilePopup";
import NotificationWindow from "./NotificationWindow";
import { getNotifications } from "../api/notificationApi";
import PwaInstallButton from "./PwaInstallButton";

const Navbar = ({ onOpenAuth }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isArabic = i18n.language === "ar";
  const profileRef = useRef(null);
  const mobileProfileBtnRef = useRef(null);
  const mobilePopupRef = useRef(null);
  const langRef = useRef(null);

  const getUserFullName = (currentUser) => {
    if (!currentUser) return "";
    const profile = currentUser.profile || currentUser.user?.profile;
    const firstName =
      profile?.first_name ||
      currentUser?.first_name ||
      currentUser?.firstName ||
      currentUser?.user?.firstName;
    const lastName =
      profile?.last_name ||
      currentUser?.last_name ||
      currentUser?.lastName ||
      currentUser?.user?.lastName;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    return (
      fullName ||
      currentUser.name ||
      currentUser.user?.name ||
      currentUser.email ||
      ""
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideDesktop =
        profileRef.current && profileRef.current.contains(e.target);
      const isClickInsideMobileBtn =
        mobileProfileBtnRef.current &&
        mobileProfileBtnRef.current.contains(e.target);
      const isClickInsidePopup =
        mobilePopupRef.current && mobilePopupRef.current.contains(e.target);
      if (
        !isClickInsideDesktop &&
        !isClickInsideMobileBtn &&
        !isClickInsidePopup
      ) {
        setIsProfileOpen(false);
      }

      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    if (isProfileOpen || isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen, isLangOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
    setIsMobileOpen(false);
  };

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.stores"), path: "/stores" },
    { name: t("nav.wardrobe"), path: "/wardrobe" },
    { name: t("nav.pricing"), path: "/pricing" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contactUs"), path: "/contact-us" },
  ];

  const featureItems = [
    { name: t("nav.tryOn"), path: "/tryOn" },
    { name: t("nav.recycle"), path: "/recycle" },
    { name: t("nav.matching"), path: "/matching" },
    { name: t("nav.recommendations"), path: "/recommendations" },
  ];

  const isFeaturesActive = featureItems.some(
    (item) => item.path === location.pathname,
  );

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const data = await getNotifications();
        setUnreadCount(data.unreadCount);
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close all menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsLangOpen(false);
    setIsMobileFeaturesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Helper to close everything cleanly
  const closeAllPopups = () => {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsLangOpen(false);
  };

  return (
    <nav
      className={`flex items-center justify-between bg-[var(--header-footer-bg)] px-20 max-[1300px]:px-14 max-[1150px]:px-10 max-[1100px]:px-8 max-[768px]:px-5 max-[480px]:px-4 py-6 max-[768px]:py-4 relative z-50 ${isArabic ? "rtl" : "ltr"}`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center cursor-pointer transition-transform hover:scale-105 shrink-0"
      >
        <img
          src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
          alt="Logo"
          className="w-[139px] h-10 max-[480px]:w-[110px] max-[480px]:h-8"
        />
      </Link>

      {/* Navigation Links (Desktop) */}
      <div className="hidden min-[1100px]:flex items-center gap-10 max-[1300px]:gap-6">
        {/* Home */}
        <Link
          to="/"
          className={`text-[15px] font-medium transition-all duration-200 inline-block relative group ${
            location.pathname === "/"
              ? "text-brand-secondary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t("nav.home")}
          <span
            className={`absolute -bottom-1 left-0 h-0.5 bg-brand-secondary transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>

        {/* Features Dropdown */}
        <div className="relative group">
          <button
            className={`flex items-center gap-1 text-[15px] font-medium transition-all duration-200 ${
              isFeaturesActive
                ? "text-brand-secondary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t("nav.featuresDropdown")}
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 group-hover:rotate-180 ${isFeaturesActive ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`absolute top-full ${isArabic ? "left-0" : "left-0"} mt-2 w-48 bg-surface-elevated border border-[var(--border)] rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
          >
            {featureItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                  item.path === location.pathname
                    ? "text-brand-secondary bg-[var(--primary-light)]/30"
                    : "text-text-secondary hover:bg-[var(--surface)] hover:text-brand-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Remaining Links */}
        {navLinks.slice(1).map((link) => {
          return link.path ? (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-medium transition-all duration-200 inline-block relative group ${
                link.path === location.pathname
                  ? "text-brand-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-brand-secondary transition-all duration-300 ${link.path === location.pathname ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </Link>
          ) : (
            <a
              key={link.name}
              href={`#${link.name.toLowerCase()}`}
              className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.name}
            </a>
          );
        })}
      </div>

      {/* Desktop Action Buttons & Icons */}
      <div className="hidden min-[1100px]:flex items-center gap-4">
        {/* Utilities Center */}
        <div className="flex items-center bg-[var(--bg-secondary)] p-1 rounded-xl gap-1">
          {user && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-surface-elevated hover:shadow-sm transition-all text-text-secondary hover:text-brand-secondary relative cursor-pointer"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent-pink text-white text-[10px] font-bold rounded-full border-2 border-surface-elevated px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <NotificationWindow
                  isArabic={isArabic}
                  onClose={() => setIsNotifOpen(false)}
                  onUnreadChange={setUnreadCount}
                />
              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-elevated hover:shadow-sm transition-all text-text-secondary hover:text-brand-secondary cursor-pointer"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <PwaInstallButton />

        <div className="h-8 w-px bg-[var(--border)] mx-1" />

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`flex items-center gap-1.5 h-10 border border-[var(--border)] rounded-lg px-3 bg-surface-elevated hover:bg-[var(--bg-secondary)] transition-all cursor-pointer text-sm font-bold ${isDarkMode ? "text-white" : "text-black"}`}
          >
            <Globe className="w-4 h-4" />
            <span>{isArabic ? "AR" : "EN"}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangOpen && (
            <div
              className={`absolute mt-2 w-40 bg-surface-elevated border border-[var(--border)] rounded-lg shadow-xl py-1 z-10 ${isArabic ? "left-0" : "right-0"}`}
            >
              {["en", "ar"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 hover:bg-[var(--bg-secondary)] text-sm font-medium transition-colors cursor-pointer ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  <span>{lang === "en" ? "English" : "العربية"}</span>
                  {((lang === "ar" && isArabic) ||
                    (lang === "en" && !isArabic)) && (
                    <Check size={14} className="text-brand-secondary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auth Group / Profile with Popup */}
        <div className="flex items-center gap-3 ml-2 relative">
          {user ? (
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--bg-secondary)] transition-all border border-[var(--border)] cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-secondary" />
                </div>
                <span className="text-sm font-bold text-text-primary max-w-[100px] truncate">
                  {getUserFullName(user)}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-text-disabled transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Profile Popup Design */}
              {isProfileOpen && (
                <ProfilePopup
                  user={user}
                  logout={logout}
                  isArabic={isArabic}
                  changeLanguage={changeLanguage}
                  onClose={() => setIsProfileOpen(false)}
                  isMobile={false}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth?.("login")}
                className={`h-11 font-bold text-brand-secondary hover:opacity-70 transition-all active:scale-95 ${isArabic ? "px-4" : "w-[90px]"}`}
              >
                {t("nav.login")}
              </button>
              <Button
                variant="signup"
                onClick={() => onOpenAuth?.("signup")}
                className="!h-11 !px-6 !text-sm !font-bold"
              >
                {t("nav.signup")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë */}
      {/*  MOBILE / TABLET SECTION (below 1100px)        */}
      {/* ╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë╬ô├▓├ë */}

      {/* Mobile Top Bar Actions */}
      <div className="min-[1100px]:hidden flex items-center gap-1 max-[480px]:gap-0.5">
        {user ? (
          <>
            {/* Mobile Profile Button */}
            <div
              className="relative"
              ref={!isMobileOpen ? mobileProfileBtnRef : undefined}
            >
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                  setIsMobileOpen(false);
                }}
                className="p-2 rounded-lg text-text-secondary cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-brand-secondary transition-all active:scale-90"
                aria-label="Profile"
              >
                <User size={22} className="max-[380px]:w-5 max-[380px]:h-5" />
              </button>
            </div>

            {/* Mobile Notification Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                  setIsMobileOpen(false);
                }}
                className="p-2 text-text-secondary cursor-pointer relative hover:text-brand-secondary transition-all"
                aria-label="Notifications"
              >
                <Bell size={22} className="max-[380px]:w-5 max-[380px]:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent-pink text-white text-[10px] font-bold rounded-full border-2 border-surface-elevated px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Mobile Logged-out User Icon */
          <button
            onClick={() => onOpenAuth?.("login")}
            className="p-2 rounded-lg text-text-secondary cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-brand-secondary transition-all active:scale-90"
            aria-label="Login"
          >
            <User size={22} className="max-[380px]:w-5 max-[380px]:h-5" />
          </button>
        )}

        {/* Hamburger / Close */}
        <button
          onClick={() => {
            setIsMobileOpen(!isMobileOpen);
            setIsProfileOpen(false);
            setIsNotifOpen(false);
          }}
          className="p-2 rounded-lg bg-[var(--bg-secondary)] text-text-primary transition-all active:scale-90 cursor-pointer"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <X size={24} className="max-[380px]:w-5 max-[380px]:h-5" />
          ) : (
            <Menu size={24} className="max-[380px]:w-5 max-[380px]:h-5" />
          )}
        </button>
      </div>

      {/* ╬ô├╢├ç╬ô├╢├ç Mobile Profile Popup (renders as fixed overlay on small screens) ╬ô├╢├ç╬ô├╢├ç */}
      {isProfileOpen && !isMobileOpen && (
        <div className="absolute inset-0 pointer-events-none min-[1100px]:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[90] pointer-events-auto"
            onClick={() => setIsProfileOpen(false)}
          />
          {/* Popup container ╬ô├ç├╢ centered on mobile */}
          <div
            ref={mobilePopupRef}
            className={`fixed z-[100] pointer-events-auto max-[640px]:inset-x-4 max-[640px]:top-20 min-[641px]:absolute min-[641px]:top-full min-[641px]:mt-2 ${isArabic ? "min-[641px]:left-0" : "min-[641px]:right-4"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProfilePopup
              user={user}
              logout={logout}
              isArabic={isArabic}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleTheme}
              changeLanguage={changeLanguage}
              onClose={() => setIsProfileOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* ╬ô├╢├ç╬ô├╢├ç Mobile Notification Window (renders as fixed overlay on small screens) ╬ô├╢├ç╬ô├╢├ç */}
      {isNotifOpen && (
        <div className="absolute inset-0 pointer-events-none min-[1100px]:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[90] pointer-events-auto"
            onClick={() => setIsNotifOpen(false)}
          />
          {/* Notification container */}
          <div
            className={`fixed z-[100] pointer-events-auto max-[640px]:inset-x-3 max-[640px]:top-16 min-[641px]:absolute min-[641px]:top-full min-[641px]:mt-2 ${isArabic ? "min-[641px]:left-0" : "min-[641px]:right-4"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationWindow
              isArabic={isArabic}
              onClose={() => setIsNotifOpen(false)}
              onUnreadChange={setUnreadCount}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* ╬ô├╢├ç╬ô├╢├ç Mobile Drawer Overlay ╬ô├╢├ç╬ô├╢├ç */}
      <div
        className={`fixed inset-0 bg-overlay backdrop-blur-sm z-40 min-[1100px]:hidden transition-opacity duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />

      {/* ╬ô├╢├ç╬ô├╢├ç Mobile Drawer Panel ╬ô├╢├ç╬ô├╢├ç */}
      <div
        className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-[280px] max-w-[85vw] bg-surface-elevated shadow-2xl z-50 transform transition-transform duration-300 ease-in-out min-[1100px]:hidden flex flex-col ${
          isMobileOpen
            ? "translate-x-0"
            : isArabic
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)] shrink-0">
          <Link to="/" onClick={() => setIsMobileOpen(false)}>
            <img
              src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Logo"
              className="h-7 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-full bg-[var(--bg-secondary)] text-text-secondary transition-all hover:bg-[var(--surface)] cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Navigation Links (Scrollable) */}
        <div className="flex flex-col px-3 py-4 space-y-0.5 flex-1 overflow-y-auto overscroll-contain">
          {/* Home */}
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className={`px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
              location.pathname === "/"
                ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                : "text-text-secondary hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {t("nav.home")}
          </Link>

          {/* Features Collapsible */}
          <div>
            <button
              onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                isFeaturesActive
                  ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                  : "text-text-secondary hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <span>{t("nav.featuresDropdown")}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileFeaturesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isMobileFeaturesOpen
                  ? "max-h-60 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`mt-1 space-y-0.5 border-[var(--border)] ${isArabic ? "mr-4 border-r-2 pr-1" : "ml-4 border-l-2 pl-1"}`}
              >
                {featureItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      item.path === location.pathname
                        ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                        : "text-text-secondary hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Remaining Links */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.name}
              to={link.path || "#"}
              onClick={() => setIsMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                link.path === location.pathname
                  ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                  : "text-text-secondary hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Favorites Link */}
          <Link
            to="/favorites"
            onClick={() => setIsMobileOpen(false)}
            className={`px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
              location.pathname === "/favorites"
                ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                : "text-text-secondary hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {t("nav.favorites")}
          </Link>

          {/* Edit Profile Link (auth only) */}
          {user && (
            <Link
              to="/editprofile"
              onClick={() => setIsMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                location.pathname === "/editprofile"
                  ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20"
                  : "text-text-secondary hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                {t("profile.editProfile")}
              </div>
            </Link>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex gap-2 mb-4">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-xl bg-surface-elevated text-sm font-bold text-text-primary cursor-pointer"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}{" "}
              {isDarkMode ? t("nav.light") : t("nav.dark")}
            </button>
            <button
              onClick={() => changeLanguage(isArabic ? "en" : "ar")}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-xl bg-surface-elevated text-sm font-bold text-text-primary cursor-pointer"
            >
              <Globe size={18} /> {isArabic ? "العربية" : "EN"}
            </button>
          </div>

          <div className="mb-4">
            <PwaInstallButton />
          </div>

          {user ? (
            <div className="space-y-3">
              <div
                onClick={() => {
                  setIsMobileOpen(false);
                  navigate("/editprofile");
                }}
                className="flex items-center gap-3 p-3 bg-surface-elevated rounded-xl border border-[var(--border)]"
              >
                <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold">
                  {getUserFullName(user).charAt(0)}
                </div>
                <span className="font-bold text-text-primary text-sm truncate">
                  {getUserFullName(user)}
                </span>
              </div>
              <button
                onClick={logout}
                className="w-full py-3 bg-[var(--accent-light)] text-accent-pink rounded-xl font-bold flex items-center justify-center gap-2 active:brightness-90 transition-colors cursor-pointer"
              >
                <LogOut size={18} /> {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  onOpenAuth?.("login");
                }}
                className="w-full py-3 border-2 border-brand-secondary text-brand-secondary rounded-xl font-bold hover:bg-brand-secondary/5 transition-colors cursor-pointer"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  onOpenAuth?.("signup");
                }}
                className="w-full py-3 bg-gradient-to-r from-brand-secondary to-[#AAE338] text-white rounded-xl font-bold shadow-lg shadow-brand-secondary/20 active:scale-[0.98] transition-transform cursor-pointer"
              >
                {t("nav.signup")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
