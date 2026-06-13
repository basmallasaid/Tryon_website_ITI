import { Bell, Mail, Moon } from 'lucide-react';

export default function AdminMobileHeader({ className = '', unreadContacts = 0 }) {
  return (
    <div className={`${className} sticky top-0 z-10 bg-[rgba(250,248,255,0.8)] backdrop-blur-md shadow-sm pt-1`}>
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
          <button className="p-2 text-admin-text-secondary">
            <Moon className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-admin-brand-light flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
        </div>
      </div>
    </div>
  );
}
