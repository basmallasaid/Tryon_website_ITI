import { ArrowLeft, Bell, Paperclip, Smile, Send } from 'lucide-react';

const avatarColors = {
  JV: 'bg-admin-text-primary text-white',
  JS: 'bg-admin-brand text-white',
  MK: 'bg-admin-success text-white',
};

export default function EmailDetailMobile({ email, onBack, onMarkRead, onDelete }) {
  const colorClass = avatarColors[email?.initials] || 'bg-admin-text-primary text-white';

  return (
    <div className="lg:hidden min-h-screen bg-admin-brand-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-admin-brand-bg border-b border-admin-border/30">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-admin-brand" />
          </button>
          <h1 className="text-lg font-bold text-admin-brand">Email Center</h1>
          <button className="p-1">
            <Bell className="w-5 h-5 text-admin-brand" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sender Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
            <span className="text-sm font-bold">{email?.initials || 'JV'}</span>
          </div>
          <div>
            <p className="text-base font-bold text-admin-text-primary">{email?.sender || 'Julian Vance'}</p>
            <p className="text-sm text-admin-text-muted">{email?.to || 'To: logistics@dolapy.com'}</p>
          </div>
        </div>

        {/* Message Card */}
        <div className="bg-white border border-admin-border/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 text-xs font-bold bg-admin-brand/10 text-admin-brand rounded">
              {email?.tag || 'Shipment Update'}
            </span>
            <span className="text-xs text-admin-text-muted">{email?.time || '10:42 AM'}</span>
          </div>
          <div className="space-y-3 text-sm text-admin-text-primary leading-relaxed">
            <p>Hello Team,</p>
            <p>
              {email?.body || "We noticed a slight delay in the Q3 inventory arrival for the Luxury Capsule collection. Could you confirm if the logistics hub in Milan has cleared the latest customs batch?"}
            </p>
            <p>
              {email?.body2 || "Our retail directors are requesting an updated timeline for the storefront launch."}
            </p>
          </div>
        </div>

        {/* Thread Connector */}
        <div className="flex justify-center">
          <div className="w-px h-4 bg-admin-border/40" />
        </div>

        {/* Previous Reply */}
        <div className="border-l-4 border-admin-brand bg-admin-brand-bg/50 rounded-r-lg p-3 opacity-75">
          <p className="text-sm text-admin-text-muted italic">
            "{email?.previousReply || 'Initial check shows batch #4401 is pending clearance...'}"
          </p>
        </div>

        {/* Reply Area */}
        <div className="bg-white border border-admin-border/40 rounded-xl overflow-hidden shadow-sm">
          <textarea
            rows={6}
            placeholder="Type your reply..."
            className="w-full px-4 py-4 bg-admin-brand-bg text-sm text-admin-text-primary outline-none resize-none placeholder:text-admin-text-muted"
          />
          <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-admin-border/30">
            <button className="p-1.5 text-admin-text-muted hover:text-admin-text-primary transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-1.5 text-admin-text-muted hover:text-admin-text-primary transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-admin-brand text-white rounded-xl text-base font-bold shadow-md hover:bg-admin-brand-light transition-colors">
          <Send className="w-5 h-5" /> Send Message
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="sticky bottom-0 bg-admin-brand-bg border-t border-admin-border/30">
        <div className="flex items-center justify-around py-3">
          {[
            { label: 'Inbox', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', active: true },
            { label: 'Sent', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
            { label: 'Drafts', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
            { label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
          ].map((item) => (
            <button key={item.label} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full ${item.active ? 'bg-admin-brand text-white' : 'text-admin-text-muted'}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
