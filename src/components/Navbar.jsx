import { useState, useEffect } from "react";
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
  Heart,
  SquarePen,
} from "lucide-react";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import ProfilePopup from "../pages/profile/ProfilePopup";
import NotificationWindow from "./NotificationWindow";
import { getNotifications } from "../api/notificationApi";

const Navbar = ({ onOpenAuth }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isNotifOpen, setIsNotifOpen] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0);

  const isArabic = i18n.language === "ar";

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

  return fullName || currentUser.name || currentUser.user?.name || t("nav.user");
};
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
    setIsMobileOpen(false);
  };

  const navLinks = [
    { name: t("nav.features"), path: "/" },
    { name: t("nav.tryOn"), path: "/tryOn" },
    { name: t("nav.recycle"), path: "/recycle" },
    { name: t("nav.stores"), path: "/stores" },
    { name: t("nav.pricing"), path: "/pricing" },
    { name: t("nav.about") },
    { name: t("nav.contactUs"), path: "/contact-us" },
  ];

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

  return (
    <nav
      className={`flex items-center justify-between bg-bg-secondary px-20 max-[1300px]:px-14 max-[1150px]:px-10 max-[1100px]:px-8 py-6 relative z-50 ${isArabic ? "rtl" : "ltr"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center cursor-pointer transition-transform hover:scale-105">
        <img src="/logo.svg" alt="Logo" className="w-[139px] h-10" />
      </Link>

      {/* Navigation Links (Desktop) */}
      <div className="hidden min-[1100px]:flex items-center gap-10 max-[1300px]:gap-6">
        {navLinks.map((link) => {
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
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-secondary transition-all duration-300 ${link.path === location.pathname ? 'w-full' : 'w-0 group-hover:w-full'}`} />
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
        <div className="flex items-center bg-gray-100/50 p-1 rounded-xl gap-1">
          {user && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-brand-secondary relative cursor-pointer"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1">
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
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-brand-secondary cursor-pointer"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1" />

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 h-10 border border-gray-200 rounded-lg px-3 bg-white hover:bg-gray-50 transition-all cursor-pointer text-sm font-bold text-gray-600"
          >
            <Globe className="w-4 h-4" />
            <span>{isArabic ? "AR" : "EN"}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangOpen && (
            <div className={`absolute mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-10 ${isArabic ? "left-0" : "right-0"}`}>
              {["en", "ar"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>{lang === "en" ? "English" : "العربية"}</span>
                  {((lang === "ar" && isArabic) || (lang === "en" && !isArabic)) && <Check size={14} className="text-brand-secondary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auth Group / Profile with Popup */}
        <div className="flex items-center gap-3 ml-2 relative">
          {user ? (
            <div className="relative">
              <div 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all border border-gray-100 cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                   <User className="w-4 h-4 text-brand-secondary" />
                </div>
                <span className="text-sm font-bold text-gray-700 max-w-[100px] truncate">
                  {getUserFullName(user)}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Popup Design */}
              {isProfileOpen && (
              <ProfilePopup
                user={user}
                logout={logout}
                isArabic={isArabic}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                changeLanguage={changeLanguage}
                onClose={() => setIsProfileOpen(false)}
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

      {/* Mobile Menu Button */}
      <div className="min-[1100px]:hidden flex items-center gap-3">
        {user && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsNotifOpen(!isNotifOpen);
                setIsMobileOpen(false);
              }}
              className="p-2 text-gray-500 cursor-pointer relative"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1">
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
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-gray-100 text-gray-700 transition-all active:scale-90 cursor-pointer"
        >
          {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 min-[1100px]:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <div
        className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out min-[1100px]:hidden ${
          isMobileOpen ? "translate-x-0" : isArabic ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-full bg-gray-50 text-gray-500 transition-all hover:bg-gray-100 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path || "#"}
              onClick={() => setIsMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-bold transition-all ${
                link.path === location.pathname ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 cursor-pointer">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? "Light" : "Dark"}
            </button>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 cursor-pointer">
              <Globe size={18} /> {isArabic ? "العربية" : "EN"}
            </button>
          </div>

          {user ? (
            <div className="space-y-3">
               <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold">{getUserFullName(user).charAt(0)}</div>
                  <span className="font-bold text-gray-700 text-sm truncate">{getUserFullName(user)}</span>
               </div>
               <button onClick={logout} className="w-full py-3.5 bg-rose-50 text-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-rose-100 transition-colors cursor-pointer">
                 <LogOut size={18} /> {t("nav.logout")}
               </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={() => onOpenAuth?.("login")} className="w-full py-3 border-2 border-brand-secondary text-brand-secondary rounded-xl font-bold">{t("nav.login")}</button>
              <button onClick={() => onOpenAuth?.("signup")} className="w-full py-3 bg-gradient-to-r from-brand-secondary to-[#AAE338] text-white rounded-xl font-bold shadow-lg shadow-brand-secondary/20">{t("nav.signup")}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;