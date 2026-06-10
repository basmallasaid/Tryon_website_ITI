import { useState } from "react";
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
} from "lucide-react";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onOpenAuth }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // حالة الوضع الليلي
  const isArabic = i18n.language === "ar";

  const getUserFullName = (currentUser) => {
    if (!currentUser) return "";
    const profile = currentUser.profile || currentUser.user?.profile;
    const firstName = profile?.first_name;
    const lastName = profile?.last_name;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    return fullName || currentUser.name || currentUser.user?.name || "";
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
  ];

  return (
    <nav
      className={`flex items-center justify-between bg-bg-secondary px-20 max-[1300px]:px-14 max-[1150px]:px-10 max-[1100px]:px-8 py-6 relative z-50 ${isArabic ? "rtl" : "ltr"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img src="/logo.svg" alt="Logo" className="w-[139px] h-10" />
      </Link>

      {/* Navigation Links (Desktop) */}
      <div className="hidden min-[1100px]:flex items-center gap-10 max-[1300px]:gap-6">
        {navLinks.map((link) => {
          return link.path ? (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-normal transition-colors duration-200 inline-block ${
                link.path === location.pathname
                  ? "text-text-primary border-b-2 border-brand-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.name}
            </Link>
          ) : (
            <a
              key={link.name}
              href={`#${link.name.toLowerCase()}`}
              className={`text-[15px] font-normal transition-colors duration-200 inline-block ${
                link.path === location.pathname
                  ? "text-text-primary border-b-2 border-brand-secondary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.name}
            </a>
          );
        })}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden min-[1100px]:flex items-center justify-between gap-4 max-[1300px]:gap-2">
        {/* Notification & Theme Toggle Group */}
        <div className="flex items-center gap-3 mr-2">
          {/* Notification Button - يظهر فقط عند تسجيل الدخول */}
          {user && (
            <button className="p-2.5 rounded-lg border border-border-strong bg-surface-elevated hover:bg-gray-50 transition-all cursor-pointer text-gray-600 hover:text-brand-secondary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          )}

          {/* Theme Toggle Button - متاح دائماً */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-lg border border-border-strong bg-surface-elevated hover:bg-gray-50 transition-all cursor-pointer text-gray-600 hover:text-brand-secondary"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 h-12 border border-border-strong rounded-lg px-4 bg-surface-elevated hover:bg-gray-50 transition-all cursor-pointer hover:scale-105"
          >
            <Globe className="w-4 h-4 text-gray-700" />
            <span className="font-semibold text-gray-700 text-sm">
              {isArabic ? "العربية" : "EN"}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangOpen && (
            <div
              className={`absolute mt-2 w-44 bg-surface-elevated border border-gray-100 rounded-lg shadow-2xl py-2 z-10 ${isArabic ? "left-0" : "right-0"}`}
            >
              <button
                onClick={() => changeLanguage("en")}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
                {!isArabic && <Check className="w-4 h-4 text-gray-400" />}
              </button>
              <div className="h-px bg-gray-100 mx-2" />
              <button
                onClick={() => changeLanguage("ar")}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>العربية</span>
                </div>
                {isArabic && <Check className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Login + Signup group OR User Profile */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-100">
                <User className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm font-bold text-gray-700">
                  {getUserFullName(user) || "User"}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-[#FF8A3D] font-bold text-sm hover:text-[#ffa35c] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth?.("login")}
                className={`h-12 rounded-lg border border-brand-secondary text-brand-secondary font-semibold text-base flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${isArabic ? "px-1" : "w-[104px] px-6 py-3"}`}
              >
                {t("nav.login")}
              </button>
              <Button
                variant="signup"
                onClick={() => onOpenAuth?.("signup")}
                className={isArabic ? "px-3" : ""}
              >
                {t("nav.signup")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="min-[1100px]:hidden p-2 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-0 left-0 w-full h-full bg-black/20 min-[1100px]:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-72 bg-bg-secondary shadow-2xl z-50 transform transition-transform duration-300 ease-in-out min-[1100px]:hidden ${
          isMobileOpen
            ? "translate-x-0"
            : isArabic
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <Link to="/" onClick={() => setIsMobileOpen(false)}>
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            {/* أيقونة الإشعارات للموبايل - تظهر فقط عند تسجيل الدخول */}
            {user && (
              <button className="p-2 text-gray-600">
                <Bell size={20} />
              </button>
            )}
            <button onClick={() => setIsMobileOpen(false)} className="p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-col px-4 py-6 space-y-2 mx-2">
          {navLinks.map((link) => {
            return link.path ? (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                  link.path === location.pathname
                    ? "text-white bg-gradient-to-r from-primary to-[#AAE338] shadow-md"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={() => setIsMobileOpen(false)}
                className={`relative text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                  link.path === location.pathname
                    ? "text-white bg-gradient-to-r from-primary to-[#AAE338] shadow-md"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="border-t border-gray-200 px-4 pt-4 mt-2">
          {/* Mobile Theme & Language Toggle Section */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              {isDarkMode ? "Light" : "Dark"}
            </button>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold"
            >
              <Globe size={18} />
              {isArabic ? "العربية" : "EN"}
            </button>
          </div>

          {user && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-gray-50 flex items-center gap-3">
              <User className="w-5 h-5 text-brand-secondary" />
              <span className="font-bold text-gray-700">
                {getUserFullName(user) || "User"}
              </span>
            </div>
          )}

          {/* Mobile Action Buttons */}
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMobileOpen(false);
              }}
              className="w-full px-8 py-3 border-2 border-[#FF8A3D] text-[#FF8A3D] font-bold rounded-xl transition-all text-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onOpenAuth?.("login");
                  setIsMobileOpen(false);
                }}
                className="w-full px-8 py-3 border-2 border-lime text-lime font-bold rounded-xl transition-all text-lg mb-3 cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => {
                  onOpenAuth?.("signup");
                  setIsMobileOpen(false);
                }}
                className="w-full px-8 py-3 bg-gradient-to-r from-primary via-[#69C9AC] to-[#AAE338] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg cursor-pointer hover:scale-[1.02]"
              >
                {t("nav.signup")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
