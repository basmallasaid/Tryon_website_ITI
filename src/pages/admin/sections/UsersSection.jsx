import { useState, useEffect } from 'react';
import { Shirt, RefreshCw, Plus, Trash2, Filter } from 'lucide-react';
import UserRow from '../components/UserRow';
import QuotaBar from '../components/QuotaBar';
import { getUsersApi, getUserStatsApi, deleteProductApi } from '../../../api/adminApi';

const avatarColors = ['#8ED321', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6', '#EF4444', '#06B6D4'];

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?';
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function mapRole(user) {
  if (user.role === 'admin') return 'Admin';
  if (user.subscriptionStatus === 'active') return 'Premium';
  return 'User';
}

function getStatus(user) {
  return user.is_verified ? 'Active' : 'Inactive';
}

const TRYON_LIMIT = 50;
const RECYCLE_LIMIT = 30;

export default function UsersSection({ onAddUser }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

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

  useEffect(() => { fetchData(); }, []);

  const mapped = users.map((u) => {
    const name = [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ') || u.email;
    const role = mapRole(u);
    return {
      id: u._id,
      initials: getInitials(u.profile?.first_name, u.profile?.last_name),
      name,
      email: u.email,
      avatarBg: getAvatarColor(name),
      role,
      tryOn: { used: u.latestTryOn?.length || 0, total: TRYON_LIMIT },
      recycling: { used: u.latestRecycle?.length || 0, total: RECYCLE_LIMIT },
      status: getStatus(u),
    };
  });

  const filtered = mapped.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const statCards = stats ? [
    { label: 'TOTAL USERS', value: stats.total.toLocaleString(), valueColor: 'text-admin-text-primary' },
    { label: 'VERIFIED', value: stats.active.toLocaleString(), valueColor: 'text-admin-success' },
    { label: 'ADMINS', value: stats.admins.toLocaleString(), valueColor: 'text-admin-text-primary' },
    { label: 'NEW (7 DAYS)', value: stats.recentWeek.toLocaleString(), valueColor: 'text-admin-amber' },
  ] : [
    { label: 'TOTAL USERS', value: '—', valueColor: 'text-admin-text-primary' },
    { label: 'VERIFIED', value: '—', valueColor: 'text-admin-success' },
    { label: 'ADMINS', value: '—', valueColor: 'text-admin-text-primary' },
    { label: 'NEW (7 DAYS)', value: '—', valueColor: 'text-admin-amber' },
  ];

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:block p-4 md:p-6 lg:p-0">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Users Management</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Oversee your team access, roles, and store assignments.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-xs font-medium text-admin-text-secondary tracking-[0.6px] uppercase">{stat.label}</span>
              <span className={`text-xl font-bold tracking-[-0.2px] ${stat.valueColor}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-admin-input border border-admin-border rounded-xl w-[220px]">
            <Filter className="w-[14px] h-[14px] text-admin-text-secondary" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-admin-input border border-admin-border rounded-xl text-xs text-admin-text-secondary outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Premium">Premium</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-[#BEC8D1] shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[700px] md:min-w-0">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#F3F4F6]">
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] whitespace-nowrap">User</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] whitespace-nowrap">Role</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] whitespace-nowrap">Virtual Try-On</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] whitespace-nowrap">Recycling</th>
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">Loading users…</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-admin-text-muted">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">Users Management</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Oversee your team access, roles, and store assignments.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-[10px] font-medium text-admin-text-secondary tracking-[0.5px] uppercase">{stat.label}</span>
              <span className={`text-lg font-bold tracking-[-0.2px] ${stat.valueColor}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-admin-input border border-admin-border rounded-xl">
          <Filter className="w-3.5 h-3.5 text-admin-text-secondary" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
          />
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-admin-text-muted py-8">Loading users…</p>
          ) : filtered.length > 0 ? (
            filtered.map((user) => (
              <UserRow key={user.id} user={user} mobile />
            ))
          ) : (
            <p className="text-center text-sm text-admin-text-muted py-8">No users found.</p>
          )}
        </div>

        <button onClick={onAddUser} className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-admin-brand text-white shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
