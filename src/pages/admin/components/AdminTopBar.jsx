import { Search, Bell, Mail, Moon, ChevronDown } from 'lucide-react';

export default function AdminTopBar({ className = '' }) {
  return (
    <div className={`${className} items-center justify-between px-6 pt-10 pb-4`}>
      <div className="w-[412px] h-[54px] flex items-center gap-2 bg-admin-input border border-admin-border rounded-2xl px-4">
        <Search className="w-[13.5px] h-[13.5px] text-admin-text-secondary" />
        <input
          type="text"
          placeholder="Search global database..."
          className="flex-1 bg-transparent text-sm font-normal text-admin-text-muted outline-none placeholder:text-admin-text-muted"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
          <Mail className="w-5 h-5" />
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
