import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OtpVerification({ isVisible, email, onVerify, onBackToLogin, inModal, mobile }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isVisible) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isVisible]);

  const handleChange = (index, value) => {
    if (value && !value.match(/^\d$/)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp.join(""));
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const maskEmail = (email) => {
    if (!email) return "your email";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  // Shared form content (used by both mobile and desktop)
  const formContent = (
    <form onSubmit={handleSubmit}>
      {/* OTP inputs — fluid sizing so they never overflow */}
      <div className="flex gap-1.5 xs:gap-2 sm:gap-3 mb-6 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`
              flex-1 min-w-0 max-w-[52px] aspect-square
              text-center font-bold rounded-xl outline-none transition-all duration-200
              text-lg xs:text-xl sm:text-2xl
              ${digit
                ? "bg-[var(--secondary)]/10 border-2 border-[var(--secondary)] text-text-primary"
                : "bg-[var(--primary)]/10 border-2 border-transparent focus:bg-surface-elevated focus:border-[var(--secondary)]"
              }
            `}
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--primary)] font-bold text-white shadow-lg transition-transform active:scale-95 hover:brightness-95 inline-flex items-center justify-center gap-2 py-3.5 text-sm"
      >
        {t("auth.verifyContinue")} <span className="inline-block rtl:rotate-180">→</span>
      </button>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm font-semibold text-text-secondary">
          {t("auth.noCode")}{" "}
          <button type="button" className="underline hover:text-text-primary">
            {t("auth.resendCode")}
          </button>
        </p>
        <p className={`text-sm font-semibold ${timeLeft > 0 ? "text-[var(--accent-orange)]" : "text-text-secondary"}`}>
          {t("auth.requestNewCode")} {formatTime(timeLeft)}
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1 font-semibold text-[var(--secondary)] border-b border-[var(--secondary)] pb-0.5 text-sm hover:opacity-80"
          >
            <span className="inline-block rtl:rotate-180">←</span> {t("auth.backToLogin")}
          </button>
        </div>
      </div>
    </form>
  );

  // ── Mobile layout: normal flow, no absolute positioning ──────────────────
  if (mobile) {
    return (
      <div className="w-full px-5 py-8 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          {t("auth.enterVerificationCode")}
        </h2>
        <p className="text-text-secondary leading-relaxed mb-7 text-sm">
          {t("auth.otpDesc", { email: maskEmail(email) })}
        </p>
        {formContent}
      </div>
    );
  }

  // ── Desktop layout: original absolute-positioned sliding panel ─────────────
  return (
    <div
      className={`absolute top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ltr:left-0 rtl:right-0 ${
        isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
      } ${inModal ? "p-6 md:p-10" : "p-8 md:p-16"}`}
    >
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-text-primary ${inModal ? "text-2xl" : "text-3xl"}`}>
          {t("auth.enterVerificationCode")}
        </h2>
        <p className={`mt-2 text-text-secondary leading-relaxed ${inModal ? "mb-6 text-sm" : "mb-8"}`}>
          {t("auth.otpDesc", { email: maskEmail(email) })}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-6 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-[52px] h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all duration-200 ${
                  digit
                    ? "bg-[var(--secondary)]/10 border-2 border-[var(--secondary)] text-text-primary"
                    : "bg-[var(--primary)]/10 border-2 border-transparent focus:bg-surface-elevated focus:border-[var(--secondary)]"
                } ${inModal ? 'w-[46px] h-12 text-xl' : 'w-[52px] h-14 text-2xl'}`}
              />
            ))}
          </div>

          <button type="submit" className={`w-full rounded-xl bg-[var(--primary)] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[var(--primary)] inline-flex items-center justify-center gap-2 ${inModal ? "py-3" : "py-4"}`}>
            {t("auth.verifyContinue")} <span className="inline-block rtl:rotate-180">→</span>
          </button>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-semibold text-text-secondary">
              {t("auth.noCode")}{" "}
              <button type="button" className="underline hover:text-text-primary">{t("auth.resendCode")}</button>
            </p>
            <p className={`text-sm font-semibold ${timeLeft > 0 ? "text-[var(--accent-orange)]" : "text-text-secondary"}`}>
              {t("auth.requestNewCode")} {formatTime(timeLeft)}
            </p>
            <div className="pt-2">
              <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-1 font-semibold text-[var(--secondary)] border-b border-[var(--secondary)] pb-0.5 text-sm hover:opacity-80">
                <span className="inline-block rtl:rotate-180">←</span> {t("auth.backToLogin")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
