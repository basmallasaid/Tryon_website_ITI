import { Star } from 'lucide-react';

const avatarColors = {
  JS: 'bg-admin-brand text-white',
  MK: 'bg-admin-success text-white',
  AL: 'bg-admin-border/40 text-admin-text-secondary',
  EB: 'bg-admin-border/40 text-admin-text-secondary',
  TH: 'bg-admin-border/40 text-admin-text-secondary',
  SR: 'bg-admin-border/40 text-admin-text-secondary',
};

export default function EmailCard({ email, onSelect }) {
  const colorClass = avatarColors[email.initials] || 'bg-admin-border/40 text-admin-text-secondary';

  return (
    <div
      className={`flex items-start gap-4 p-4 border-b border-admin-border/20 cursor-pointer transition-colors ${email.unread ? 'bg-admin-brand-bg/30' : ''}`}
      onClick={() => onSelect(email)}
    >
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
        <span className="text-sm font-bold">{email.initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-base ${email.unread ? 'font-bold text-admin-text-primary' : 'text-admin-text-primary'}`}>
            {email.sender}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs ${email.unread ? 'font-bold text-admin-brand' : 'text-admin-text-muted'}`}>
              {email.time}
            </span>
            {email.unread && <div className="w-2.5 h-2.5 rounded-full bg-admin-brand" />}
          </div>
        </div>
        <p className={`text-sm mt-0.5 ${email.unread ? 'font-semibold text-admin-text-primary' : 'text-admin-text-primary'}`}>
          {email.subject}
        </p>
        <p className="text-xs text-admin-text-muted mt-1 line-clamp-2">{email.preview}</p>
      </div>
    </div>
  );
}
