import { Bell, Mail, Moon, Search } from 'lucide-react';

export default function AdminMobileHeader({ className = '' }) {
  return (
    <div className={`${className} sticky top-0 z-10 bg-[rgba(250,248,255,0.8)] backdrop-blur-md shadow-sm pt-6 h-[186px]`}>
      <div className="flex justify-between items-center px-4 h-16">
        <div className="w-[160px] h-[37px] flex items-center">
          <span className="text-xl font-bold text-admin-brand">Redolapy</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-admin-text-secondary">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-admin-text-secondary">
            <Mail className="w-5 h-5" />
          </button>
          <button className="p-2 text-admin-text-secondary">
            <Moon className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-admin-brand-light flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="w-full h-[54px] flex items-center gap-2 bg-admin-input border border-admin-border rounded-2xl px-4">
          <Search className="w-[13.5px] h-[13.5px] text-admin-text-secondary" />
          <input
            type="text"
            placeholder="Search global database..."
            className="flex-1 bg-transparent text-sm font-normal text-admin-text-muted outline-none placeholder:text-admin-text-muted"
          />
        </div>
      </div>
    </div>
  );
}
