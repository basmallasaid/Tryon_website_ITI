import { LayoutDashboard, Store, Package, Tag, Bell, Mail, Users, KeyRound, Settings } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'emailCenter', label: 'Email Center', icon: Mail },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'apiManagement', label: 'API Management', icon: KeyRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ className = '', activePage, setActivePage }) {
  return (
    <div className={`${className} flex-col justify-between fixed left-0 top-0 h-screen w-[280px] bg-admin-sidebar border-r border-admin-border py-6`}>
      <div>
        <div className="px-6 pb-8 text-center">
          <div className="w-[231px] h-[78px] mx-auto flex items-center justify-center">
            <span className="text-2xl font-bold text-admin-brand">Redolapy</span>
          </div>
          <p className="text-xs font-medium text-admin-text-secondary mt-1" style={{ letterSpacing: '0.24px' }}>Global Admin</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-admin-brand-activeBg border-l-4 border-admin-brand text-admin-brand'
                    : 'text-admin-text-secondary hover:bg-admin-brand-activeBg'
                }`}
                style={{ letterSpacing: '0.24px' }}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mx-4 bg-admin-profile rounded-xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-admin-brand/20 bg-admin-brand-light flex items-center justify-center text-xs font-bold text-white">
          AD
        </div>
        <div>
          <p className="text-xs font-bold text-admin-text-primary" style={{ letterSpacing: '0.24px' }}>Admin User</p>
          <p className="text-[10px] font-normal text-admin-text-secondary uppercase" style={{ letterSpacing: '0.5px' }}>Administrator</p>
        </div>
      </div>
    </div>
  );
}
