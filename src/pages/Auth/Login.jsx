import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // أضفنا Mail و Lock
import { useTranslation } from "react-i18next";

export default function LoginForm({ isVisible, onLogin, onForgot, onGoogleLogin, inModal }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`absolute left-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100 translate-x-0" : "z-0 opacity-0 -translate-x-10"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'} bg-white`}>
      
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <h2 className={`font-black text-slate-900 tracking-tight ${inModal ? 'text-3xl' : 'text-4xl'}`}>
            {t("auth.loginTitle")}
          </h2>
          <p className="mt-2 font-medium text-slate-500">{t("auth.loginSubtitle")}</p>
        </div>

        <form onSubmit={onLogin} className={inModal ? 'space-y-4' : 'space-y-5'}>
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">{t("auth.email")}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40B9FF] transition-colors" size={18} />
              <input 
                name="email" type="email" placeholder={t("auth.emailPlaceholder")} required 
                className={`w-full pl-11 rounded-2xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-4'}`} 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">{t("auth.password")}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40B9FF] transition-colors" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                required
                className={`w-full pl-11 pr-12 rounded-2xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-[#40B9FF] focus:ring-4 focus:ring-[#40B9FF]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-4'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <button type="button" onClick={onForgot} className="text-xs font-bold text-[#40B9FF] hover:text-[#2da7ed] transition-colors">{t("auth.forgotPassword")}</button>
            </div>
          </div>

          <button type="submit" className={`w-full rounded-2xl bg-[#40B9FF] font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#35a8eb] hover:-translate-y-0.5 active:scale-95 ${inModal ? 'py-3' : 'py-4'}`}>
            {t("auth.login")}
          </button>
          
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("auth.or")}</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <button type="button" onClick={onGoogleLogin} className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 font-bold text-slate-700 transition-all hover:bg-gray-50 hover:border-gray-300 ${inModal ? 'py-3' : 'py-4'}`}>
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>
        </form>
      </div>
    </div>
  );
}