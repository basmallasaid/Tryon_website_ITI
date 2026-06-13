import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, FileText, BookOpen, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import SlidersIcon from '../../../icons/SlidersIcon';
import NotificationBellIcon from '../../../icons/NotificationBellIcon';
import SendIcon from '../../../icons/SendIcon';
import ShieldCheckIcon from '../../../icons/ShieldCheckIcon';
import MegaphoneWaveIcon from '../../../icons/MegaphoneWaveIcon';

const SETTINGS_KEY = 'admin_settings';

const defaultSettings = {
  lang: 'en',
  appearance: 'light',
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

const notificationDefs = [
  {
    key: 'push',
    icon: SendIcon,
    circleBg: 'bg-[#1550D3]/10',
    iconColor: 'text-[#1550D3]',
    title: 'Push Notifications',
    description: 'Receive real-time alerts for inventory changes and order status.',
  },
  {
    key: 'email',
    icon: Mail,
    circleBg: 'bg-[#006C49]/10',
    iconColor: 'text-[#006C49]',
    title: 'Email Digests',
    description: 'Weekly performance reports and summary of store activities.',
  },
  {
    key: 'marketing',
    icon: MegaphoneWaveIcon,
    circleBg: 'bg-[#825100]/10',
    iconColor: 'text-[#825100]',
    title: 'Marketing Communications',
    description: 'Tips for growth and new enterprise feature announcements.',
  },
];

const supportLinks = [
  { icon: FileText, label: 'Privacy Policy' },
  { icon: FileText, label: 'Terms of Service' },
  { icon: BookOpen, label: 'Knowledge Base' },
  { icon: LogOut, label: 'Log Out', danger: true },
];

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
  const { i18n } = useTranslation();
  const [saved, setSaved] = useState(loadSettings);
  const [draft, setDraft] = useState(saved);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(saved);

  const setLang = (lang) => setDraft((p) => ({ ...p, lang }));
  const setAppearance = (appearance) => setDraft((p) => ({ ...p, appearance }));
  const toggleNotif = (key) =>
    setDraft((p) => ({ ...p, notifications: { ...p.notifications, [key]: !p.notifications[key] } }));

  const handleSave = () => {
    saveSettings(draft);
    setSaved(draft);
    i18n.changeLanguage(draft.lang);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleDiscard = () => {
    setDraft(saved);
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-[32px] font-semibold text-[#191B23] tracking-[-0.64px]">Platform Settings</h1>
        <p className="text-sm sm:text-base text-[#434654] mt-2">
          Manage your enterprise environment, notification preferences, and global account security.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Preferences */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <SlidersIcon className="w-[18px] h-[18px] text-[#1550D3]" />
            <h2 className="text-lg sm:text-xl font-medium text-[#191B23] tracking-[-0.2px]">Preferences</h2>
          </div>
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* System Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-[#191B23]">System Language</p>
                <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">Choose your preferred language for the dashboard interface.</p>
              </div>
              <select
                value={draft.lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full sm:w-[200px] px-3 py-2 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-sm sm:text-base text-[#191B23] outline-none"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="border-t border-[#C3C5D7]/20" />

            {/* Appearance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-[#191B23]">Appearance</p>
                <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">Switch between light and dark modes for the user interface.</p>
              </div>
              <div className="flex bg-[#E7E7F2] rounded-lg p-1 gap-0 w-full sm:w-auto">
                <button
                  onClick={() => setAppearance('light')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md text-sm sm:text-base transition-all ${
                    draft.appearance === 'light'
                      ? 'bg-[#FAF8FF] shadow-sm text-[#1550D3]'
                      : 'text-[#434654]'
                  }`}
                >
                  <Sun className="w-[16.5px] h-[16.5px]" />
                  Light
                </button>
                <button
                  onClick={() => setAppearance('dark')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md text-sm sm:text-base transition-all ${
                    draft.appearance === 'dark'
                      ? 'bg-[#FAF8FF] shadow-sm text-[#1550D3]'
                      : 'text-[#434654]'
                  }`}
                >
                  <Moon className="w-[13.5px] h-[13.5px]" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <NotificationBellIcon className="w-5 h-5 text-[#1550D3]" />
            <h2 className="text-lg sm:text-xl font-medium text-[#191B23] tracking-[-0.2px]">Notifications</h2>
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

        {/* Account & Support */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <ShieldCheckIcon className="w-4 h-5 text-[#1550D3]" />
            <h2 className="text-lg sm:text-xl font-medium text-[#191B23] tracking-[-0.2px]">Account &amp; Support</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {supportLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors ${
                    link.danger
                      ? 'bg-[#BA1A1A]/5 border-[#BA1A1A]/20 text-[#BA1A1A]'
                      : 'border-[#C3C5D7]/20 text-[#191B23] hover:border-[#C3C5D7]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-5 ${link.danger ? 'text-[#BA1A1A]' : 'text-[#434654]'}`} />
                    <span className={`text-sm sm:text-base ${link.danger ? 'font-bold' : ''}`}>{link.label}</span>
                  </div>
                  {link.danger ? null : <ChevronRight className="w-[7px] h-3 text-[#434654]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 mt-4 sm:mt-6 flex items-center justify-end gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-[#FAF8FF]/80 backdrop-blur-sm border border-[#C3C5D7]/30 rounded-2xl shadow-lg">
        {savedMsg && (
          <span className="text-sm text-[#006C49] font-medium mr-auto">Settings saved</span>
        )}
        <button
          onClick={handleDiscard}
          disabled={!hasChanges}
          className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-[#434654] rounded-lg hover:bg-[#FAF8FF] transition-colors disabled:opacity-40"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="px-5 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base text-white bg-[#1550D3] rounded-lg shadow-[0px_4px_6px_-1px_rgba(21,80,211,0.2),0px_2px_4px_-2px_rgba(21,80,211,0.2)] hover:bg-[#1550D3]/90 transition-colors disabled:opacity-40"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
