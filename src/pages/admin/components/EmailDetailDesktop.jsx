import { ArrowLeft, Printer, MoreVertical, Star, Paperclip, Send, Trash2 } from 'lucide-react';

export default function EmailDetailDesktop({ email, onBack, onMarkRead, onDelete }) {
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
          <button className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-xs font-medium text-admin-text-primary hover:bg-admin-border/10 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="p-2 border border-admin-border rounded-lg hover:bg-admin-border/10 transition-colors">
            <MoreVertical className="w-4 h-4 text-admin-text-primary" />
          </button>
        </div>
      </div>

      {/* Message Card */}
      <div className="bg-white border border-admin-border/40 rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-admin-border/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-admin-brand/20 flex items-center justify-center">
                <span className="text-lg font-bold text-admin-brand">{email?.initials || 'JS'}</span>
              </div>
              <div>
                <p className="text-base font-bold text-admin-text-primary">{email?.sender || 'Julianne Smith'}</p>
                <p className="text-sm text-admin-text-muted">{email?.email || 'julianne.smith@fashionhub.com'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-admin-text-secondary">{email?.date || 'October 24, 2023'}</p>
              <p className="text-xs text-admin-text-muted">{email?.timeDetail || '10:45 AM (3 hours ago)'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-admin-brand-bg/50 border-b border-admin-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-admin-brand">
              {email?.subject || 'Re: Inventory discrepancy for Silk Scarves collection'}
            </span>
            {email?.tag && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-admin-success/20 text-admin-success rounded-full">
                {email.tag}
              </span>
            )}
          </div>
          <Star className={`w-5 h-5 ${email?.starred ? 'fill-admin-brand text-admin-brand' : 'text-admin-text-muted'}`} />
        </div>

        <div className="p-8">
          <div className="space-y-4 text-sm text-admin-text-primary leading-relaxed">
            <p>Hello Team,</p>
            <p>
              I hope you're having a good morning. I'm reaching out regarding the latest stock shipment we received for the "Aura Silk" scarves. Our internal warehouse scan shows 240 units arrived, but the Dolapy dashboard is only reflecting 215 units available for sale.
            </p>
            <p>
              I've attached the Bill of Lading (BOL_99321.pdf) for your reference. Looking forward to a quick resolution as we have customers waiting.
            </p>
            <p>Best regards,<br />Julianne Smith<br />Operations Director | FashionHub Retail</p>
          </div>

          {email?.attachment && (
            <div className="mt-6 pt-6 border-t border-admin-border/30">
              <p className="text-xs font-medium text-admin-text-muted uppercase tracking-wider mb-3">ATTACHMENTS (1)</p>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-admin-brand-bg border border-admin-border/30 rounded-xl">
                <Paperclip className="w-4 h-4 text-admin-brand" />
                <div>
                  <p className="text-xs font-bold text-admin-text-primary">{email.attachment.name}</p>
                  <p className="text-[10px] text-admin-text-muted font-mono">{email.attachment.size}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                defaultValue={email?.email || 'julianne.smith@fashionhub.com'}
                className="w-full px-4 py-2.5 bg-white border border-admin-border/40 rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-muted mb-1">CC</label>
              <input
                type="text"
                placeholder="Add recipients..."
                className="w-full px-4 py-2.5 bg-white border border-admin-border/40 rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-admin-text-muted mb-1">Subject</label>
            <input
              type="text"
              defaultValue={`Re: ${email?.subject || 'Inventory discrepancy for Silk Scarves collection'}`}
              className="w-full px-4 py-2.5 bg-white border border-admin-border/40 rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-admin-text-muted mb-1">Message Body</label>
            <div className="border border-admin-border/40 rounded-xl overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 bg-admin-brand-bg/50 border-b border-admin-border/30">
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary font-bold text-sm">B</button>
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary italic text-sm">I</button>
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary underline text-sm">U</button>
                <div className="w-px h-5 bg-admin-border/30 mx-1" />
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
                </button>
                <div className="w-px h-5 bg-admin-border/30 mx-1" />
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </button>
                <button className="p-1.5 hover:bg-admin-border/20 rounded text-admin-text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                </button>
              </div>
              <textarea
                rows={8}
                defaultValue={`Hi Julianne,\n\nThank you for bringing this to our attention. I've initiated a manual sync between our inventory processing system and the store front dashboard.\n\nIt appears there was a slight delay in the high-volume SKU processing for the Aura Silk collection. I will personally monitor the reconciliation until all 240 units are correctly visible.\n\nYou should see the update reflected in your dashboard within the next 15-20 minutes.`}
                className="w-full px-4 py-3 bg-white text-sm text-admin-text-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-admin-brand-bg/30 border-t border-admin-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors text-admin-text-muted">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors text-admin-text-muted">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </button>
            <button onClick={onDelete} className="p-2 hover:bg-admin-danger/10 rounded-lg transition-colors text-admin-danger">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-admin-border rounded-xl text-xs font-bold text-admin-text-primary hover:bg-admin-border/10 transition-colors">
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-bold shadow-md hover:bg-admin-brand-light transition-colors">
              Send Reply <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
