import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import NotificationRow from '../components/NotificationRow';
import NotificationCard from '../components/NotificationCard';
import { getNotificationsApi } from '../../../api/adminApi';

const ITEMS_PER_PAGE = 4;

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationsSection({ onAddNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsApi();
        setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = notifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
          Notification Center
        </h1>
        <p className="text-sm text-admin-text-secondary mt-2">
          Your recent notifications for <span className="font-semibold text-admin-text-primary">Fashion Store</span>
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/40">
          <h2 className="text-sm font-bold text-admin-text-primary">Recent Notifications</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border/40">
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Title</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Message</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Type</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">Loading notifications…</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((n) => (
                <NotificationRow key={n._id} notification={n} />
              ))
            ) : (
              <tr><td colSpan={4} className="py-12 text-center text-sm text-admin-text-muted">No notifications yet.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            {loading ? 'Loading…' : `Showing ${notifications.length === 0 ? 0 : startIdx + 1}-${Math.min(startIdx + ITEMS_PER_PAGE, notifications.length)} of ${notifications.length} notifications`}
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

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onAddNotification} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium">
            <Bell className="w-4 h-4" /> Create New
          </button>
        </div>
        <div className="bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-4 text-center text-sm text-admin-text-muted">Loading notifications…</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((n) => (
              <NotificationCard key={n._id} notification={n} />
            ))
          ) : (
            <p className="p-4 text-center text-sm text-admin-text-muted">No notifications yet.</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-admin-text-muted">
            {loading ? 'Loading…' : `Showing ${notifications.length === 0 ? 0 : startIdx + 1}-${Math.min(startIdx + ITEMS_PER_PAGE, notifications.length)} of ${notifications.length} notifications`}
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
      </div>
    </div>
  );
}
