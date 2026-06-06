import { useState } from 'react';
import { Globe, ChevronDown, Check, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Features', active: true },
    { name: 'Try-On', active: false },
    { name: 'Recycle', active: false },
    { name: 'Pricing', active: false },
    { name: 'About', active: false },
  ];

  return (
    <nav className="flex items-center justify-between bg-[#F4F3F5] px-4 sm:px-6 lg:px-10 py-4 shadow-sm font-sans relative z-50">
      {/* Logo */}
      <div className="flex items-center cursor-pointer">
        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={`#${link.name.toLowerCase()}`}
            className={`relative text-base lg:text-lg font-medium transition-all duration-300 ${
              link.active ? 'text-black' : 'text-gray-600 hover:text-black'
            }`}
          >
            {link.name}
            {link.active && (
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#8ED321] rounded-full"></span>
            )}
          </a>
        ))}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-1 lg:space-x-2 border border-gray-200 rounded-xl px-3 lg:px-4 py-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
            <span className="font-bold text-gray-700 text-sm lg:text-base">{language === 'English' ? 'EN' : 'AR'}</span>
            <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => {setLanguage('English'); setIsLangOpen(false)}}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
              >
                <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                </div>
                {language === 'English' && <Check className="w-4 h-4 text-gray-400" />}
              </button>
              <div className="h-[1px] bg-gray-100 mx-2"></div>
              <button 
                onClick={() => {setLanguage('Arabic'); setIsLangOpen(false)}}
                className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>Arabic</span>
              </button>
            </div>
          )}
        </div>

        {/* Login Button */}
        <button className="px-5 lg:px-8 py-2 lg:py-2.5 border-2 border-[#A6E22E] text-[#A6E22E] font-bold rounded-xl transition-all text-base lg:text-lg shadow-sm">
          Login
        </button>

        {/* Sign-up Button */}
        <button className="px-5 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base lg:text-lg">
          Sign-up
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-200/50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full bg-black/20 md:hidden z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#F4F3F5] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex flex-col px-4 py-6 space-y-2">
          {navLinks.map((link) => (
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
          ))}
        </div>

        <div className="border-t border-gray-200 px-4 pt-4 mt-2">
          {/* Mobile Language Selector */}
          <div className="mb-4">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-700">{language}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                <button
                  onClick={() => {setLanguage('English'); setIsLangOpen(false)}}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                  </div>
                  {language === 'English' && <Check className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="h-[1px] bg-gray-100 mx-2"></div>
                <button
                  onClick={() => {setLanguage('Arabic'); setIsLangOpen(false)}}
                  className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>Arabic</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <button className="w-full px-8 py-3 border-2 border-[#A6E22E] text-[#A6E22E] font-bold rounded-xl transition-all text-lg mb-3">
            Login
          </button>
          <button className="w-full px-8 py-3 bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg">
            Sign-up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;