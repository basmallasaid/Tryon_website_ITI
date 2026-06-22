import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Shirt,
  RefreshCw,
  Plus,
  Trash2,
  Filter,
  X,
  AlertTriangle,
  RotateCcw,
  Pencil,
} from 'lucide-react';
import UserRow from '../components/UserRow';
import QuotaBar from '../components/QuotaBar';
import {
  getUsersApi,
  getUserStatsApi,
  deleteUserApi,
  markUserNotifiedApi,
} from '../../../api/adminApi';
import adminI18n from '../../../i18n/admin/adminI18n';

const avatarColors = [
  '#8ED321',
  '#3B82F6',
  '#8B5CF6',
  '#F97316',
  '#EC4899',
  '#14B8A6',
  '#EF4444',
  '#06B6D4',
];

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?';
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function mapRole(user, t) {
  if (user.role === 'admin') return t('admin.users.admin');
  if (user.subscriptionStatus === 'active') {
    if (user.subscriptionInterval === 'month') return t('admin.users.premium') + ' (M)';
    if (user.subscriptionInterval === 'year') return t('admin.users.premium') + ' (Y)';
    return t('admin.users.premium');
  }
  return t('admin.users.userRole');
}

function getStatus(user, t) {
  return user.is_verified ? t('admin.users.active') : t('admin.users.inactive');
}

const LIMITS = {
  normal: { tryon: 5, recycle: 4 },
  premium_monthly: { tryon: 50, recycle: 40 },
  premium_yearly: { tryon: 600, recycle: 480 },
};

function getUserLimits(user) {
  if (user.subscriptionStatus === 'active') {
    if (user.subscriptionInterval === 'year') return LIMITS.premium_yearly;
    if (user.subscriptionInterval === 'month') return LIMITS.premium_monthly;
  }
  return LIMITS.normal;
}

function DeleteConfirmDialog({
  user,
  onClose,
  onSendNotification,
  onDelete,
  t,
}) {
  const notified = user?.deletionNotified || false;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface-elevated rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-admin-danger/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-admin-danger" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-admin-text-primary">
                {t('admin.users.deleteUser')}
              </h3>
              <p className="text-sm text-admin-text-secondary">{user?.email}</p>
            </div>
          </div>

          {notified ? (
            <p className="text-sm text-admin-text-secondary mb-6">
              {t('admin.users.deleteUserDesc')}
            </p>
          ) : (
            <p className="text-sm text-admin-text-secondary mb-6">
              {t('admin.users.deleteUserWarning')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-admin-brand-bg/50 border-t border-admin-border/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-admin-text-secondary hover:text-admin-text-primary transition-colors"
          >
            {t('admin.users.cancel')}
          </button>
          {notified ? (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              {t('admin.users.deleteUser')}
            </button>
          ) : (
            <button
              onClick={onSendNotification}
              className="px-4 py-2 bg-admin-brand text-white rounded-lg text-sm font-medium hover:bg-admin-brand-light transition-colors"
            >
              {t('admin.users.sendNotification')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersSection({
  onAddUser,
  roleFilter = 'All',
  onResetFilter,
  onSendDeletionNotification,
  onEditUser,
}) {
  const { t } = adminI18n;
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        getUsersApi(),
        getUserStatsApi(),
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mapped = users.map(u => {
    const name =
      [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ') ||
      u.email;
    const role = mapRole(u, t);
    const limits = getUserLimits(u);
    return {
      id: u._id,
      initials: getInitials(u.profile?.first_name, u.profile?.last_name),
      name,
      email: u.email,
      avatarBg: getAvatarColor(name),
      role,
      tryOn: { used: u.latestTryOn?.length || 0, total: limits.tryon },
      recycling: { used: u.latestRecycle?.length || 0, total: limits.recycle },
      status: getStatus(u, t),
      deletionNotified: u.deletionNotified || false,
    };
  });

  const filtered = mapped.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggle = id => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(u => u.id)));
    }
  };

  const handleDeleteClick = () => {
    if (selectedIds.size === 1) {
      const userId = [...selectedIds][0];
      const user = mapped.find(u => u.id === userId);
      setDeleteTarget(user);
    }
  };

  const handleSendNotification = async () => {
    if (deleteTarget) {
      try {
        await markUserNotifiedApi(deleteTarget.id);
        setUsers(prev =>
          prev.map(u =>
            u._id === deleteTarget.id ? { ...u, deletionNotified: true } : u,
          ),
        );
      } catch (err) {
        console.error('Failed to mark user as notified:', err);
      }
      onSendDeletionNotification?.(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUserApi(deleteTarget.id);
      setUsers(prev => prev.filter(u => u._id !== deleteTarget.id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      setDeleteTarget(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete user.', confirmButtonColor: '#1550D3' });
    } finally {
      setDeleting(false);
    }
  };

  const statCards = stats
    ? [
        {
          label: t('admin.users.totalUsers'),
          value: stats.total.toLocaleString(),
          valueColor: 'text-admin-text-primary',
        },
        {
          label: t('admin.users.verified'),
          value: stats.active.toLocaleString(),
          valueColor: 'text-admin-success',
        },
        {
          label: t('admin.users.admins'),
          value: stats.admins.toLocaleString(),
          valueColor: 'text-admin-text-primary',
        },
        {
          label: t('admin.users.newUsers'),
          value: stats.recentWeek.toLocaleString(),
          valueColor: 'text-admin-amber',
        },
      ]
    : [
        {
          label: t('admin.users.totalUsers'),
          value: '—',
          valueColor: 'text-admin-text-primary',
        },
        {
          label: t('admin.users.verified'),
          value: '—',
          valueColor: 'text-admin-success',
        },
        {
          label: t('admin.users.admins'),
          value: '—',
          valueColor: 'text-admin-text-primary',
        },
        {
          label: t('admin.users.newUsers'),
          value: '—',
          valueColor: 'text-admin-amber',
        },
      ];

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:block p-4 md:p-6 lg:p-0">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
            {t('admin.users.title')}
          </h1>
          <p className="text-sm text-admin-text-secondary mt-1">
            {t('admin.users.subtitle')}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-xs font-medium text-admin-text-secondary tracking-[0.6px] uppercase">
                {stat.label}
              </span>
              <span
                className={`text-xl font-bold tracking-[-0.2px] ${stat.valueColor}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-admin-input border border-admin-border rounded-xl w-[220px]">
            <Filter className="w-[14px] h-[14px] text-admin-text-secondary" />
            <input
              type="text"
              placeholder={t('admin.users.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
            />
          </div>
          {roleFilter !== 'All' && (
            <button
              onClick={onResetFilter}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-admin-brand bg-admin-brand-bg border border-admin-brand/30 rounded-lg hover:bg-admin-brand-activeBg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {roleFilter}
              <X className="w-3 h-3 ml-1" />
            </button>
          )}
          {selectedIds.size === 1 && (
            <button
              onClick={() => {
                const userId = [...selectedIds][0];
                const user = mapped.find(u => u.id === userId);
                onEditUser?.(user);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border text-admin-text-secondary rounded-lg text-xs font-medium hover:bg-admin-brand-activeBg transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              {t('admin.users.selectEdit')}
            </button>
          )}
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg text-xs font-medium hover:opacity-90 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('admin.users.selectDelete', { count: selectedIds.size })}
            </button>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-surface-elevated rounded-2xl border border-admin-border shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[700px] md:min-w-0">
            <thead>
              <tr className="bg-admin-brand-bg border-b border-admin-border">
                <th className="py-2.5 px-4 text-[11px] font-semibold text-admin-text-muted uppercase tracking-[0.6px] whitespace-nowrap">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 &&
                        selectedIds.size === filtered.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-admin-border accent-admin-brand cursor-pointer"
                    />
                    {t('admin.users.userCol')}
                  </span>
                </th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-admin-text-muted uppercase tracking-[0.6px] whitespace-nowrap">
                  {t('admin.users.roleCol')}
                </th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-admin-text-muted uppercase tracking-[0.6px] whitespace-nowrap">
                  {t('admin.users.virtualTryOn')}
                </th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-admin-text-muted uppercase tracking-[0.6px] whitespace-nowrap">
                  {t('admin.users.recycling')}
                </th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-admin-text-muted uppercase tracking-[0.6px] whitespace-nowrap">
                  {t('admin.users.statusCol')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-admin-text-muted"
                  >
                    {t('admin.users.loadingUsers')}
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selected={selectedIds.has(user.id)}
                    onToggle={handleToggle}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-admin-text-muted"
                  >
                    {t('admin.users.noUsers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">
            {t('admin.users.title')}
          </h1>
          <p className="text-sm text-admin-text-secondary mt-1">
            {t('admin.users.subtitle')}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map(stat => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-[10px] font-medium text-admin-text-secondary tracking-[0.5px] uppercase">
                {stat.label}
              </span>
              <span
                className={`text-lg font-bold tracking-[-0.2px] ${stat.valueColor}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-admin-input border border-admin-border rounded-xl">
          <Filter className="w-3.5 h-3.5 text-admin-text-secondary" />
          <input
            type="text"
            placeholder={t('admin.users.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
          />
        </div>

        {selectedIds.size === 1 && (
          <button
            onClick={() => {
              const userId = [...selectedIds][0];
              const user = mapped.find(u => u.id === userId);
              onEditUser?.(user);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-admin-brand-bg border border-admin-border text-admin-text-secondary rounded-xl text-xs font-medium"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t('admin.users.selectEdit')}
          </button>
        )}
        {selectedIds.size > 0 && (
          <button
            onClick={handleDeleteClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-orange text-white rounded-xl text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('admin.users.selectDelete', { count: selectedIds.size })}
          </button>
        )}

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-admin-text-muted py-8">
              {t('admin.users.loadingUsers')}
            </p>
          ) : filtered.length > 0 ? (
            filtered.map(user => (
              <UserRow
                key={user.id}
                user={user}
                mobile
                selected={selectedIds.has(user.id)}
                onToggle={handleToggle}
              />
            ))
          ) : (
            <p className="text-center text-sm text-admin-text-muted py-8">
              {t('admin.users.noUsers')}
            </p>
          )}
        </div>

        <button
          onClick={onAddUser}
          className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-admin-brand text-white shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSendNotification={handleSendNotification}
          onDelete={handleConfirmDelete}
          t={t}
        />
      )}
    </>
  );
}
