import React, { useState, useEffect } from "react";
import { 
  Mail, Bell, Sun, Globe, ChevronRight, 
  CreditCard, Heart, SquarePen, LogOut, Phone ,Smartphone 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  updateUserSettingsLanguageApi,
  updateUserSettingsNotificationsApi,
} from "../../api/userApi";

const ProfilePopup = ({ user, logout, isArabic, isDarkMode, toggleDarkMode, changeLanguage, onClose }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    language: isArabic ? "ar" : "en",
    notifications_enabled: true,
    has_mobile_app: false,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setSettings({
        language: user.settings.language ?? (isArabic ? "ar" : "en"),
        notifications_enabled: user.settings.notifications_enabled ?? true,
        has_mobile_app: user.settings.has_mobile_app ?? false,
      });
    } else {
      setSettings((prev) => ({ ...prev, language: isArabic ? "ar" : "en" }));
    }
  }, [user, isArabic]);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      language: isArabic ? "ar" : "en",
    }));
  }, [isArabic]);

  const saveLanguage = async (language) => {
    const nextSettings = { ...settings, language };
    setSettings(nextSettings);
    setIsSavingSettings(true);

    try {
      const res = await updateUserSettingsLanguageApi(language);
      if (res?.data?.language) {
        setSettings((prev) => ({ ...prev, language: res.data.language }));
      }
    } catch (error) {
      console.error("Failed to save language:", error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const saveNotifications = async (enabled) => {
    const nextSettings = { ...settings, notifications_enabled: enabled };
    setSettings(nextSettings);
    setIsSavingSettings(true);

    try {
      const res = await updateUserSettingsNotificationsApi(enabled);
      if (res?.data?.enabled !== undefined) {
        setSettings((prev) => ({ ...prev, notifications_enabled: res.data.enabled }));
      }
    } catch (error) {
      console.error("Failed to save notifications:", error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLanguageToggle = async () => {
    const nextLanguage = settings.language === 'en' ? 'ar' : 'en';
    changeLanguage?.(nextLanguage);
    await saveLanguage(nextLanguage);
  };

  return (
    <div 
      className={`absolute top-full mt-4 w-[300px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 p-6 z-[100] animate-in fade-in zoom-in duration-200 ${
        isArabic ? 'left-0' : 'right-0'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {/* User Email Header */}
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-6">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <Mail size={16} className="text-gray-400" />
        </div>
        <span className="text-[13px] font-bold text-gray-600 truncate">
          {user?.email}
        </span>
      </div>

      {/* Settings Sections */}
      <div className="space-y-1 mb-6">
        {/* Notifications */}
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700">{t("profile.notifications")}</span>
          </div>
          <button 
            onClick={() => saveNotifications(!settings.notifications_enabled)}
            disabled={isSavingSettings}
            className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${
              settings.notifications_enabled ? 'bg-gray-900' : 'bg-gray-200'
            } ${isSavingSettings ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className={`absolute top-1 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all duration-300 ${
              settings.notifications_enabled ? (isArabic ? 'left-1' : 'right-1') : (isArabic ? 'right-1' : 'left-1')
            }`} />
          </button>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <Sun size={18} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700">{t("profile.darkMode")}</span>
          </div>
          <button 
            onClick={toggleDarkMode} 
            className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <div className={`absolute top-1 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all duration-300 ${
              isDarkMode ? (isArabic ? 'left-1' : 'right-1') : (isArabic ? 'right-1' : 'left-1')
            }`} />
          </button>
        </div>

        {/* Language */}
        <div
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
          onClick={handleLanguageToggle}
        >
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700 uppercase">
              {settings.language === 'ar' ? t("profile.languageArabic") : t("profile.languageEnglish")}
            </span>
          </div>
          <ChevronRight size={14} className={`text-gray-300 group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <Smartphone size={18} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700">{t("profile.mobileApp")}</span>
          </div>
          <span className="text-sm text-gray-500">
            {settings.has_mobile_app ? t("profile.enabled") : t("profile.notInstalled")}
          </span>
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-3 mb-6">
        <button className="w-full bg-[#F0F9FF] group rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#E0F2FE] hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm text-[#40B9FF]">
              <CreditCard size={18} />
            </div>
            <div className="text-left">
              <p className="font-black text-gray-900 text-[13px]">{t("profile.paymentMethods")}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{t("profile.secureSettings")}</p>
            </div>
          </div>
        </button>

        <Link to="/favorites" onClick={onClose} className="w-full bg-[#F0F9FF] group rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-[#E0F2FE] hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm text-[#40B9FF]">
              <Heart size={18} />
            </div>
            <div className="text-left">
              <p className="font-black text-gray-900 text-[13px]">{t("profile.wishlist")}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{t("profile.yourSavedItems")}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Primary Action Button */}
      <Link 
        to="/editprofile" 
        onClick={onClose} 
        className="flex items-center justify-center gap-2 w-full bg-white border-2 border-[#A6E22E] text-[#A6E22E] font-black py-3 rounded-2xl text-center hover:bg-[var(--color-brand-secondary)] hover:text-white transition-all duration-300 mb-4 text-sm shadow-sm"
      >
        {t("profile.editProfile")} <SquarePen size={16} />
      </Link>

      {/* Logout */}
      <div className="flex justify-end pt-2 border-t border-gray-50">
        <button 
          onClick={logout} 
          className="flex items-center gap-2 text-[#FF8A3D] font-black text-[13px] hover:scale-105 transition-all opacity-80 hover:opacity-100 uppercase tracking-tight"
        >
          {t("profile.signOut")} <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;