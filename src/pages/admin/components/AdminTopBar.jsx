import { Bell, Mail, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdminDarkMode } from '../context/AdminDarkModeContext';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%231550D3'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' font-weight='bold' fill='white'%3EAdmin%3C/text%3E%3C/svg%3E";

export default function AdminTopBar({ className = '', actions, unreadContacts = 0 }) {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useAdminDarkMode();
  const profile = user?.profile || user?.user?.profile;
  const avatar = profile?.avatar || user?.userImage || null;

  return (
    <div className={`${className} items-center justify-end px-6 pt-3 pb-1`}>
      <div className="flex items-center gap-4">
        {actions}

        <button className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors relative">
          <Mail className="w-5 h-5" />
          {unreadContacts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-admin-danger text-white text-[9px] font-bold">
              {unreadContacts > 99 ? '99+' : unreadContacts}
            </span>
          )}
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors"
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-px h-8 bg-admin-border" />
        <img
          src={avatar || DEFAULT_AVATAR}
          alt="Admin"
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          className="w-8 h-8 rounded-full object-cover"
        />
        <ChevronDown className="w-3 text-admin-text-secondary" />
      </div>
    </div>
  );
}
