import { LayoutDashboard, Store, Package, Bell, Mail, Users, KeyRound, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAdminTranslation } from '../../../i18n/admin/useAdminTranslation';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%231550D3'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' font-weight='bold' fill='white'%3EAdmin%3C/text%3E%3C/svg%3E";

export default function AdminSidebar({ className = '', activePage, setActivePage, unreadContacts = 0 }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, i18n } = useAdminTranslation();
  const isRTL = i18n.language === 'ar';

  const profile = user?.profile || user?.user?.profile;
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || user?.name || user?.email || 'Admin';
  const initials = fullName
    ? fullName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : displayName.slice(0, 2).toUpperCase();
  const avatar = profile?.avatar || user?.userImage || null;

  const navItems = [
    { id: 'dashboard', label: t('admin.sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'stores', label: t('admin.sidebar.stores'), icon: Store },
    { id: 'products', label: t('admin.sidebar.products'), icon: Package },
    { id: 'notifications', label: t('admin.sidebar.notifications'), icon: Bell },
    { id: 'emailCenter', label: t('admin.sidebar.emailCenter'), icon: Mail },
    { id: 'users', label: t('admin.sidebar.users'), icon: Users },
    { id: 'apiManagement', label: t('admin.sidebar.apiManagement'), icon: KeyRound },
    { id: 'settings', label: t('admin.sidebar.settings'), icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={`${className} flex-col justify-between fixed top-0 h-screen w-[280px] bg-admin-sidebar py-6 ${isRTL ? 'right-0 border-l border-admin-border' : 'left-0 border-r border-admin-border'}`}>
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
            const count = id === 'emailCenter' ? unreadContacts : 0;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? `bg-admin-brand-activeBg text-admin-brand ${isRTL ? 'border-r-4 border-admin-brand' : 'border-l-4 border-admin-brand'}`
                    : 'text-admin-text-secondary hover:bg-admin-brand-activeBg'
                }`}
                style={{ letterSpacing: '0.24px' }}
              >
                <div className="relative">
                  <Icon className="w-[18px] h-[18px]" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-admin-danger text-white text-[9px] font-bold">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mx-4 flex flex-col gap-2">
        <div className="bg-admin-profile rounded-xl p-3 flex items-center gap-3">
          <img
            src={avatar || DEFAULT_AVATAR}
            alt={displayName}
            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            className="w-10 h-10 rounded-full border-2 border-admin-brand/20 object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-admin-text-primary truncate" style={{ letterSpacing: '0.24px' }}>{displayName}</p>
            <p className="text-[10px] font-normal text-admin-text-secondary uppercase" style={{ letterSpacing: '0.5px' }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-admin-text-secondary hover:bg-admin-brand-activeBg hover:text-accent-orange transition-colors cursor-pointer"
          style={{ letterSpacing: '0.24px' }}
        >
          <LogOut className="w-[18px] h-[18px]" />
          {t('admin.settings.logOut')}
        </button>
      </div>
    </div>
  );
}
