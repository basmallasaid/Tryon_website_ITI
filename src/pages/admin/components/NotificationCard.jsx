import { ChevronRight } from 'lucide-react';

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const typeLabels = {
  tryon: 'Try-On',
  recycle: 'Recycle',
  store: 'Store',
  pricing: 'Pricing',
  general: 'General',
};

export default function NotificationCard({ notification }) {
  return (
    <div className={`flex items-center gap-3 p-4 border-b border-admin-border/30 transition-colors ${notification.read ? 'opacity-50' : ''}`}>
      <div className="shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${notification.read ? 'bg-admin-border' : 'bg-admin-brand'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-admin-text-primary truncate">{notification.title}</p>
          <span className="text-[11px] text-admin-text-muted whitespace-nowrap">{formatRelativeTime(notification.createdAt)}</span>
        </div>
        <p className="text-xs text-admin-text-secondary mt-1 line-clamp-2">{notification.body}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-admin-brand/10 text-admin-brand rounded">
            {typeLabels[notification.type] || notification.type}
          </span>
          <span className="text-[11px] text-admin-text-muted">{formatDate(notification.createdAt)}</span>
        </div>
      </div>

      <div className="shrink-0">
        <ChevronRight className="w-4 h-4 text-admin-text-muted" />
      </div>
    </div>
  );
}
