import React from "react";
import { Mail, ArrowLeft } from "lucide-react"; // أضفنا أيقونات Mail و ArrowLeft
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ isVisible, onForgot, onBackToLogin, inModal }) {
  const { t } = useTranslation();
  
  return (
    <div className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:right-0 rtl:left-0 ${
      isVisible ? "z-10 opacity-100 translate-x-0" : "z-0 opacity-0 ltr:translate-x-10 rtl:-translate-x-10"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'} bg-surface-elevated`}>
      
      <div className="mx-auto w-full max-w-md">
        {/* العنوان والوصف */}
        <div className="mb-8 text-left rtl:text-right">
          <h2 className={`font-black text-text-primary tracking-tight ${inModal ? 'text-2xl' : 'text-3xl'}`}>
            {t("auth.forgotPasswordTitle")}
          </h2>
          <p className="mt-3 font-medium text-text-secondary leading-relaxed text-sm md:text-base">
            {t("auth.forgotPasswordDesc")}
          </p>
        </div>

        <form onSubmit={onForgot} className={inModal ? 'space-y-4' : 'space-y-6'}>
          {/* حقل البريد الإلكتروني */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">{t("auth.email")}</label>
            <div className="relative group">
              <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                name="email" 
                type="email" 
                placeholder={t("auth.emailPlaceholder")} 
                required 
                className={`w-full ltr:pl-11 rtl:pr-11 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-4'}`} 
              />
            </div>
          </div>

          {/* زر الإرسال */}
          <button 
            type="submit" 
            className={`w-full rounded-2xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)] hover:-translate-y-0.5 active:scale-95 ${inModal ? 'py-3' : 'py-4'}`}
          >
            {t("auth.sendResetLink")}
          </button>

          {/* فاصل "أو" */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{t("auth.or")}</span>
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
          </div>

          {/* روابط مساعدة */}
          <div className="space-y-3 text-center">
            <p className="text-xs font-medium text-text-secondary">{t("auth.noEmail")}</p>
            <button 
              type="button" 
              className="text-xs font-bold text-text-secondary hover:text-[var(--primary)] transition-colors underline underline-offset-4"
            >
              {t("auth.tryDifferentEmail")}
            </button>
          </div>

          {/* زر العودة للدخول */}
          <div className="pt-4 text-center">
            <button 
              type="button" 
              onClick={onBackToLogin} 
              className="group inline-flex items-center gap-2 font-bold text-[var(--primary)] text-sm hover:text-[var(--primary)] transition-all"
            >
              <ArrowLeft size={16} className="transition-transform rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              <span>{t("auth.backToLogin")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}