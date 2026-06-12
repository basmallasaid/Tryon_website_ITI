import { Bell, Smartphone, Shirt, RefreshCw, Store, Tag, Info } from 'lucide-react';

const typeConfig = {
  tryon: { icon: Shirt, bg: 'bg-admin-brand/10', color: 'text-admin-brand', label: 'Try-On' },
  recycle: { icon: RefreshCw, bg: 'bg-admin-amber/10', color: 'text-admin-amber', label: 'Recycle' },
  store: { icon: Store, bg: 'bg-admin-success/10', color: 'text-admin-success', label: 'Store' },
  pricing: { icon: Tag, bg: 'bg-admin-danger/10', color: 'text-admin-danger', label: 'Pricing' },
  general: { icon: Info, bg: 'bg-admin-border/20', color: 'text-admin-text-secondary', label: 'General' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationRow({ notification }) {
  const config = typeConfig[notification.type] || typeConfig.general;
  const Icon = config.icon;

  return (
    <tr className="border-b border-admin-border/40 hover:bg-admin-brand-activeBg/30 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm font-bold text-admin-text-primary">{notification.title}</p>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-admin-text-secondary line-clamp-1 max-w-xs">{notification.body}</p>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          </div>
          <span className="text-xs font-semibold text-admin-text-primary">{config.label}</span>
        </div>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-admin-text-secondary">{formatDate(notification.createdAt)}</p>
      </td>
    </tr>
  );
}
