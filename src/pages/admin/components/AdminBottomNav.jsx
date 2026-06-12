import { LayoutDashboard, Store, Package, Bell, Menu } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'notifications', label: 'Notification', icon: Bell },
  { id: 'more', label: 'More', icon: Menu },
];

export default function AdminBottomNav({ className = '', activePage, setActivePage }) {
  return (
    <div className={`${className} flex justify-center items-center bg-admin-brand-bg border-t border-admin-border h-[72px] pt-2`}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex flex-col items-center justify-center w-[74.8px] ${
              isActive ? 'text-admin-brand' : 'text-admin-text-secondary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-normal leading-[15px] mt-0.5">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
