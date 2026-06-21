import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

import Spinner from "../../components/Spinner";
import { loginApi } from "../../api/authApi";
import { showToast } from "../../utils/toast";
import { getUserApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(value, t) {
  if (!value.trim()) return t("auth.emailRequired");
  if (!EMAIL_REGEX.test(value.trim())) return t("auth.emailInvalid");
  return "";
}

export default function LoginForm({
  isVisible,
  onForgot,
  onGoogleLogin,
  toggleAuth,
  inModal,
  mobile,
  onClose,
}) {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailBlur = (e) => {
    setEmailError(validateEmail(e.target.value, t));
  };

  const handleEmailChange = (e) => {
    if (emailError) setEmailError(validateEmail(e.target.value, t));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const error = validateEmail(email, t);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsLoading(true);
    try {
      const { role, _id: id, token } = await loginApi({ email, password });
      login({ id, email, token, role });
      const userRes = await getUserApi(id);
      const apiUser = userRes.data?.user || userRes.data;
      const fullName = apiUser?.profile
        ? [apiUser.profile.first_name, apiUser.profile.last_name]
            .filter(Boolean)
            .join(" ")
            .trim()
        : apiUser?.name;
      login({ id, email, token, role, ...apiUser, name: fullName });

      if (role === "admin") navigate("/admin", { replace: true });
      else onClose?.();
    } catch (err) {
      const message = err?.response?.data?.message;
      showToast("error", message ?? t("auth.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const emailField = (inputPadding) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-text-primary ltr:ml-1 rtl:mr-1">
        {t("auth.email")}
      </label>
      <div className="relative group">
        <Mail
          className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 transition-colors ${
            emailError
              ? "text-red-500"
              : "text-text-secondary group-focus-within:text-[var(--primary)]"
          }`}
          size={18}
        />
        <input
          name="email"
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          required
          onBlur={handleEmailBlur}
          onChange={handleEmailChange}
          className={`w-full ltr:pl-11 rtl:pr-11 rounded-2xl border text-text-primary text-sm outline-none transition-all ${inputPadding} ${
            emailError
              ? "border-red-400 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
              : "border-[var(--border)] bg-[var(--bg-secondary)]/50 focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
          }`}
        />
      </div>
      {emailError && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 ltr:ml-1 rtl:mr-1">
          <AlertCircle size={13} className="shrink-0" />
          {emailError}
        </p>
      )}
    </div>
  );

  // ── Mobile layout ─────────────────────────────────────────────────────────
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
          {emailField("p-3.5")}

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
                className="absolute cursor-pointer ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="text-right rtl:text-left mt-0.5">
              <button
                type="button"
                onClick={onForgot}
                className="text-xs font-bold text-[var(--primary)] hover:opacity-80 transition-opacity cursor-pointer"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-2xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:brightness-95 active:scale-95 text-sm cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isLoading ? <Spinner /> : t("auth.login")}
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
            className="flex w-full items-center justify-center gap-3 py-3.5 rounded-2xl border border-[var(--border)] font-bold text-text-primary text-sm transition-all hover:bg-[var(--bg-secondary)] active:scale-95 cursor-pointer"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5 shrink-0" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="mt-4 text-center text-sm text-text-secondary font-medium">
            {t("auth.dontHaveAccount")}{" "}
            <button
              type="button"
              onClick={toggleAuth}
              className="font-bold text-[var(--primary)] hover:underline transition-all cursor-pointer"
            >
              {t("auth.signUp")}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // ── Desktop layout ────────────────────────────────────────────────────────
  return (
    <div
      className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:left-0 rtl:right-0 ${
        isVisible
          ? "z-10 opacity-100 translate-x-0"
          : "z-0 opacity-0 ltr:-translate-x-10 rtl:translate-x-10"
      } ${inModal ? "p-6 md:p-10" : "p-8 md:p-16"} bg-surface-elevated`}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <h2
            className={`font-black text-text-primary tracking-tight ${inModal ? "text-3xl" : "text-4xl"}`}
          >
            {t("auth.loginTitle")}
          </h2>
          <p className="mt-2 font-medium text-text-secondary">
            {t("auth.loginSubtitle")}
          </p>
        </div>

        <form
          onSubmit={onLogin}
          className={inModal ? "space-y-4" : "space-y-5"}
        >
          {emailField(inModal ? "p-3" : "p-4")}

          {/* Password Field */}
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
                className={`w-full ltr:pl-11 rtl:pr-11 ltr:pr-12 rtl:pl-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 text-text-primary text-sm focus:bg-surface-elevated focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all ${inModal ? "p-3" : "p-4"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={onForgot}
                className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full rounded-2xl bg-[var(--primary)] font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)] hover:-translate-y-0.5 active:scale-95 cursor-pointer ${inModal ? "py-3" : "py-4"} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isLoading ? <Spinner /> : t("auth.login")}
          </button>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
              {t("auth.or")}
            </span>
            <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] font-bold text-text-primary transition-all hover:bg-[var(--bg-secondary)] hover:border-[var(--border)] cursor-pointer ${inModal ? "py-3" : "py-4"}`}
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>
        </form>
      </div>
    </div>
  );
}
