import { Store, Package, KeyRound, Bell } from 'lucide-react';
import adminI18n from '../../../i18n/admin/adminI18n';

export default function QuickActionsPanel({ onNavigate }) {
  const { t } = adminI18n;

  const actions = [
    { icon: Store, label: t('admin.dashboard.addStore'), page: 'stores' },
    { icon: Package, label: t('admin.dashboard.addProduct'), page: 'products' },
    { icon: KeyRound, label: t('admin.dashboard.apiKey'), page: 'api' },
    { icon: Bell, label: t('admin.dashboard.notifyUsers'), page: 'notifications' },
  ];

  return (
    <div className="flex-1 bg-admin-brand rounded-panel p-6 flex flex-col gap-4">
      <h3 className="text-xl font-medium text-white tracking-[-0.2px]">{t('admin.dashboard.quickActions')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, page }) => (
          <button
            key={label}
            onClick={() => onNavigate?.(page)}
            className="flex flex-col items-center justify-center gap-2 py-5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-xs font-medium border border-white/10"
            style={{ letterSpacing: '0.24px' }}
          >
            <Icon className="w-5 h-5 text-white" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
