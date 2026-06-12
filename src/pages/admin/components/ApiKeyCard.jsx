import { Trash2, Eye, Copy } from 'lucide-react';
import EditIcon from '../../../icons/EditIcon';

function ApiKeyStatusBadge({ status }) {
  const colorMap = {
    Active: 'bg-admin-success/10 text-admin-success',
    Inactive: 'bg-admin-danger/10 text-admin-danger',
    Expired: 'bg-admin-amber/10 text-admin-amber',
  };

  return (
    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${colorMap[status] || 'bg-admin-border/20 text-admin-text-muted'}`}>
      {status}
    </span>
  );
}

export default function ApiKeyCard({ name, icon: Icon, iconBg, iconColor, status, maskedKey, onEdit, onDelete, onView, onCopy }) {
  return (
    <div className="bg-white rounded-xl border border-admin-border/40 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor || 'text-admin-text-secondary'}`} />
          </div>
          <span className="text-sm font-medium text-admin-text-primary truncate">{name}</span>
          <ApiKeyStatusBadge status={status} />
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary"
            title="Edit key"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary"
            title="Delete key"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-admin-input rounded-xl px-4 py-2.5">
        <span className="text-sm font-mono tracking-wider text-admin-text-secondary">{maskedKey}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onView}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary"
            title="View full key"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onCopy}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary"
            title="Copy key"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
