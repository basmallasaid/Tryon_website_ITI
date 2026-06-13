import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Mail, CheckCheck } from 'lucide-react';
import EmailRow from '../components/EmailRow';
import EmailCard from '../components/EmailCard';
import EmailDetailDesktop from '../components/EmailDetailDesktop';
import EmailDetailMobile from '../components/EmailDetailMobile';
import {
  getEmailsApi, getEmailThreadApi, markEmailReadApi, markAllEmailsReadApi, replyToEmailApi,
  getContactMessagesApi, markContactReadApi,
} from '../../../api/adminApi';
import adminI18n from '../../../i18n/admin/adminI18n';

const ITEMS_PER_PAGE = 4;

function timeAgo(dateStr, t) {
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return t('admin.emailCenter.yesterday');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTimeDetail(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function mapEmailToCard(e, t) {
  const senderName = e.senderUserId?.profile?.first_name
    ? `${e.senderUserId.profile.first_name} ${e.senderUserId.profile.last_name || ''}`.trim()
    : e.senderEmail || 'Unknown';
  return {
    id: e._id,
    source: 'email',
    initials: getInitials(senderName),
    sender: senderName,
    email: e.senderEmail,
    subject: e.subject,
    preview: e.message?.slice(0, 120) || '',
    body: e.message || '',
    time: timeAgo(e.created_at, t),
    date: formatFullDate(e.created_at),
    timeDetail: formatTimeDetail(e.created_at),
    unread: !e.isRead,
    starred: false,
    tag: e.emailType === 'USER_TO_ADMIN' ? t('admin.emailCenter.inbound') : e.emailType === 'ADMIN_TO_ALL' ? t('admin.emailCenter.broadcast') : null,
    emailType: e.emailType,
    threadId: e.parentEmailId?._id || e._id,
    _raw: e,
  };
}

function mapContactToCard(m, t) {
  const initials = getInitials(m.name);
  return {
    id: m._id,
    source: 'contact',
    initials,
    sender: m.name,
    email: m.email,
    subject: t('admin.emailCenter.contactFrom', { name: m.name }),
    preview: m.message?.slice(0, 120) || '',
    body: m.message || '',
    time: timeAgo(m.created_at, t),
    date: formatFullDate(m.created_at),
    timeDetail: formatTimeDetail(m.created_at),
    unread: !m.read,
    starred: false,
    tag: t('admin.emailCenter.contact'),
    emailType: null,
    threadId: null,
    _raw: m,
  };
}

export default function EmailCenterSection({ onReadChange }) {
  const { t } = adminI18n;
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [thread, setThread] = useState(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Inbox');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      const [emailRes, contactRes] = await Promise.all([
        getEmailsApi().catch(() => ({ data: { emails: [] } })),
        getContactMessagesApi().catch(() => ({ data: [] })),
      ]);
      const rawEmails = Array.isArray(emailRes.data?.emails) ? emailRes.data.emails : [];
      const rawContacts = Array.isArray(contactRes.data) ? contactRes.data : [];
      const all = [
        ...rawEmails.map((e) => mapEmailToCard(e, t)),
        ...rawContacts.map((m) => mapContactToCard(m, t)),
      ].sort((a, b) => {
        const da = new Date(a._raw.created_at);
        const db = new Date(b._raw.created_at);
        return db - da;
      });
      setEmails(all);
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  useEffect(() => {
    if (!loading && onReadChange) onReadChange();
  }, [loading, onReadChange]);

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    setReplyText('');
    setThread(null);

    if (email.source === 'contact') {
      if (email.unread) {
        try {
          await markContactReadApi(email.id);
          setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, unread: false } : e));
          setSelectedEmail((prev) => prev ? { ...prev, unread: false } : prev);
          if (onReadChange) onReadChange();
        } catch (err) {
          console.error('Failed to mark contact as read:', err);
        }
      }
      return;
    }

    setLoadingThread(true);
    try {
      const res = await getEmailThreadApi(email.threadId);
      setThread(res.data);
      if (email.unread) {
        await markEmailReadApi(email.id, true);
        setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, unread: false } : e));
        setSelectedEmail((prev) => prev ? { ...prev, unread: false } : prev);
        if (onReadChange) onReadChange();
      }
    } catch (err) {
      console.error('Failed to load thread:', err);
    } finally {
      setLoadingThread(false);
    }
  };

  const handleMarkRead = async (email) => {
    if (!email) return;
    try {
      if (email.source === 'contact') {
        await markContactReadApi(email.id);
      } else {
        await markEmailReadApi(email.id, !email.unread);
      }
      setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, unread: !email.unread } : e));
      setSelectedEmail((prev) => prev ? { ...prev, unread: !prev.unread } : prev);
      if (onReadChange) onReadChange();
    } catch (err) {
      console.error('Failed to toggle read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllEmailsReadApi();
      const contactRes = await getContactMessagesApi().catch(() => ({ data: [] }));
      const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];
      const unreadContacts = contacts.filter((c) => !c.read);
      await Promise.all(unreadContacts.map((c) => markContactReadApi(c._id).catch(() => {})));
      setEmails((prev) => prev.map((e) => ({ ...e, unread: false })));
      if (onReadChange) onReadChange();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedEmail || !selectedEmail.threadId) return;
    setSending(true);
    try {
      await replyToEmailApi(selectedEmail.threadId, { message: replyText.trim() });
      setReplyText('');
      const res = await getEmailThreadApi(selectedEmail.threadId);
      setThread(res.data);
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  const filtered = emails.filter((e) => {
    if (activeFilter === 'Inbox') {
      if (e.source === 'contact') return true;
      return e.emailType !== 'ADMIN_TO_USER' && e.emailType !== 'ADMIN_TO_ALL';
    }
    if (activeFilter === 'Unread') return e.unread;
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
            thread={thread}
            loadingThread={loadingThread}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            onSendReply={handleReply}
            sending={sending}
            onBack={() => { setSelectedEmail(null); setThread(null); }}
            onMarkRead={() => handleMarkRead(selectedEmail)}
          />
        </div>
        <EmailDetailMobile
          email={selectedEmail}
          thread={thread}
          loadingThread={loadingThread}
          replyText={replyText}
          onReplyTextChange={setReplyText}
          onSendReply={handleReply}
          sending={sending}
          onBack={() => { setSelectedEmail(null); setThread(null); }}
          onMarkRead={() => handleMarkRead(selectedEmail)}
        />
      </>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
              {t('admin.emailCenter.title')}
            </h1>
            <p className="text-sm text-admin-text-secondary mt-2">
              {t('admin.emailCenter.subtitle')}
            </p>
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-xl text-xs font-medium text-admin-text-secondary hover:bg-admin-brand-activeBg transition-colors disabled:opacity-50 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            {markingAll ? 'Marking...' : t('admin.emailCenter.markAllRead')}
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 border-b border-admin-border/40">
          {[{ key: 'Inbox', label: t('admin.emailCenter.inbox') }, { key: 'Unread', label: t('admin.emailCenter.unread') }, { key: 'All', label: t('admin.emailCenter.all') }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveFilter(key); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === key
                  ? 'bg-admin-brand text-white'
                  : 'bg-admin-border/30 text-admin-text-secondary hover:bg-admin-border/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-admin-brand-bg/50 border-b border-admin-border/40">
              <th className="py-3 px-4 w-12">
                <input type="checkbox" className="w-4 h-4 rounded border-admin-border accent-admin-brand" />
              </th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.emailCenter.sender')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.emailCenter.subjectMessage')}</th>
              <th className="text-right text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.emailCenter.received')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.emailCenter.loading')}</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((email) => (
                <EmailRow key={email.id} email={email} onSelect={handleSelectEmail} />
              ))
            ) : (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.emailCenter.noEmails')}</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            {loading ? t('admin.emailCenter.loading') : t('admin.emailCenter.showingMessages', { from: filtered.length === 0 ? 0 : startIdx + 1, to: Math.min(startIdx + ITEMS_PER_PAGE, filtered.length), total: filtered.length })}
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
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {[{ key: 'Inbox', label: t('admin.emailCenter.inbox') }, { key: 'Unread', label: t('admin.emailCenter.unread') }, { key: 'All', label: t('admin.emailCenter.all') }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveFilter(key); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === key
                  ? 'bg-admin-brand text-white'
                  : 'bg-admin-border/30 text-admin-text-secondary hover:bg-admin-border/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.emailCenter.loading')}</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((email) => (
              <EmailCard key={email.id} email={email} onSelect={handleSelectEmail} />
            ))
          ) : (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.emailCenter.noEmails')}</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-admin-text-muted">
              {t('admin.emailCenter.pageOf', { page: currentPage, totalPages })}
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

        <button className="fixed bottom-20 right-6 w-14 h-14 bg-admin-brand text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors z-10">
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
