import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner";

export default function RegisterForm({
  isVisible,
  onRegister,
  toggleAuth,
  onGoogleLogin,
  inModal,
  mobile,
}) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onRegister(e);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Mobile layout: normal flow, no absolute positioning ──────────────────
  if (mobile) {
    return (
      <div className="w-full px-5 py-8 sm:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {t("auth.createYourProfile")}
          </h2>
          <p className="mt-2 font-medium text-text-secondary text-sm sm:text-base">
            {t("auth.buildWardrobe")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields — stacked on xs, side-by-side on sm+ */}
          <div className="flex flex-col gap-3 xs:flex-row sm:flex-row">
            <div className="relative flex-1 group min-w-0">
              <User
                className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
                size={16}
              />
              <input
                name="fname"
                placeholder={t("auth.firstName")}
                required
                className="w-full ltr:pl-10 rtl:pr-10 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
              />
            </div>
            <div className="relative flex-1 group min-w-0">
              <User
                className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
                size={16}
              />
              <input
                name="lname"
                placeholder={t("auth.lastName")}
                required
                className="w-full ltr:pl-10 rtl:pr-10 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
              size={16}
            />
            <input
              name="email"
              type="email"
              placeholder={t("auth.email")}
              required
              className="w-full ltr:pl-10 rtl:pr-10 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
              size={16}
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              required
              className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <div className="relative group">
            <Lock
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
              size={16}
            />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.confirmPassword")}
              required
              className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full mt-1 py-3.5 rounded-xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:brightness-90 active:scale-95 text-sm cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isLoading ? <Spinner /> : t("auth.createAccount")}
          </button>

          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
              {t("auth.or")}
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="flex w-full items-center justify-center gap-3 py-3.5 rounded-xl border border-[var(--border)] font-bold text-text-primary text-sm transition-all hover:bg-[var(--bg-secondary)] active:scale-95 cursor-pointer"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5 shrink-0" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="text-center text-sm text-text-secondary font-medium mt-4">
            {t("auth.alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={toggleAuth}
              className="font-bold text-[var(--primary)] hover:underline transition-all cursor-pointer"
            >
              {t("auth.loginNow")}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // ── Desktop layout: original absolute-positioned sliding panel ─────────────
  return (
    <div
      className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:right-0 rtl:left-0 ${
        isVisible
          ? "z-10 opacity-100 translate-x-0"
          : "z-0 opacity-0 ltr:translate-x-10 rtl:-translate-x-10"
      } ${inModal ? "p-6 md:p-10" : "p-8 md:p-16"} bg-surface-elevated`}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <h2
            className={`font-black text-text-primary tracking-tight ${inModal ? "text-2xl" : "text-3xl"}`}
          >
            {t("auth.createYourProfile")}
          </h2>
          <p className="mt-2 font-medium text-text-secondary">
            {t("auth.buildWardrobe")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={inModal ? "space-y-3" : "space-y-4"}
        >
          <div className={`flex ${inModal ? "gap-3" : "gap-4"}`}>
            <div className="relative flex-1 group">
              <User
                className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-primary transition-colors"
                size={16}
              />
              <input
                name="fname"
                placeholder={t("auth.firstName")}
                required
                className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-3.5"}`}
              />
            </div>
            <div className="relative flex-1 group">
              <User
                className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
                size={16}
              />
              <input
                name="lname"
                placeholder={t("auth.lastName")}
                required
                className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-3.5"}`}
              />
            </div>
          </div>

          <div className="relative group">
            <Mail
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-primary transition-colors"
              size={16}
            />
            <input
              name="email"
              type="email"
              placeholder={t("auth.email")}
              required
              className={`w-full ltr:pl-10 rtl:pr-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-3.5"}`}
            />
          </div>

          <div className="relative group">
            <Lock
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
              size={16}
            />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              required
              className={`w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-3.5"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <div className="relative group">
            <Lock
              className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-[var(--primary)] transition-colors"
              size={16}
            />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("auth.confirmPassword")}
              required
              className={`w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-3.5"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full mt-2 rounded-xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:brightness-90 active:scale-95 ${inModal ? "py-3" : "py-4"} cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isLoading ? <Spinner /> : t("auth.createAccount")}
          </button>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
            <span className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
              {t("auth.or")}
            </span>
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className={`flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] font-bold text-text-primary transition-all hover:bg-[var(--bg-secondary)] ${inModal ? "py-3" : "py-4"} cursor-pointer`}
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="mt-4 text-center text-sm text-text-secondary font-medium">
            {t("auth.alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={toggleAuth}
              className="font-bold text-[var(--primary)] hover:underline transition-all cursor-pointer"
            >
              {t("auth.loginNow")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
