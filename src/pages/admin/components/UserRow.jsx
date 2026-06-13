import { Shirt, RefreshCw, Plus, Trash2 } from 'lucide-react';
import QuotaBar from './QuotaBar';

const statusStyles = {
  Active: 'bg-[rgba(142,211,33,0.1)] text-[#5A8A10]',
  Inactive: 'bg-[#FFE2E2] text-[#FB2C36]',
};

const roleStyles = {
  Admin: { bg: 'rgba(239,68,68,0.082)', color: '#EF4444' },
  Premium: { bg: 'rgba(139,92,246,0.082)', color: '#8B5CF6' },
  User: { bg: 'rgba(107,114,128,0.082)', color: '#6B7280' },
};

export default function UserRow({ user, mobile }) {
  const roleStyle = roleStyles[user.role] || roleStyles.User;

  if (mobile) {
    return (
      <div className="bg-white rounded-xl border border-admin-border/40 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: user.avatarBg }}
            >
              <span className="text-xs font-bold text-white">{user.initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1E1E24] leading-5 truncate">{user.name}</p>
              <p className="text-xs text-[#99A1AF] leading-4 truncate">{user.email}</p>
            </div>
          </div>
          <span
            className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[user.status] || 'bg-admin-border/20 text-admin-text-muted'}`}
          >
            {user.status}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <span
            className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full"
            style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
          >
            {user.role}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <QuotaBar
            icon={Shirt}
            iconColor="text-brand-secondary"
            used={user.tryOn.used}
            total={user.tryOn.total}
            barColor="bg-brand-secondary"
          />
          <QuotaBar
            icon={RefreshCw}
            iconColor="text-[#2B7FFF]"
            used={user.recycling.used}
            total={user.recycling.total}
            barColor="bg-[#3B82F6]"
          />
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-[#F9FAFB] hover:bg-admin-brand-activeBg/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: user.avatarBg }}
          >
            <span className="text-xs font-bold text-white">{user.initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1E1E24] leading-5 truncate">{user.name}</p>
            <p className="text-xs text-[#99A1AF] leading-4 truncate">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span
          className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
          style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
        >
          {user.role}
        </span>
      </td>

      <td className="py-3 px-4">
        <QuotaBar
          icon={Shirt}
          iconColor="text-brand-secondary"
          used={user.tryOn.used}
          total={user.tryOn.total}
          barColor="bg-brand-secondary"
        />
      </td>

      <td className="py-3 px-4">
        <QuotaBar
          icon={RefreshCw}
          iconColor="text-[#2B7FFF]"
          used={user.recycling.used}
          total={user.recycling.total}
          barColor="bg-[#3B82F6]"
        />
      </td>

      <td className="py-3 px-4">
        <span
          className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[user.status] || 'bg-admin-border/20 text-admin-text-muted'}`}
        >
          {user.status}
        </span>
      </td>
    </tr>
  );
}
