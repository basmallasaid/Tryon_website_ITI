import { useState } from 'react';
import { Globe, ChevronDown, Check, Menu, X } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenAuth }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Features', active: true },
    { name: 'Try-On', active: false, path: '/tryOn' },
    { name: 'Recycle', active: false, path: '/recycle' },
    { name: 'Pricing', active: false },
    { name: 'About', active: false },
  ];

  return (
    <nav className="flex items-center justify-between bg-[#F4F3F5] px-20 max-[1200px]:px-14 max-[1000px]:px-8 py-6 relative z-50">
      {/* Logo */}
      <div className="flex items-center cursor-pointer">
        <img src="/logo.svg" alt="Logo" className="w-[139px] h-10" />
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden min-[1000px]:flex items-center gap-10 max-[1200px]:gap-6">
        {navLinks.map(link =>
          link.path ? (
            <Link
              key={link.name}
              to={link.path}
              className="text-[15px] font-normal text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.name}
            </Link>
          ) : (
            <a
              key={link.name}
              href={`#${link.name.toLowerCase()}`}
              className={`text-[15px] font-normal transition-colors duration-200 ${
                link.active
                  ? 'text-text-primary border-b-2 border-brand-secondary pb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.name}
            </a>
          ),
        )}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden min-[1000px]:flex items-center justify-between gap-4 max-[1200px]:gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 h-12 border border-[var(--Border-Strong)] rounded-lg px-4 bg-[var(--surface-elevated)] hover:bg-gray-50 transition-all cursor-pointer hover:scale-105"
          >
            <Globe className="w-4 h-4 text-gray-700" />
            <span className="font-semibold text-gray-700 text-sm">
              {language === 'English' ? 'EN' : 'AR'}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[var(--surface-elevated)] border border-gray-100 rounded-lg shadow-2xl py-2 z-10">
              <button
                onClick={() => {
                  setLanguage('English');
                  setIsLangOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
                {language === 'English' && (
                  <Check className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <div className="h-px bg-gray-100 mx-2" />
              <button
                onClick={() => {
                  setLanguage('Arabic');
                  setIsLangOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>Arabic</span>
                </div>
                {language === 'Arabic' && (
                  <Check className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Login + Signup group */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAuth?.('login')}
            className="w-[104px] h-12 rounded-lg px-6 py-3 border border-[var(--Secondary-Brand-color)] text-[var(--Secondary-Brand-color)] font-semibold text-base flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            Login
          </button>
          <Button variant="signup" onClick={() => onOpenAuth?.('signup')}>
            Sign-up
          </Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="min-[1000px]:hidden p-2 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer"
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
          className="fixed inset-0 top-0 left-0 w-full h-full bg-black/20 min-[1000px]:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#F4F3F5] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out min-[1000px]:hidden ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-col px-4 py-6 space-y-2">
          {navLinks.map(link =>
            link.path ? (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className="relative text-lg font-medium py-3 px-4 rounded-xl transition-all text-gray-600 hover:bg-gray-200/50"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={() => setIsMobileOpen(false)}
                className={`relative text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                  link.active
                    ? 'text-white bg-gradient-to-r from-[#40B9FF] to-[#AAE338] shadow-md'
                    : 'text-gray-600 hover:bg-gray-200/50'
                }`}
              >
                {link.name}
              </a>
            ),
          )}
        </div>

        <div className="border-t border-gray-200 px-4 pt-4 mt-2">
          {/* Mobile Language Selector */}
          <div className="mb-4">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-700">{language}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isLangOpen && (
              <div className="mt-1 bg-[var(--surface-elevated)] border border-gray-100 rounded-xl shadow-lg py-2">
                <button
                  onClick={() => {
                    setLanguage('English');
                    setIsLangOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                  </div>
                  {language === 'English' && (
                    <Check className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <button
                  onClick={() => {
                    setLanguage('Arabic');
                    setIsLangOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span>Arabic</span>
                  </div>
                  {language === 'Arabic' && (
                    <Check className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <button
            onClick={() => {
              onOpenAuth?.('login');
              setIsMobileOpen(false);
            }}
            className="w-full px-8 py-3 border-2 border-[var(--Lime-Brand-color)] text-[var(--Lime-Brand-color)] font-bold rounded-xl transition-all text-lg mb-3 cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            Login
          </button>
          <button
            onClick={() => {
              onOpenAuth?.('signup');
              setIsMobileOpen(false);
            }}
            className="w-full px-8 py-3 bg-gradient-to-r from-[var(--Primary-Brand-color)] via-[#69C9AC] to-[#AAE338] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg cursor-pointer hover:scale-[1.02]"
          >
            Sign-up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
