import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Bell, ArrowLeft, Trash2, Zap, Clock, Filter, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAllNotificationsApi, deleteNotificationApi } from '../../../api/adminApi';
import adminI18n from '../../../i18n/admin/adminI18n';

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const ALL_TYPES = ['general', 'automated', 'scheduled', 'tryon', 'recycle', 'store', 'pricing'];

const getTypeConfig = (t) => ({
  tryon: { label: t('admin.notifications.tryOn'), color: 'bg-admin-brand/10 text-admin-brand' },
  recycle: { label: t('admin.notifications.recycle'), color: 'bg-admin-amber/10 text-admin-amber' },
  store: { label: t('admin.notifications.store'), color: 'bg-admin-success/10 text-admin-success' },
  pricing: { label: t('admin.notifications.pricing'), color: 'bg-admin-danger/10 text-admin-danger' },
  general: { label: t('admin.notifications.general'), color: 'bg-admin-border/20 text-admin-text-secondary' },
  automated: { label: t('admin.notifications.automated'), color: 'bg-admin-brand/10 text-admin-brand-light' },
  scheduled: { label: t('admin.notifications.scheduled'), color: 'bg-admin-amber/10 text-admin-amber' },
});

function NotificationDetail({ notification, onBack, onDelete }) {
  const { t } = adminI18n;
  const typeConfig = getTypeConfig(t);
  const config = typeConfig[notification.type] || typeConfig.general;
  const userEmail = notification.userId?.email || 'Unknown';
  const userName = [notification.userId?.profile?.first_name, notification.userId?.profile?.last_name].filter(Boolean).join(' ') || userEmail;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
        </button>
        <h1 className="text-[20px] font-bold text-admin-text-primary">{t('admin.notifications.notificationDetails')}</h1>
      </div>

      <div className="bg-surface-elevated border border-admin-border/40 rounded-xl shadow-sm">
        <div className="p-6 border-b border-admin-border/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-admin-brand/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-admin-brand" />
              </div>
              <div>
                <p className="text-base font-bold text-admin-text-primary">{userName}</p>
                <p className="text-sm text-admin-text-muted">{userEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-admin-text-secondary">{formatDate(notification.createdAt)}</p>
              <p className="text-xs text-admin-text-muted">{formatTime(notification.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-admin-brand-bg/50 border-b border-admin-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-admin-brand">{notification.title}</span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4 text-sm text-admin-text-primary leading-relaxed">
            <p>{notification.body}</p>
          </div>
        </div>

        <div className="p-4 border-t border-admin-border/30 flex justify-end">
          <button
            onClick={() => onDelete(notification._id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-orange hover:bg-accent-orange/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> {t('admin.common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsSection({ onAddNotification, onAutomatedNotifications, onScheduledNotifications }) {
  const { t } = adminI18n;
  const typeConfig = getTypeConfig(t);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const notifRes = await getAllNotificationsApi();
        setNotifications(Array.isArray(notifRes.data?.notifications) ? notifRes.data.notifications : []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
    setCurrentPage(1);
  };

  const filtered = selectedTypes.length > 0
    ? notifications.filter((n) => selectedTypes.includes(n.type))
    : notifications;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this notification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1550D3',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (selectedNotification?._id === id) setSelectedNotification(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (selectedNotification) {
    return (
      <NotificationDetail
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
        onDelete={handleDelete}
      />
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
          {t('admin.notifications.title')}
        </h1>
        <p className="text-sm text-admin-text-secondary mt-2">
          {t('admin.notifications.subtitle')}
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface-elevated border border-admin-border/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-admin-text-primary">{t('admin.notifications.allNotifications')}</h2>
          <div className="flex items-center gap-3">
            <button onClick={onScheduledNotifications} className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-xl text-xs font-medium text-admin-text-primary hover:bg-admin-brand-activeBg transition-colors">
              <Clock className="w-4 h-4" /> {t('admin.scheduledNotifications.title')}
            </button>
            <button onClick={onAutomatedNotifications} className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-xl text-xs font-medium text-admin-text-primary hover:bg-admin-brand-activeBg transition-colors">
              <Zap className="w-4 h-4" /> {t('admin.automatedNotifications.title')}
            </button>
            <button onClick={onAddNotification} className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors">
              <Bell className="w-4 h-4" /> {t('admin.notifications.createNew')}
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="px-6 py-3 border-b border-admin-border/40 flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${selectedTypes.length > 0 ? 'bg-admin-brand/10 border-admin-brand/30 text-admin-brand' : 'bg-admin-brand-bg border-admin-border text-admin-text-secondary hover:bg-admin-brand-activeBg'}`}
            >
              <Filter className="w-3.5 h-3.5" />
              {t('admin.notifications.filterByType')}
              {selectedTypes.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-admin-brand text-white rounded-full text-[10px]">{selectedTypes.length}</span>}
            </button>
            {showFilter && (
              <div className="absolute z-30 top-full left-0 mt-1 w-52 bg-surface-elevated border border-admin-border rounded-xl shadow-lg py-1">
                {ALL_TYPES.map((type) => {
                  const cfg = typeConfig[type];
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-admin-brand-activeBg/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-3.5 h-3.5 rounded border-admin-border accent-admin-brand"
                      />
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          {selectedTypes.length > 0 && (
            <button onClick={() => { setSelectedTypes([]); setCurrentPage(1); }} className="flex items-center gap-1 px-2 py-1 text-[11px] text-admin-text-muted hover:text-admin-text-primary transition-colors">
              <X className="w-3 h-3" /> {t('admin.notifications.clearFilter')}
            </button>
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border/40">
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.titleCol')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.messageCol')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.sentTo')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.typeCol')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.date')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.notifications.loading')}</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((n) => {
                const config = typeConfig[n.type] || typeConfig.general;
                const userEmail = n.userId?.email || '—';
                return (
                  <tr
                    key={n._id}
                    onClick={() => setSelectedNotification(n)}
                    className="border-b border-admin-border/40 hover:bg-admin-brand-activeBg/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-bold text-admin-text-primary">{n.title}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-admin-text-secondary line-clamp-1 max-w-xs">{n.body}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-admin-text-secondary">{userEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-admin-text-secondary">{formatDate(n.createdAt)}</p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.notifications.noNotifications')}</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            {loading ? t('admin.notifications.loading') : t('admin.notifications.showing', { from: filtered.length === 0 ? 0 : startIdx + 1, to: Math.min(startIdx + ITEMS_PER_PAGE, filtered.length), total: filtered.length })}
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
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onScheduledNotifications} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-xl text-xs font-medium text-admin-text-primary">
            <Clock className="w-4 h-4" /> {t('admin.scheduledNotifications.title')}
          </button>
          <button onClick={onAutomatedNotifications} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-xl text-xs font-medium text-admin-text-primary">
            <Zap className="w-4 h-4" /> {t('admin.automatedNotifications.title')}
          </button>
          <button onClick={onAddNotification} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium">
            <Bell className="w-4 h-4" /> {t('admin.notifications.createNew')}
          </button>
        </div>
        <div className="bg-surface-elevated border border-admin-border/40 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.notifications.loading')}</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((n) => {
              const config = typeConfig[n.type] || typeConfig.general;
              const userEmail = n.userId?.email || '—';
              return (
                <div
                  key={n._id}
                  onClick={() => setSelectedNotification(n)}
                  className="flex items-start gap-3 p-4 border-b border-admin-border/30 cursor-pointer hover:bg-admin-brand-activeBg/20 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full bg-admin-brand`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-admin-text-primary truncate">{n.title}</p>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-admin-text-secondary mt-0.5">{userEmail}</p>
                    <p className="text-xs text-admin-text-secondary mt-1 line-clamp-2">{n.body}</p>
                  </div>
                  <span className="text-[11px] text-admin-text-muted whitespace-nowrap shrink-0">{formatDate(n.createdAt)}</span>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.notifications.noNotifications')}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-admin-text-muted">
            {loading ? t('admin.notifications.loading') : t('admin.notifications.showing', { from: filtered.length === 0 ? 0 : startIdx + 1, to: Math.min(startIdx + ITEMS_PER_PAGE, filtered.length), total: filtered.length })}
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
