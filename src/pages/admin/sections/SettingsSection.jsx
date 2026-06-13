import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LogOut, Globe } from 'lucide-react';
import SlidersIcon from '../../../icons/SlidersIcon';
import NotificationBellIcon from '../../../icons/NotificationBellIcon';
import SendIcon from '../../../icons/SendIcon';
import MegaphoneWaveIcon from '../../../icons/MegaphoneWaveIcon';
import adminI18n from '../../../i18n/admin/adminI18n';

const SETTINGS_KEY = 'admin_settings';

const defaultSettings = {
  lang: 'en',
  notifications: {
    push: true,
    email: true,
    marketing: false,
  },
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultSettings };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#1550D3]' : 'bg-[#C3C5D7]'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

export default function PlatformSettingsSection() {
  const { t } = adminI18n;
  const navigate = useNavigate();
  const [saved, setSaved] = useState(loadSettings);
  const [draft, setDraft] = useState(saved);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(saved);

  const setLang = (lang) => setDraft((p) => ({ ...p, lang }));
  const toggleNotif = (key) =>
    setDraft((p) => ({ ...p, notifications: { ...p.notifications, [key]: !p.notifications[key] } }));

  const handleSave = () => {
    saveSettings(draft);
    setSaved(draft);
    adminI18n.changeLanguage(draft.lang);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleDiscard = () => {
    setDraft(saved);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const notificationDefs = [
    {
      key: 'push',
      icon: SendIcon,
      circleBg: 'bg-[#1550D3]/10',
      iconColor: 'text-[#1550D3]',
      title: t('admin.settings.pushNotifications'),
      description: t('admin.settings.pushNotificationsDesc'),
    },
    {
      key: 'email',
      icon: Mail,
      circleBg: 'bg-[#006C49]/10',
      iconColor: 'text-[#006C49]',
      title: t('admin.settings.emailDigests'),
      description: t('admin.settings.emailDigestsDesc'),
    },
    {
      key: 'marketing',
      icon: MegaphoneWaveIcon,
      circleBg: 'bg-[#825100]/10',
      iconColor: 'text-[#825100]',
      title: t('admin.settings.marketing'),
      description: t('admin.settings.marketingDesc'),
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-[32px] font-semibold text-[#191B23] tracking-[-0.64px]">{t('admin.settings.title')}</h1>
        <p className="text-sm sm:text-base text-[#434654] mt-2">
          {t('admin.settings.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Preferences */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <SlidersIcon className="w-[18px] h-[18px] text-[#1550D3]" />
            <h2 className="text-lg sm:text-xl font-medium text-[#191B23] tracking-[-0.2px]">{t('admin.settings.preferences')}</h2>
          </div>
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* System Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-[#191B23]">{t('admin.settings.systemLanguage')}</p>
                <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">{t('admin.settings.systemLanguageDesc')}</p>
              </div>
              <div className="relative w-full sm:w-[200px]">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#434654]" />
                <select
                  value={draft.lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-sm sm:text-base text-[#191B23] outline-none appearance-none cursor-pointer"
                >
                  <option value="en">{t('admin.common.english')}</option>
                  <option value="ar">{t('admin.common.arabic')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <NotificationBellIcon className="w-5 h-5 text-[#1550D3]" />
            <h2 className="text-lg sm:text-xl font-medium text-[#191B23] tracking-[-0.2px]">{t('admin.settings.notifications')}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:gap-6">
            {notificationDefs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 sm:p-4 bg-[#F3F3FE]/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${item.circleBg}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-4 ${item.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-[#191B23]">{item.title}</p>
                      <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <Toggle checked={draft.notifications[item.key]} onChange={() => toggleNotif(item.key)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Log Out */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full p-3 sm:p-4 rounded-lg border bg-[#BA1A1A]/5 border-[#BA1A1A]/20 text-[#BA1A1A] hover:bg-[#BA1A1A]/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-5 text-[#BA1A1A]" />
              <span className="text-sm sm:text-base font-bold">{t('admin.settings.logOut')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 mt-4 sm:mt-6 flex items-center justify-end gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-[#FAF8FF]/80 backdrop-blur-sm border border-[#C3C5D7]/30 rounded-2xl shadow-lg">
        {savedMsg && (
          <span className="text-sm text-[#006C49] font-medium mr-auto">{t('admin.settings.settingsSaved')}</span>
        )}
        <button
          onClick={handleDiscard}
          disabled={!hasChanges}
          className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-[#434654] rounded-lg hover:bg-[#FAF8FF] transition-colors disabled:opacity-40"
        >
          {t('admin.settings.discardChanges')}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-5 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base text-white bg-[#1550D3] rounded-lg shadow-[0px_4px_6px_-1px_rgba(21,80,211,0.2),0px_2px_4px_-2px_rgba(21,80,211,0.2)] hover:bg-[#1550D3]/90 transition-colors disabled:opacity-40"
        >
          {t('admin.settings.saveConfiguration')}
        </button>
      </div>
    </div>
  );
}
