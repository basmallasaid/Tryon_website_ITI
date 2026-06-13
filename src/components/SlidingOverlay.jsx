import React from "react";
import { useTranslation } from "react-i18next";

export default function SlidingOverlay({ view, onToggle, onForgot, inModal }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const overlayRight = view === "login" || view === "otp" || view === "reset";
  const isOtp = view === "otp";
  const isForgot = view === "forgot";
  const isLogin = view === "login";
  const isReset = view === "reset";
  
  const overlayGradient = "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))";
  return (
    <div 
      className={`absolute top-0 z-20 hidden h-full w-[40%] flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white transition-all duration-700 ease-in-out md:flex rounded-3xl shadow-2xl ${
        isArabic ? 'right-0' : 'left-0'
      } ${
        overlayRight 
          ? (isArabic ? "-translate-x-[150%]" : "translate-x-[150%]") 
          : "translate-x-0"
      }`} 
      style={{ 
          backgroundImage: `${overlayGradient}, url('/login2.jpg')` 
      }}
    >
      <div className={`flex flex-col items-center text-center ${inModal ? 'p-8' : 'p-12'} backdrop-blur-[2px]`}>
        
        {isOtp ? (
          <>
            <div className={`bg-white/20 p-4 rounded-full mb-6 backdrop-blur-md`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h1 className={`font-bold ${inModal ? 'mb-3 text-4xl' : 'mb-4 text-5xl'}`}>
              {t("auth.verifyIdentity")}
            </h1>
            <p className="opacity-90 leading-relaxed text-lg max-w-xs">
              {t("auth.verifyIdentityDesc")}
            </p>
          </>
        ) : isForgot ? (
          <>
            <h1 className="font-bold text-5xl mb-4 leading-tight">
              {t("auth.resetYourPassword")}
            </h1>
            <p className="opacity-80 text-lg mb-10">
              {t("auth.rememberPassword")}
            </p>
            <button 
              onClick={onToggle} 
              className="group relative overflow-hidden rounded-2xl border-2 border-white/70 px-12 py-3 text-xl font-bold transition-all hover:border-white"
            >
              <span className="relative z-10 group-hover:text-sky-600 transition-colors">{t("auth.backToLogin")}</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </>
        ) : isLogin ? (
          <>
            <h1 className="font-extrabold leading-tight mb-4">
              <span className="block text-4xl font-light italic opacity-90">{t("auth.welcome")}</span>
              <span className="block text-6xl tracking-tight">{t("auth.backOverlay")}</span>
            </h1>
            <p className="opacity-80 text-lg mb-12 max-w-xs">
              {t("auth.dontHaveAccount")}
            </p>
            <button 
              onClick={onToggle} 
              className="group relative overflow-hidden rounded-2xl border-2 border-white/70 px-16 py-3 text-xl font-bold transition-all hover:border-white shadow-xl"
            >
              <span className="relative z-10 group-hover:text-sky-600 transition-colors">{t("auth.signUp")}</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </>
        ) : (
          <>
            <h1 className="font-light text-4xl italic mb-1">{t("auth.welcomeTo")}</h1>
            <h2 className="font-black text-6xl mb-6 tracking-tighter uppercase">{t("footer.brand")}</h2>
            <p className="opacity-80 text-lg mb-12 max-w-xs">
              {t("auth.alreadyHaveAccountOverlay")}
            </p>
            <button 
              onClick={onToggle} 
              className="group relative overflow-hidden rounded-2xl border-2 border-white/70 px-16 py-3 text-xl font-bold transition-all hover:border-white shadow-xl"
            >
              <span className="relative z-10 group-hover:text-sky-600 transition-colors">{t("auth.login")}</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}