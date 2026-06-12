import { Users } from 'lucide-react';

export default function TotalUsersCard({ totalStores = 0, loading = false }) {
  return (
    <div className="flex-1 h-[78px] bg-admin-brand-bg border border-admin-border rounded-card px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-admin-text-secondary" style={{ letterSpacing: '0.24px' }}>Total Stores</p>
        <p className="text-xl font-medium text-admin-text-primary tracking-[-0.2px] mt-1">{loading ? '—' : totalStores.toLocaleString()}</p>
      </div>
      <Users className="w-6 h-6 text-admin-text-secondary" />
    </div>
  );
}
