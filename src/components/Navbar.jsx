import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const Navbar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const navLinks = [
    { name: 'Features', active: true },
    { name: 'Try-On', active: false },
    { name: 'Recycle', active: false },
    { name: 'Pricing', active: false },
    { name: 'About', active: false },
  ];

  return (
    <nav className="flex items-center justify-between bg-[#F4F3F5] px-10 py-4 shadow-sm font-sans relative z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer">
        
       <img src="/logo.svg" alt="Logo" className="h-full w-full mask-cover" />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-10">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={`#${link.name.toLowerCase()}`}
            className={`relative text-lg font-medium transition-all duration-300 ${
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

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-2 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Globe className="w-5 h-5 text-gray-700" />
            <span className="font-bold text-gray-700">{language === 'English' ? 'EN' : 'AR'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
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
        <button className="px-8 py-2.5 border-2 border-[#A6E22E] text-[#A6E22E] font-bold rounded-xl transition-all text-lg shadow-sm">
          Login
        </button>

        {/* Sign-up Button */}
        <button className="px-8 py-3 bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg">
          Sign-up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;