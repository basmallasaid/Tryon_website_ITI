import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RegisterForm({ isVisible, onRegister, toggleAuth, onGoogleLogin, inModal }) {
  const { t } = useTranslation();
  return (
    <div className={`absolute right-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    } ${inModal ? 'p-6 md:p-10' : 'p-8 md:p-16'}`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-black ${inModal ? 'text-2xl' : 'text-3xl'}`}>{t("auth.createYourProfile")}</h2>
        <p className={`mt-2 text-gray-500 ${inModal ? 'mb-5 text-sm' : 'mb-8'}`}>{t("auth.buildWardrobe")}</p>
        <form onSubmit={onRegister} className={inModal ? 'space-y-3' : 'space-y-4'}>
          <div className={`flex ${inModal ? 'gap-3' : 'gap-4'}`}>
            <input name="fname" placeholder={t("auth.firstName")} required className={`w-1/2 rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
            <input name="lname" placeholder={t("auth.lastName")} required className={`w-1/2 rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          </div>
          <input name="email" type="email" placeholder={t("auth.email")} required className={`w-full rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          <input name="password" type="password" placeholder={t("auth.password")} required className={`w-full rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          <input name="confirmPassword" type="password" placeholder={t("auth.confirmPassword")} required className={`w-full rounded-xl border border-gray-300 text-sm outline-none ${inModal ? 'p-3' : 'p-4'}`} />
          <button type="submit" className={`w-full rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF] ${inModal ? 'py-3' : 'py-4'}`}>{t("auth.createAccount")}</button>
          
          <div className={`flex items-center justify-center gap-4 ${inModal ? 'py-2' : 'py-4'}`}>
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
            <span className="text-xs font-bold text-[#40B9FF]">{t("auth.or")}</span>
            <div className="h-[1px] flex-1 bg-[#40B9FF] opacity-50"></div>
          </div>

          <button type="button" onClick={onGoogleLogin} className={`flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 font-bold text-black transition-all hover:bg-gray-50 ${inModal ? 'py-3' : 'py-4'}`}>
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            {t("auth.continueWithGoogle")}
          </button>

          <p className="mt-4 text-center text-xs text-gray-600">
            {t("auth.alreadyHaveAccount")}{" "}
            <button type="button" onClick={toggleAuth} className="font-bold text-[#40B9FF] hover:underline">{t("auth.loginNow")}</button>
          </p>
        </form>
      </div>
    </div>
  );
}
