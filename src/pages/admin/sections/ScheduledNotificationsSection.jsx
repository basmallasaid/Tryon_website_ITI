import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getScheduledNotificationsApi, cancelScheduledNotificationApi, broadcastNotificationApi, sendToUserNotificationApi } from '../../../api/adminApi';
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

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

function EditModal({ notification, onClose, onSave }) {
  const { t } = adminI18n;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notification?.scheduledAt) {
      const d = new Date(notification.scheduledAt);
      setDate(d.toISOString().split('T')[0]);
      setTime(d.toTimeString().slice(0, 5));
    }
  }, [notification]);

  const handleSave = async () => {
    if (!date || !time) return;
    setSaving(true);
    try {
      const newScheduledAt = new Date(`${date}T${time}`).toISOString();
      const payload = {
        title: notification.title,
        message: notification.body,
        channels: ['app'],
        scheduledAt: newScheduledAt,
      };
      await cancelScheduledNotificationApi(notification._id);
      const user = notification.userId;
      if (user?.email) {
        await sendToUserNotificationApi({ ...payload, email: user.email });
      } else {
        await broadcastNotificationApi(payload);
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reschedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-admin-border/30">
          <h3 className="text-lg font-bold text-admin-text-primary">{t('admin.scheduledNotifications.editSchedule')}</h3>
          <button onClick={onClose} className="p-1 hover:bg-admin-border/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-admin-text-muted" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-admin-text-primary mb-1">{notification.title}</p>
            <p className="text-xs text-admin-text-muted line-clamp-2">{notification.body}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-admin-text-primary mb-1.5">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-admin-text-primary mb-1.5">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-admin-border/30">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-admin-text-secondary hover:bg-admin-border/20 rounded-lg transition-colors">
            {t('admin.common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !date || !time}
            className="px-5 py-2 bg-admin-brand text-white rounded-lg text-sm font-medium hover:bg-admin-brand-light transition-colors disabled:opacity-50"
          >
            {saving ? t('admin.common.loading') : t('admin.common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScheduledNotificationsSection({ onBack, onAddNotification }) {
  const { t } = adminI18n;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNotification, setEditingNotification] = useState(null);

  const fetchScheduled = async () => {
    setLoading(true);
    try {
      const res = await getScheduledNotificationsApi();
      setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : []);
    } catch (err) {
      console.error('Failed to fetch scheduled notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScheduled(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this scheduled notification?')) return;
    try {
      await cancelScheduledNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  };

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = notifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
        </button>
        <h1 className="text-2xl sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{t('admin.scheduledNotifications.title')}</h1>
      </div>
      <p className="text-sm text-admin-text-secondary mt-1 mb-6 ml-12">{t('admin.scheduledNotifications.description')}</p>

      <div className="hidden md:block bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-admin-text-primary">{t('admin.scheduledNotifications.upcoming')}</h2>
          <button onClick={onAddNotification} className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors">
            <Calendar className="w-4 h-4" /> {t('admin.scheduledNotifications.scheduleNew')}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border/40">
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.titleCol')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.notifications.messageCol')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.scheduledNotifications.recipient')}</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.scheduledNotifications.scheduledFor')}</th>
              <th className="text-right text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">{t('admin.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.notifications.loading')}</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((n) => {
                const userEmail = n.userId?.email || '—';
                return (
                  <tr key={n._id} className="border-b border-admin-border/30 hover:bg-admin-brand-activeBg/20 transition-colors">
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
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-admin-brand" />
                        <span className="text-sm text-admin-text-primary font-medium">{formatDateTime(n.scheduledAt)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingNotification(n)} className="p-2 text-admin-text-muted hover:text-admin-brand hover:bg-admin-brand/10 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleCancel(n._id)} className="p-2 text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded-lg transition-colors" title="Cancel">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">{t('admin.scheduledNotifications.noScheduled')}</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            {loading ? t('admin.notifications.loading') : t('admin.notifications.showing', { from: notifications.length === 0 ? 0 : startIdx + 1, to: Math.min(startIdx + ITEMS_PER_PAGE, notifications.length), total: notifications.length })}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onAddNotification} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium">
            <Calendar className="w-4 h-4" /> {t('admin.scheduledNotifications.scheduleNew')}
          </button>
        </div>
        <div className="bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.notifications.loading')}</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((n) => {
              const userEmail = n.userId?.email || '—';
              return (
                <div key={n._id} className="p-4 border-b border-admin-border/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-admin-text-primary">{n.title}</p>
                      <p className="text-xs text-admin-text-secondary mt-0.5">{userEmail}</p>
                      <p className="text-xs text-admin-text-secondary mt-1 line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-admin-brand" />
                        <span className="text-xs font-medium text-admin-brand">{formatDateTime(n.scheduledAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button onClick={() => setEditingNotification(n)} className="p-1.5 text-admin-text-muted hover:text-admin-brand rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleCancel(n._id)} className="p-1.5 text-admin-text-muted hover:text-admin-danger rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-center text-sm text-admin-text-muted">{t('admin.scheduledNotifications.noScheduled')}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-admin-text-muted">
            {loading ? t('admin.notifications.loading') : t('admin.notifications.showing', { from: notifications.length === 0 ? 0 : startIdx + 1, to: Math.min(startIdx + ITEMS_PER_PAGE, notifications.length), total: notifications.length })}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {editingNotification && (
        <EditModal
          notification={editingNotification}
          onClose={() => setEditingNotification(null)}
          onSave={() => { setEditingNotification(null); fetchScheduled(); }}
        />
      )}
    </div>
  );
}