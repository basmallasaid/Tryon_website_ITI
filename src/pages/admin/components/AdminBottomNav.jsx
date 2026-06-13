import { useState, useEffect } from 'react';
import { LayoutDashboard, Store, Package, Bell, Menu, Mail, Users, KeyRound, Settings, X, ChevronRight } from 'lucide-react';
import adminI18n from '../../../i18n/admin/adminI18n';

export default function AdminBottomNav({ className = '', activePage, setActivePage }) {
  const [showMore, setShowMore] = useState(false);
  const { t } = adminI18n;

  const tabs = [
    { id: 'dashboard', label: t('admin.sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'stores', label: t('admin.sidebar.stores'), icon: Store },
    { id: 'products', label: t('admin.sidebar.products'), icon: Package },
    { id: 'notifications', label: t('admin.sidebar.notifications'), icon: Bell },
    { id: 'more', label: 'More', icon: Menu },
  ];

  const moreItems = [
    { id: 'emailCenter', label: t('admin.sidebar.emailCenter'), icon: Mail },
    { id: 'users', label: t('admin.sidebar.users'), icon: Users },
    { id: 'apiManagement', label: t('admin.sidebar.apiManagement'), icon: KeyRound },
    { id: 'settings', label: t('admin.sidebar.settings'), icon: Settings },
  ];

  useEffect(() => {
    document.body.style.overflow = showMore ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showMore]);

  const handleSelect = (id) => {
    setActivePage(id);
    setShowMore(false);
  };

  return (
    <>
      {/* Sidebar overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${showMore ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMore(false)}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300`} />
        <div
          className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${showMore ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-admin-border">
            <h3 className="text-base font-bold text-admin-text-primary">More Sections</h3>
            <button onClick={() => setShowMore(false)} className="p-2 rounded-xl hover:bg-admin-border/20 transition-colors">
              <X className="w-5 h-5 text-admin-text-muted" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto py-2">
            {moreItems.map(({ id, label, icon: Icon }) => {
              const isActive = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 transition-colors ${
                    isActive ? 'bg-admin-brand/10 text-admin-brand' : 'text-admin-text-primary hover:bg-admin-brand-bg'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-left">{label}</span>
                  <ChevronRight className="w-4 h-4 text-admin-text-muted/50 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-admin-border">
            <button onClick={() => setShowMore(false)} className="w-full py-2.5 bg-admin-brand-bg rounded-xl text-sm font-medium text-admin-text-secondary hover:bg-admin-border/20 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className={`${className} flex justify-center items-center bg-admin-brand-bg border-t border-admin-border h-[72px] pt-2`}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === 'more' ? showMore : activePage === id;
          return (
            <button
              key={id}
              onClick={() => id === 'more' ? setShowMore(!showMore) : setActivePage(id)}
              className={`flex flex-col items-center justify-center w-[74.8px] relative ${
                isActive ? 'text-admin-brand' : 'text-admin-text-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-normal leading-[15px] mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
