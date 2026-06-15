import { Bell, Mail, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdminDarkMode } from '../context/AdminDarkModeContext';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%231550D3'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' font-weight='bold' fill='white'%3EAdmin%3C/text%3E%3C/svg%3E";

export default function AdminMobileHeader({ className = '', unreadContacts = 0 }) {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useAdminDarkMode();
  const profile = user?.profile || user?.user?.profile;
  const avatar = profile?.avatar || user?.userImage || null;

  return (
    <div className={`${className} sticky top-0 z-10 bg-admin-brand-bg/80 backdrop-blur-md shadow-sm pt-1`}>
      <div className="flex justify-between items-center px-4 h-10">
        <div className="w-[160px] h-[37px] flex items-center">
          <span className="text-xl font-bold text-admin-brand">Redolapy</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-admin-text-secondary">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-admin-text-secondary relative">
            <Mail className="w-5 h-5" />
            {unreadContacts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-admin-danger text-white text-[9px] font-bold">
                {unreadContacts > 99 ? '99+' : unreadContacts}
              </span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-admin-text-secondary"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <img
            src={avatar || DEFAULT_AVATAR}
            alt="Admin"
            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
