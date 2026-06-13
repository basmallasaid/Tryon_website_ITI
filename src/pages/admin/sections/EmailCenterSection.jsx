import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Mail } from 'lucide-react';
import EmailRow from '../components/EmailRow';
import EmailCard from '../components/EmailCard';
import EmailDetailDesktop from '../components/EmailDetailDesktop';
import EmailDetailMobile from '../components/EmailDetailMobile';
import { getNotificationsApi, getContactMessagesApi, markContactReadApi, deleteContactApi } from '../../../api/adminApi';

const ITEMS_PER_PAGE = 4;

const typeSenders = {
  tryon: { name: 'Try-On System', email: 'tryon@redolapy.com' },
  recycle: { name: 'Recycle System', email: 'recycle@redolapy.com' },
  store: { name: 'Store Updates', email: 'stores@redolapy.com' },
  pricing: { name: 'Pricing Alerts', email: 'pricing@redolapy.com' },
  general: { name: 'ReDolapy Team', email: 'admin@redolapy.com' },
};

function mapNotificationToEmail(n) {
  const sender = typeSenders[n.type] || typeSenders.general;
  const initials = sender.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const d = new Date(n.createdAt);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  let time;
  if (diff < 60) time = `${diff}s ago`;
  else if (diff < 3600) time = `${Math.floor(diff / 60)}m ago`;
  else if (diff < 86400) time = `${Math.floor(diff / 3600)}h ago`;
  else if (diff < 172800) time = 'Yesterday';
  else time = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    id: n._id,
    source: 'notification',
    initials,
    sender: sender.name,
    email: sender.email,
    subject: n.title,
    preview: n.body,
    body: n.body,
    time,
    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    timeDetail: d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    unread: !n.read,
    starred: false,
    tag: n.type !== 'general' ? n.type.charAt(0).toUpperCase() + n.type.slice(1) : null,
    attachment: null,
    previousReply: null,
  };
}

function mapContactToEmail(m) {
  const nameWords = m.name.split(' ');
  const initials = nameWords.map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const d = new Date(m.created_at);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  let time;
  if (diff < 60) time = `${diff}s ago`;
  else if (diff < 3600) time = `${Math.floor(diff / 60)}m ago`;
  else if (diff < 86400) time = `${Math.floor(diff / 3600)}h ago`;
  else if (diff < 172800) time = 'Yesterday';
  else time = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    id: m._id,
    source: 'contact',
    initials,
    sender: m.name,
    email: m.email,
    subject: `Contact from ${m.name}`,
    preview: m.message,
    body: m.message,
    time,
    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    timeDetail: d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    unread: !m.read,
    starred: false,
    tag: 'Contact',
    attachment: null,
    previousReply: null,
  };
}

export default function EmailCenterSection({ onReadChange }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const [notifRes, contactRes] = await Promise.all([
          getNotificationsApi(),
          getContactMessagesApi(),
        ]);
        const notifs = Array.isArray(notifRes.data?.notifications) ? notifRes.data.notifications : [];
        const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];
        const allEmails = [
          ...notifs.map(mapNotificationToEmail),
          ...contacts.map(mapContactToEmail),
        ].sort((a, b) => {
          const da = new Date(a.timeDetail || a.date);
          const db = new Date(b.timeDetail || b.date);
          return db - da;
        });
        setEmails(allEmails);
      } catch (err) {
        console.error('Failed to fetch emails:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (!loading && onReadChange) {
      onReadChange();
    }
  }, [loading, onReadChange]);

  const handleMarkRead = async (id, source) => {
    if (source !== 'contact') return;
    try {
      await markContactReadApi(id);
      setEmails((prev) => prev.map((e) => e.id === id ? { ...e, unread: false } : e));
      if (onReadChange) onReadChange();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id, source) => {
    if (source !== 'contact') return;
    if (!confirm('Delete this contact message?')) return;
    try {
      await deleteContactApi(id);
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selectedEmail?.id === id) setSelectedEmail(null);
      if (onReadChange) onReadChange();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filtered = emails.filter((e) => {
    if (activeFilter === 'Unread') return e.unread;
    if (activeFilter === 'Important') return e.starred;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (selectedEmail) {
    return (
      <>
        <div className="hidden lg:block">
          <EmailDetailDesktop
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onMarkRead={() => handleMarkRead(selectedEmail.id, selectedEmail.source)}
            onDelete={() => handleDelete(selectedEmail.id, selectedEmail.source)}
          />
        </div>
        <EmailDetailMobile
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
          onMarkRead={() => handleMarkRead(selectedEmail.id, selectedEmail.source)}
          onDelete={() => handleDelete(selectedEmail.id, selectedEmail.source)}
        />
      </>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
          Email Center
        </h1>
        <p className="text-sm text-admin-text-secondary mt-2">
          Manage your inbox and respond to customer inquiries
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-admin-brand-bg/50 border-b border-admin-border/40">
              <th className="py-3 px-4 w-12">
                <input type="checkbox" className="w-4 h-4 rounded border-admin-border accent-admin-brand" />
              </th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">SENDER</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">SUBJECT & MESSAGE</th>
              <th className="text-right text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">RECEIVED</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">Loading emails…</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((email) => (
                <EmailRow key={email.id} email={email} onSelect={setSelectedEmail} />
              ))
            ) : (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">No emails yet.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            {loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : startIdx + 1}-${Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} messages`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {['All', 'Unread', 'Important'].map((filter) => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-admin-brand text-white'
                  : 'bg-admin-border/30 text-admin-text-secondary hover:bg-admin-border/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Email List */}
        <div className="bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-4 text-center text-sm text-admin-text-muted">Loading emails…</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((email) => (
              <EmailCard key={email.id} email={email} onSelect={setSelectedEmail} />
            ))
          ) : (
            <p className="p-4 text-center text-sm text-admin-text-muted">No emails yet.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-admin-text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile FAB */}
        <button className="fixed bottom-20 right-6 w-14 h-14 bg-admin-brand text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors z-10">
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
