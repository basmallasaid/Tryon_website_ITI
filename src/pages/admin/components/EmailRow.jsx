import { Star } from 'lucide-react';

const avatarColors = {
  JD: 'bg-admin-brand/20 text-admin-brand',
  MK: 'bg-admin-success/20 text-admin-success',
  ER: 'bg-admin-amber/20 text-admin-amber',
  TH: 'bg-admin-border/30 text-admin-text-secondary',
};

export default function EmailRow({ email, onSelect }) {
  const colorClass = avatarColors[email.initials] || 'bg-admin-border/30 text-admin-text-secondary';

  return (
    <tr
      className={`border-b border-admin-border/30 hover:bg-admin-brand-activeBg/30 transition-colors cursor-pointer ${email.unread ? 'bg-admin-brand-bg/50' : ''}`}
      onClick={() => onSelect(email)}
    >
      <td className="py-3 px-4 w-12">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-admin-border accent-admin-brand"
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
            <span className="text-xs font-bold">{email.initials}</span>
          </div>
          <span className={`text-sm ${email.unread ? 'font-bold text-admin-text-primary' : 'text-admin-text-primary'}`}>
            {email.sender}
          </span>
        </div>
      </td>

      <td className="py-3 px-4">
        <div className="max-w-md">
          <p className={`text-sm ${email.unread ? 'font-bold text-admin-text-primary' : 'text-admin-text-primary'}`}>
            {email.subject}
          </p>
          <p className="text-xs text-admin-text-muted truncate mt-0.5">{email.preview}</p>
        </div>
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs ${email.unread ? 'font-bold text-admin-brand' : 'text-admin-text-muted'}`}>
            {email.time}
          </span>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-admin-text-muted hover:text-admin-brand transition-colors"
          >
            <Star className={`w-4 h-4 ${email.starred ? 'fill-admin-brand text-admin-brand' : ''}`} />
          </button>
        </div>
      </td>
    </tr>
  );
}
