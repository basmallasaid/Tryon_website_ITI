import { Bell, Smartphone } from 'lucide-react';

const typeConfig = {
  Push: {
    icon: Bell,
    bg: 'bg-admin-brand/10',
    color: 'text-admin-brand',
  },
  'In-App': {
    icon: Smartphone,
    bg: 'bg-admin-success/10',
    color: 'text-admin-success',
  },
};

export default function NotificationRow({ notification }) {
  const config = typeConfig[notification.type] || typeConfig['Push'];
  const Icon = config.icon;

  return (
    <tr className="border-b border-admin-border/40 hover:bg-admin-brand-activeBg/30 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm font-bold text-admin-text-primary">{notification.title}</p>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-admin-text-secondary line-clamp-1 max-w-xs">{notification.message}</p>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          </div>
          <span className="text-xs font-semibold text-admin-text-primary">{notification.type}</span>
        </div>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-admin-text-secondary">{notification.date}</p>
      </td>
    </tr>
  );
}
