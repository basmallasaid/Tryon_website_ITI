import { Bell, Mail, Moon, ChevronDown } from 'lucide-react';

export default function AdminTopBar({ className = '', actions, unreadContacts = 0 }) {
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
        <button className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <div className="w-px h-8 bg-admin-border" />
        <div className="w-8 h-8 rounded-full bg-admin-brand-light flex items-center justify-center text-xs font-bold text-white">
          AD
        </div>
        <ChevronDown className="w-3 text-admin-text-secondary" />
      </div>
    </div>
  );
}
