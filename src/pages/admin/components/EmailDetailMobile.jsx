import { ArrowLeft, Bell, Paperclip, Send } from 'lucide-react';

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const avatarColors = [
  'bg-admin-brand text-white',
  'bg-admin-success text-white',
  'bg-admin-amber text-white',
  'bg-admin-text-primary text-white',
];

function getAvatarColor(initials) {
  if (!initials) return avatarColors[0];
  const code = initials.charCodeAt(0) % avatarColors.length;
  return avatarColors[code];
}

export default function EmailDetailMobile({ email, thread, loadingThread, replyText, onReplyTextChange, onSendReply, sending, onBack, onMarkRead }) {
  const root = thread?.root;
  const replies = thread?.replies || [];
  const senderName = root?.senderUserId?.profile?.first_name
    ? `${root.senderUserId.profile.first_name} ${root.senderUserId.profile.last_name || ''}`.trim()
    : email?.sender || 'Unknown';
  const senderEmail = root?.senderEmail || email?.email || '';
  const subject = root?.subject || email?.subject || '';
  const body = root?.message || email?.body || '';
  const colorClass = getAvatarColor(email?.initials);

  return (
    <div className="lg:hidden min-h-screen bg-admin-brand-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-admin-brand-bg border-b border-admin-border/30">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-admin-brand" />
          </button>
          <h1 className="text-lg font-bold text-admin-brand">Email Center</h1>
          <button onClick={onMarkRead} className="p-1">
            <Bell className={`w-5 h-5 ${email?.unread ? 'text-admin-brand' : 'text-admin-text-muted'}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingThread ? (
          <p className="text-center text-sm text-admin-text-muted py-8">Loading thread...</p>
        ) : (
          <>
            {/* Sender Info */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
                <span className="text-sm font-bold">{email?.initials || '??'}</span>
              </div>
              <div>
                <p className="text-base font-bold text-admin-text-primary">{senderName}</p>
                <p className="text-sm text-admin-text-muted">{senderEmail}</p>
              </div>
            </div>

            {/* Root Message */}
            <div className="bg-admin-surface border border-admin-border/40 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-bold bg-admin-brand/10 text-admin-brand rounded">
                  {email?.tag || 'Message'}
                </span>
                <span className="text-xs text-admin-text-muted">{email?.time || ''}</span>
              </div>
              <p className="text-sm font-semibold text-admin-brand mb-3">{subject}</p>
              <div className="space-y-3 text-sm text-admin-text-primary leading-relaxed whitespace-pre-wrap">
                {body}
              </div>
            </div>

            {/* Thread Replies */}
            {replies.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-admin-text-muted uppercase tracking-wider px-1">
                  {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                </p>
                {replies.map((reply) => {
                  const replyName = reply.senderUserId?.profile?.first_name
                    ? `${reply.senderUserId.profile.first_name} ${reply.senderUserId.profile.last_name || ''}`.trim()
                    : reply.senderEmail;
                  const isFromAdmin = reply.emailType === 'ADMIN_TO_USER';
                  return (
                    <div key={reply._id} className={`border-l-4 ${isFromAdmin ? 'border-admin-brand bg-admin-brand-bg/50' : 'border-admin-border bg-admin-surface'} rounded-r-lg p-3`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-admin-text-primary">{replyName}</span>
                          {isFromAdmin && (
                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase bg-admin-brand/10 text-admin-brand rounded">Admin</span>
                          )}
                        </div>
                        <span className="text-[10px] text-admin-text-muted">
                          {new Date(reply.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-admin-text-primary leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reply Area */}
            <div className="bg-admin-surface border border-admin-border/40 rounded-xl overflow-hidden shadow-sm">
              <textarea
                rows={6}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-4 py-4 bg-admin-brand-bg text-sm text-admin-text-primary outline-none resize-none placeholder:text-admin-text-muted"
              />
              <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-admin-border/30">
                <button className="p-1.5 text-admin-text-muted hover:text-admin-text-primary transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={onSendReply}
              disabled={!replyText.trim() || sending}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-admin-brand text-white rounded-xl text-base font-bold shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" /> {sending ? 'Sending...' : 'Send Reply'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
