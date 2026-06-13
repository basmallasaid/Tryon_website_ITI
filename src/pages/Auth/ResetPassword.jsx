import React, { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { showToast } from "../../utils/toast";

export default function ResetPassword({ isVisible, onReset, onBackToLogin, inModal }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strength = getStrength(newPassword);
  const barColors = ["", "", "", ""];
  const labels = [t("auth.strengthNone"), t("auth.strengthWeak"), t("auth.strengthMedium"), t("auth.strengthGood"), t("auth.strengthStrong")];
  const labelColors = ["#777", "#ff4d4d", "#ffa500", "#40B9FF", "#A6E22E"];

  if (newPassword) {
    for (let i = 0; i < strength; i++) barColors[i] = labelColors[strength];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showToast('warning', t("auth.passwordsNoMatch"));
    onReset(newPassword, confirmPassword);
  };

  return (
    <div className={`absolute left-0 top-0 flex h-full w-full flex-col justify-center transition-all duration-700 md:w-[60%] ${
      isVisible ? "z-10 opacity-100" : "z-0 opacity-0"
    } ${inModal ? "p-6 md:p-10" : "p-8 md:p-16"}`}>
      <div className="mx-auto w-full max-w-md">
        <h2 className={`font-bold text-black ${inModal ? "text-2xl" : "text-3xl"}`}>{t("auth.setNewPassword")}</h2>
        <p className={`mt-2 text-gray-500 leading-relaxed ${inModal ? "mb-5 text-sm" : "mb-8"}`}>
          {t("auth.setNewPasswordDesc")}
        </p>
        <form onSubmit={handleSubmit} className={inModal ? "space-y-4" : "space-y-5"}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">{t("auth.newPassword")}</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                required
                className={`w-full rounded-xl border border-gray-300 text-sm outline-none pr-11 ${
                  inModal ? "p-3" : "p-4"
                }`}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-1.5">
              {barColors.map((color, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: color || "#e0e0e0" }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: newPassword ? labelColors[strength] : "#777" }}>
              {t("auth.passwordStrength")} {newPassword ? labels[strength] : t("auth.strengthNone")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">{t("auth.confirmPasswordLabel")}</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                required
                className={`w-full rounded-xl border border-gray-300 text-sm outline-none pr-11 ${
                  inModal ? "p-3" : "p-4"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-[#f1f8e9] p-3">
            <Info size={18} className="shrink-0 text-[#A6E22E]" />
            <p className="text-xs font-medium text-[#7cb342]">
              {t("auth.passwordHint")}
            </p>
          </div>

          <button type="submit" className={`w-full rounded-xl bg-[#40B9FF] font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#89D4FF] ${inModal ? "py-3" : "py-4"}`}>
            {t("auth.updatePassword")}
          </button>

          <div className="pt-1 text-center">
            <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-1 font-semibold text-[#A6E22E] border-b border-[#A6E22E] pb-0.5 text-sm hover:opacity-80">
              {t("auth.backToLogin")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
