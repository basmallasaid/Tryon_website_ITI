import { Store, Package, KeyRound, Bell } from 'lucide-react';

const actions = [
  { icon: Store, label: 'Add Store' },
  { icon: Package, label: 'Add Product' },
  { icon: KeyRound, label: 'API Key' },
  { icon: Bell, label: 'Notify Users' },
];

export default function QuickActionsPanel() {
  return (
    <div className="flex-1 bg-admin-brand-light rounded-panel p-6 flex flex-col gap-4">
      <h3 className="text-xl font-medium text-white tracking-[-0.2px]">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center gap-2 py-5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-xs font-medium"
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
