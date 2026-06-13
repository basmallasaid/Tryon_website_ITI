import React from "react";
import { User, Mail, Lock } from "lucide-react"; // أيقونات جديدة
import { useTranslation } from "react-i18next";

export default function RegisterForm({ isVisible, onRegister, toggleAuth, onGoogleLogin, inModal }) {
  const { t } = useTranslation();
  return (
    <div className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:right-0 rtl:left-0 ${
      isVisible ? "z-10 opacity-100 translate-x-0" : "z-0 opacity-0 ltr:translate-x-10 rtl:-translate-x-10"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'} bg-white`}>
      
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <h2 className={`font-black text-slate-900 tracking-tight ${inModal ? 'text-2xl' : 'text-3xl'}`}>
            {t("auth.createYourProfile")}
          </h2>
          <p className="mt-2 font-medium text-slate-500">{t("auth.buildWardrobe")}</p>
        </div>

        <form onSubmit={onRegister} className={inModal ? 'space-y-3' : 'space-y-4'}>
          {/* Name Fields */}
          <div className={`flex ${inModal ? 'gap-3' : 'gap-4'}`}>
            <div className="relative flex-1 group">
              <User className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40B9FF] transition-colors" size={16} />
              <input name="fname" placeholder={t("auth.firstName")} required className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-3.5'}`} />
            </div>
            <div className="relative flex-1 group">
              <input name="lname" placeholder={t("auth.lastName")} required className={`w-full px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-3.5'}`} />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40B9FF] transition-colors" size={16} />
            <input name="email" type="email" placeholder={t("auth.email")} required className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-3.5'}`} />
          </div>

          {/* Passwords */}
          <div className="relative group">
            <Lock className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40B9FF] transition-colors" size={16} />
            <input name="password" type="password" placeholder={t("auth.password")} required className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-3.5'}`} />
          </div>
          
          <input name="confirmPassword" type="password" placeholder={t("auth.confirmPassword")} required className={`w-full px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-3.5'}`} />

          <button type="submit" className={`w-full mt-2 rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#35a8eb] active:scale-95 ${inModal ? 'py-3' : 'py-4'}`}>
            {t("auth.createAccount")}
          </button>
          
          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("auth.or")}</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <button type="button" onClick={onGoogleLogin} className={`flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 font-bold text-slate-700 transition-all hover:bg-gray-50 ${inModal ? 'py-3' : 'py-4'}`}>
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500 font-medium">
            {t("auth.alreadyHaveAccount")}{" "}
            <button type="button" onClick={toggleAuth} className="font-bold text-[#40B9FF] hover:underline transition-all">{t("auth.loginNow")}</button>
          </p>
        </form>
      </div>
    </div>
  );
}