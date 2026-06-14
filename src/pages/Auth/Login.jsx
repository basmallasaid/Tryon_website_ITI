import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LoginForm({ isVisible, onLogin, onForgot, onGoogleLogin, toggleAuth, inModal, mobile }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  // ── Mobile layout: normal flow, no absolute positioning ──────────────────
  if (mobile) {
    return (
      <div className="w-full px-5 py-8 sm:px-8">
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {t("auth.loginTitle")}
          </h2>
          <p className="mt-2 font-medium text-text-secondary text-sm sm:text-base">
            {t("auth.loginSubtitle")}
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">
              {t("auth.email")}
            </label>
            <div className="relative group">
              <Mail
                className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors"
                size={18}
              />
              <input
                name="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                required
                className="w-full ltr:pl-11 rtl:pr-11 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">
              {t("auth.password")}
            </label>
            <div className="relative group">
              <Lock
                className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors"
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                required
                className="w-full ltr:pl-11 rtl:pr-11 ltr:pr-12 rtl:pl-12 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right rtl:text-left mt-0.5">
              <button
                type="button"
                onClick={onForgot}
                className="text-xs font-bold text-[var(--primary)] hover:opacity-80 transition-opacity"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:brightness-95 active:scale-95 text-sm"
          >
            {t("auth.login")}
          </button>

          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
              {t("auth.or")}
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="flex w-full items-center justify-center gap-3 py-3.5 rounded-2xl border border-[var(--border)] font-bold text-text-primary text-sm transition-all hover:bg-[var(--bg-secondary)] active:scale-95"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5 shrink-0" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="mt-4 text-center text-sm text-text-secondary font-medium">
            {t("auth.dontHaveAccount")}{" "}
            <button
              type="button"
              onClick={toggleAuth}
              className="font-bold text-[var(--primary)] hover:underline transition-all"
            >
              {t("auth.signUp")}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // ── Desktop layout: original absolute-positioned sliding panel ─────────────
  return (
    <div
      className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:left-0 rtl:right-0 ${
        isVisible ? "z-10 opacity-100 translate-x-0" : "z-0 opacity-0 ltr:-translate-x-10 rtl:translate-x-10"
      } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'} bg-surface-elevated`}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <h2 className={`font-black text-text-primary tracking-tight ${inModal ? 'text-3xl' : 'text-4xl'}`}>
            {t("auth.loginTitle")}
          </h2>
          <p className="mt-2 font-medium text-text-secondary">{t("auth.loginSubtitle")}</p>
        </div>

        <form onSubmit={onLogin} className={inModal ? 'space-y-4' : 'space-y-5'}>
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">{t("auth.email")}</label>
            <div className="relative group">
              <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input
                name="email" type="email" placeholder={t("auth.emailPlaceholder")} required
                className={`w-full ltr:pl-11 rtl:pr-11 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-4'}`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">{t("auth.password")}</label>
            <div className="relative group">
              <Lock className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                required
                className={`w-full ltr:pl-11 rtl:pr-11 ltr:pr-12 rtl:pl-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? 'p-3' : 'p-4'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <button type="button" onClick={onForgot} className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary)] transition-colors">{t("auth.forgotPassword")}</button>
            </div>
          </div>

          <button type="submit" className={`w-full rounded-2xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)] hover:-translate-y-0.5 active:scale-95 ${inModal ? 'py-3' : 'py-4'}`}>
            {t("auth.login")}
          </button>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{t("auth.or")}</span>
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
          </div>

          <button type="button" onClick={onGoogleLogin} className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] font-bold text-text-primary transition-all hover:bg-[var(--bg-secondary)] hover:border-[var(--border)] ${inModal ? 'py-3' : 'py-4'}`}>
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>
        </form>
      </div>
    </div>
  );
}