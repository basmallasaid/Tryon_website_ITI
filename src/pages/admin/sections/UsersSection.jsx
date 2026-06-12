import { Shirt, RefreshCw, Plus, Trash2 } from 'lucide-react';
import UserRow from '../components/UserRow';
import QuotaBar from '../components/QuotaBar';

const users = [
  { id: 1, initials: 'SA', name: 'Sara Al-Rashidi', email: 'sara@example.com', avatarBg: '#8ED321', role: 'Premium', tryOn: { used: 48, total: 50 }, recycling: { used: 22, total: 30 }, status: 'Active' },
  { id: 2, initials: 'AH', name: 'Ahmed Hassan', email: 'ahmed@example.com', avatarBg: '#3B82F6', role: 'Store Owner', tryOn: { used: 10, total: 20 }, recycling: { used: 6, total: 10 }, status: 'Active' },
  { id: 3, initials: 'LN', name: 'Layla Nasser', email: 'layla@example.com', avatarBg: '#8B5CF6', role: 'User', tryOn: { used: 5, total: 5 }, recycling: { used: 3, total: 5 }, status: 'Active' },
  { id: 4, initials: 'KO', name: 'Khalid Omar', email: 'khalid@example.com', avatarBg: '#F97316', role: 'Premium', tryOn: { used: 28, total: 50 }, recycling: { used: 14, total: 30 }, status: 'Active' },
  { id: 5, initials: 'MI', name: 'Mona Ibrahim', email: 'mona@example.com', avatarBg: '#EC4899', role: 'User', tryOn: { used: 5, total: 5 }, recycling: { used: 5, total: 5 }, status: 'Suspended' },
  { id: 6, initials: 'YK', name: 'Yusuf Karim', email: 'yusuf@example.com', avatarBg: '#14B8A6', role: 'Store Owner', tryOn: { used: 8, total: 20 }, recycling: { used: 4, total: 10 }, status: 'Active' },
];

const stats = [
  { label: 'TOTAL USERS', value: '1,284', valueColor: 'text-admin-text-primary' },
  { label: 'ACTIVE NOW', value: '422', valueColor: 'text-admin-success' },
  { label: 'ROLES ASSIGNED', value: '12', valueColor: 'text-admin-text-primary' },
  { label: 'PENDING INVITES', value: '28', valueColor: 'text-admin-amber' },
];

const statusStyles = {
  Active: 'bg-[rgba(142,211,33,0.1)] text-[#5A8A10]',
  Suspended: 'bg-[#FFE2E2] text-[#FB2C36]',
};

const roleStyles = {
  Premium: { bg: 'rgba(139,92,246,0.082)', color: '#8B5CF6' },
  'Store Owner': { bg: 'rgba(59,130,246,0.082)', color: '#3B82F6' },
  User: { bg: 'rgba(107,114,128,0.082)', color: '#6B7280' },
};

export default function UsersSection({ onAddUser }) {
  // TODO: Replace mock data and handlers with actual API integration
  const handleFilter = () => { };
  const handleAssign = (userId) => { };
  const handleDelete = (userId) => { };

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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-xs font-medium text-admin-text-secondary tracking-[0.6px] uppercase">{stat.label}</span>
              <span className={`text-xl font-bold tracking-[-0.2px] ${stat.valueColor}`}>{stat.value}</span>
            </div>
          ))}
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
                <th className="py-2.5 px-4 text-[11px] font-semibold text-[#99A1AF] uppercase tracking-[0.6px] text-right whitespace-nowrap sticky right-0 bg-[#F5F7FA] after:absolute after:inset-y-0 after:-left-3 after:w-3 after:bg-gradient-to-r after:from-transparent after:to-[#F5F7FA]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-admin-brand-activeBg border border-admin-border/30 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-[10px] font-medium text-admin-text-secondary tracking-[0.5px] uppercase">{stat.label}</span>
              <span className={`text-lg font-bold tracking-[-0.2px] ${stat.valueColor}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3">
          {users.map((user) => {
            const roleStyle = roleStyles[user.role] || roleStyles.User;
            return (
              <div key={user.id} className="bg-white rounded-xl border border-admin-border/40 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: user.avatarBg }}
                    >
                      <span className="text-xs font-bold text-white">{user.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E1E24] leading-5 truncate">{user.name}</p>
                      <p className="text-xs text-[#99A1AF] leading-4 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[user.status] || 'bg-admin-border/20 text-admin-text-muted'}`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <span
                    className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <QuotaBar
                    icon={Shirt}
                    iconColor="text-brand-secondary"
                    used={user.tryOn.used}
                    total={user.tryOn.total}
                    barColor="bg-brand-secondary"
                  />
                  <QuotaBar
                    icon={RefreshCw}
                    iconColor="text-[#2B7FFF]"
                    used={user.recycling.used}
                    total={user.recycling.total}
                    barColor="bg-[#3B82F6]"
                  />
                </div>

                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-admin-border/20">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-[#99A1AF]"
                    title="Assign role"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-[#99A1AF]"
                    title="Delete user"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onAddUser} className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-admin-brand text-white shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
