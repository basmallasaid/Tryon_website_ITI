import { ArrowLeft, Printer, MoreVertical, Star, Paperclip, Send, Trash2 } from 'lucide-react';

export default function EmailDetailDesktop({ email, thread, loadingThread, replyText, onReplyTextChange, onSendReply, sending, onBack, onMarkRead, onDelete }) {
  const root = thread?.root;
  const replies = thread?.replies || [];
  const senderName = root?.senderUserId?.profile?.first_name
    ? `${root.senderUserId.profile.first_name} ${root.senderUserId.profile.last_name || ''}`.trim()
    : email?.sender || 'Unknown';
  const senderEmail = root?.senderEmail || email?.email || '';
  const subject = root?.subject || email?.subject || '';
  const body = root?.message || email?.body || '';
  const dateStr = root?.created_at ? new Date(root.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : email?.date || '';
  const timeStr = root?.created_at ? new Date(root.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : email?.timeDetail || '';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
          </button>
          <h1 className="text-[20px] font-bold text-admin-text-primary">Message Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkRead}
            className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-xs font-medium text-admin-text-primary hover:bg-admin-border/10 transition-colors"
          >
            {email?.unread ? 'Mark as Read' : 'Mark as Unread'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-xs font-medium text-admin-text-primary hover:bg-admin-border/10 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {loadingThread ? (
        <div className="py-16 text-center text-sm text-admin-text-muted">Loading thread...</div>
      ) : (
        <>
          {/* Root Message */}
          <div className="bg-white border border-admin-border/40 rounded-xl shadow-sm mb-6">
            <div className="p-6 border-b border-admin-border/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-admin-brand/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-admin-brand">{email?.initials || '??'}</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-admin-text-primary">{senderName}</p>
                    <p className="text-sm text-admin-text-muted">{senderEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-admin-text-secondary">{dateStr}</p>
                  <p className="text-xs text-admin-text-muted">{timeStr}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-admin-brand-bg/50 border-b border-admin-border/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-admin-brand">{subject}</span>
                {email?.tag && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-admin-success/20 text-admin-success rounded-full">
                    {email.tag}
                  </span>
                )}
              </div>
              <Star className={`w-5 h-5 ${email?.starred ? 'fill-admin-brand text-admin-brand' : 'text-admin-text-muted'}`} />
            </div>

            <div className="p-8">
              <div className="space-y-4 text-sm text-admin-text-primary leading-relaxed whitespace-pre-wrap">
                {body}
              </div>
            </div>
          </div>

          {/* Thread Replies */}
          {replies.length > 0 && (
            <div className="mb-6 space-y-4">
              <p className="text-xs font-bold text-admin-text-muted uppercase tracking-wider">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</p>
              {replies.map((reply) => {
                const replyName = reply.senderUserId?.profile?.first_name
                  ? `${reply.senderUserId.profile.first_name} ${reply.senderUserId.profile.last_name || ''}`.trim()
                  : reply.senderEmail;
                const isFromAdmin = reply.emailType === 'ADMIN_TO_USER';
                return (
                  <div key={reply._id} className={`bg-white border rounded-xl shadow-sm ${isFromAdmin ? 'border-admin-brand/30 ml-4' : 'border-admin-border/40'}`}>
                    <div className="p-4 border-b border-admin-border/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFromAdmin ? 'bg-admin-brand text-white' : 'bg-admin-brand/20 text-admin-brand'}`}>
                          <span className="text-xs font-bold">{getInitials(replyName)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-admin-text-primary">{replyName}</p>
                          <p className="text-[11px] text-admin-text-muted">{reply.senderEmail}</p>
                        </div>
                        {isFromAdmin && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-admin-brand/10 text-admin-brand rounded">Admin</span>
                        )}
                      </div>
                      <span className="text-[11px] text-admin-text-muted">
                        {new Date(reply.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-admin-text-primary leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compose Reply */}
          <div className="bg-white border border-admin-border/40 rounded-xl shadow-sm">
            <div className="p-4 bg-admin-brand-bg/50 border-b border-admin-border/30 flex items-center gap-2">
              <svg className="w-4 h-4 text-admin-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 17l-5-5 5-5" />
                <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
              </svg>
              <span className="text-base font-bold text-admin-text-primary">Compose Reply</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-admin-text-muted mb-1">To</label>
                  <input
                    type="text"
                    value={senderEmail}
                    readOnly
                    className="w-full px-4 py-2.5 bg-admin-brand-bg/30 border border-admin-border/40 rounded-lg text-sm text-admin-text-secondary cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-muted mb-1">Subject</label>
                  <input
                    type="text"
                    value={`Re: ${subject}`}
                    readOnly
                    className="w-full px-4 py-2.5 bg-admin-brand-bg/30 border border-admin-border/40 rounded-lg text-sm text-admin-text-secondary cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-muted mb-1">Message Body</label>
                <textarea
                  rows={8}
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full px-4 py-3 bg-white border border-admin-border/40 rounded-xl text-sm text-admin-text-primary outline-none resize-none focus:border-admin-brand transition-colors placeholder:text-admin-text-muted"
                />
              </div>
            </div>

            <div className="p-4 bg-admin-brand-bg/30 border-t border-admin-border/30 flex items-center justify-end gap-3">
              <button
                onClick={() => onReplyTextChange('')}
                className="px-6 py-2.5 border border-admin-border rounded-xl text-xs font-bold text-admin-text-primary hover:bg-admin-border/10 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={onSendReply}
                disabled={!replyText.trim() || sending}
                className="flex items-center gap-2 px-6 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-bold shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50"
              >
                {sending ? 'Sending...' : <>Send Reply <Send className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}
