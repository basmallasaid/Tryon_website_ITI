import { useState } from 'react';
import { Mail, FileText, BookOpen, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import SlidersIcon from '../../../icons/SlidersIcon';
import NotificationBellIcon from '../../../icons/NotificationBellIcon';
import SendIcon from '../../../icons/SendIcon';
import ShieldCheckIcon from '../../../icons/ShieldCheckIcon';
import MegaphoneWaveIcon from '../../../icons/MegaphoneWaveIcon';

const notifications = [
  {
    key: 'push',
    icon: SendIcon,
    circleBg: 'bg-[#1550D3]/10',
    iconColor: 'text-[#1550D3]',
    title: 'Push Notifications',
    description: 'Receive real-time alerts for inventory changes and order status.',
    defaultOn: true,
  },
  {
    key: 'email',
    icon: Mail,
    circleBg: 'bg-[#006C49]/10',
    iconColor: 'text-[#006C49]',
    title: 'Email Digests',
    description: 'Weekly performance reports and summary of store activities.',
    defaultOn: true,
  },
  {
    key: 'marketing',
    icon: MegaphoneWaveIcon,
    circleBg: 'bg-[#825100]/10',
    iconColor: 'text-[#825100]',
    title: 'Marketing Communications',
    description: 'Tips for growth and new enterprise feature announcements.',
    defaultOn: false,
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
  const [lang, setLang] = useState('en');
  const [appearance, setAppearance] = useState('light');
  const [toggles, setToggles] = useState({
    push: true,
    email: true,
    marketing: false,
  });

  const toggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-[#191B23] tracking-[-0.64px]">Platform Settings</h1>
        <p className="text-base text-[#434654] mt-2">
          Manage your enterprise environment, notification preferences, and global account security.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Preferences */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <SlidersIcon className="w-[18px] h-[18px] text-[#1550D3]" />
            <h2 className="text-xl font-medium text-[#191B23] tracking-[-0.2px]">Preferences</h2>
          </div>
          <div className="flex flex-col gap-8">
            {/* System Language */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-[#191B23]">System Language</p>
                <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">Choose your preferred language for the dashboard interface.</p>
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-[200px] px-3 py-2 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-base text-[#191B23] outline-none"
              >
                <option value="en">English (United States)</option>
              </select>
            </div>

            <div className="border-t border-[#C3C5D7]/20" />

            {/* Appearance */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-[#191B23]">Appearance</p>
                <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">Switch between light and dark modes for the user interface.</p>
              </div>
              <div className="flex bg-[#E7E7F2] rounded-lg p-1 gap-0">
                <button
                  onClick={() => setAppearance('light')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-base transition-all ${
                    appearance === 'light'
                      ? 'bg-[#FAF8FF] shadow-sm text-[#1550D3]'
                      : 'text-[#434654]'
                  }`}
                >
                  <Sun className="w-[16.5px] h-[16.5px]" />
                  Light
                </button>
                <button
                  onClick={() => setAppearance('dark')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-base transition-all ${
                    appearance === 'dark'
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
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <NotificationBellIcon className="w-5 h-5 text-[#1550D3]" />
            <h2 className="text-xl font-medium text-[#191B23] tracking-[-0.2px]">Notifications</h2>
          </div>
          <div className="flex flex-col gap-6">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-[#F3F3FE]/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.circleBg}`}>
                      <Icon className={`w-5 h-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#191B23]">{item.title}</p>
                      <p className="text-xs font-medium text-[#434654] tracking-[0.24px] mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <Toggle checked={toggles[item.key]} onChange={() => toggle(item.key)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Account & Support */}
        <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheckIcon className="w-4 h-5 text-[#1550D3]" />
            <h2 className="text-xl font-medium text-[#191B23] tracking-[-0.2px]">Account &amp; Support</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {supportLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    link.danger
                      ? 'bg-[#BA1A1A]/5 border-[#BA1A1A]/20 text-[#BA1A1A]'
                      : 'border-[#C3C5D7]/20 text-[#191B23] hover:border-[#C3C5D7]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-5 ${link.danger ? 'text-[#BA1A1A]' : 'text-[#434654]'}`} />
                    <span className={`text-base ${link.danger ? 'font-bold' : ''}`}>{link.label}</span>
                  </div>
                  {link.danger ? null : <ChevronRight className="w-[7px] h-3 text-[#434654]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 px-4 py-4 bg-[#FAF8FF]/80 backdrop-blur-sm border border-[#C3C5D7]/30 rounded-2xl shadow-lg">
        <button className="px-6 py-2.5 text-base text-[#434654] rounded-lg hover:bg-[#FAF8FF] transition-colors">
          Discard Changes
        </button>
        <button className="px-8 py-2.5 text-base text-white bg-[#1550D3] rounded-lg shadow-[0px_4px_6px_-1px_rgba(21,80,211,0.2),0px_2px_4px_-2px_rgba(21,80,211,0.2)] hover:bg-[#1550D3]/90 transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
