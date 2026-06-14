import { Store, Package, KeyRound, Bell } from 'lucide-react';
import adminI18n from '../../../i18n/admin/adminI18n';

export default function QuickActionsPanel() {
  const { t } = adminI18n;

  const actions = [
    { icon: Store, label: t('admin.dashboard.addStore') },
    { icon: Package, label: t('admin.dashboard.addProduct') },
    { icon: KeyRound, label: t('admin.dashboard.apiKey') },
    { icon: Bell, label: t('admin.dashboard.notifyUsers') },
  ];

  return (
    <div className="flex-1 bg-admin-brand-light rounded-panel p-6 flex flex-col gap-4">
      <h3 className="text-xl font-medium text-white tracking-[-0.2px]">{t('admin.dashboard.quickActions')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center gap-2 py-5 bg-surface-elevated/10 rounded-lg hover:bg-surface-elevated/20 transition-colors text-white text-xs font-medium"
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
